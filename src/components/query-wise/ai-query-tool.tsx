'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateQueryAction, generateSqlAction, executeQueryAction } from '@/lib/actions';

interface AiQueryToolProps {
  onQueryStart: () => void;
  onQueryResult: (result: { data?: any[]; error?: string }) => void;
  rowLimit: number;
  orderByColumn: string | undefined;
  orderDirection: 'asc' | 'desc' | undefined;
  onTableChange: () => void; // Callback to reset values when table changes
}

export function AiQueryTool({ 
  onQueryStart, 
  onQueryResult, 
  rowLimit, 
  orderByColumn, 
  orderDirection, 
  onTableChange 
}: AiQueryToolProps) {
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [generatedSql, setGeneratedSql] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerateAndRun = () => {
    if (!naturalLanguageQuery) {
      toast({
        title: 'Input Required',
        description: 'Please enter a natural language query.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      onQueryStart();
      setGeneratedSql('');

      try {
        const validation = await validateQueryAction(naturalLanguageQuery, expectedOutput);
        if (!validation.isValid) {
          toast({
            title: 'Clarification Needed',
            description: validation.clarificationNeeded,
            variant: 'destructive',
            duration: 8000,
          });
          onQueryResult({ error: 'Query is not specific enough. Please provide more details.' });
          return;
        }

        const result = await generateSqlAction(naturalLanguageQuery);
        
        if (result.sqlQuery) {
          setGeneratedSql(result.sqlQuery);
        }

        if (result.missingDataExplanation) {
          toast({
            title: 'Query Issue',
            description: result.missingDataExplanation,
            variant: 'destructive',
            duration: 8000,
          });
          onQueryResult({ error: result.missingDataExplanation });
          return;
        }

        if (!result.tableName) {
          throw new Error('AI could not determine the table to query.');
        }

        // Reset values when executing a query (as it might be on a different table)
        onTableChange();

        const data = await executeQueryAction(result.tableName, result.whereClauses || [], rowLimit, orderByColumn, orderDirection);
        onQueryResult({ data });
        
      } catch (e: any) {
        onQueryResult({ error: e.message });
        toast({
          title: 'Error',
          description: e.message,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Query Generation</CardTitle>
        <CardDescription>Describe what you want to find in plain English, and our AI will translate it to SQL.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="natural-language-query">Your Request</Label>
          <Textarea
            id="natural-language-query"
            placeholder="e.g., 'Show me all users who signed up this year' or 'Find products that are low in stock'"
            value={naturalLanguageQuery}
            onChange={(e) => setNaturalLanguageQuery(e.target.value)}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expected-output">Expected Output (Optional)</Label>
          <Textarea
            id="expected-output"
            placeholder="e.g., 'A list of user names and their emails' or 'Product names and their stock levels'"
            value={expectedOutput}
            onChange={(e) => setExpectedOutput(e.target.value)}
            rows={2}
          />
        </div>
        {generatedSql && (
          <div className="space-y-2">
            <Label>Generated SQL</Label>
            <pre className="p-4 rounded-md bg-muted text-sm overflow-x-auto">
              <code className="font-mono">{generatedSql}</code>
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateAndRun} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate & Run Query
        </Button>
      </CardFooter>
    </Card>
  );
}
