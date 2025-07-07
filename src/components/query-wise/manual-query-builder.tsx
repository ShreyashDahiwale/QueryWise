'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { getTablesAction, getTableColumnsAction, executeQueryAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface ManualQueryBuilderProps {
  onQueryStart: () => void;
  onQueryResult: (result: { data?: any[] | null; error?: string }) => void;
  rowLimit: number;
  orderByColumn: string | undefined;
  orderDirection: 'asc' | 'desc' | undefined;
}

type WhereClause = {
  id: number;
  column: string;
  operator: string;
  value: string;
};

type TableInfo = {
  name: string;
  description: string;
};

type ColumnInfo = {
  name: string;
  type: string;
  description: string;
};

const operators = ['=', '!=', '>', '<', '>=', '<=', 'LIKE'];

export function ManualQueryBuilder({ onQueryStart, onQueryResult, rowLimit, orderByColumn, orderDirection }: ManualQueryBuilderProps) {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [whereClauses, setWhereClauses] = useState<WhereClause[]>([{ id: 1, column: '', operator: '=', value: '' }]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchTables() {
      const fetchedTables = await getTablesAction();
      setTables(fetchedTables);
    }
    fetchTables();
  }, []);

  useEffect(() => {
    async function fetchColumnsAndInitialData() {
      if (selectedTable) {
        onQueryStart();
        try {
          // Reset clauses only when table changes, not when params change
          setWhereClauses([{ id: 1, column: '', operator: '=', value: '' }]);
          
          const [fetchedColumns, data] = await Promise.all([
            getTableColumnsAction(selectedTable),
            executeQueryAction(selectedTable, [], rowLimit, orderByColumn, orderDirection)
          ]);

          setColumns(fetchedColumns);
          onQueryResult({ data });
        } catch (e: any) {
          onQueryResult({ error: e.message });
          toast({
            title: 'Error',
            description: e.message,
            variant: 'destructive',
          });
        }
      } else {
        // Clear results when no table is selected
        onQueryResult({ data: null });
        setColumns([]);
        setWhereClauses([{ id: 1, column: '', operator: '=', value: '' }]);
      }
    }

    fetchColumnsAndInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTable, rowLimit, orderByColumn, orderDirection]);


  const handleTableChange = (value: string) => {
    setSelectedTable(value);
  };

  const handleClauseChange = (id: number, field: keyof Omit<WhereClause, 'id'>, value: string) => {
    setWhereClauses(clauses =>
      clauses.map(clause =>
        clause.id === id ? { ...clause, [field]: value } : clause
      )
    );
  };

  const addClause = () => {
    setWhereClauses(clauses => [...clauses, { id: Date.now(), column: '', operator: '=', value: '' }]);
  };

  const removeClause = (id: number) => {
    setWhereClauses(clauses => clauses.filter(clause => clause.id !== id));
  };

  const handleRunQuery = () => {
    if (!selectedTable) {
      toast({ title: "Table not selected", description: "Please select a table to query.", variant: "destructive" });
      return;
    }
    startTransition(async () => {
      onQueryStart();
      try {
        const validClauses = whereClauses.filter(c => c.column && c.value);
        const data = await executeQueryAction(selectedTable, validClauses, rowLimit, orderByColumn, orderDirection);
        onQueryResult({ data });
      } catch (e: any) {
        onQueryResult({ error: e.message });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Query Builder</CardTitle>
        <CardDescription>Select a table and add conditions to filter your data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="table-select">Table</Label>
          <Select onValueChange={handleTableChange} value={selectedTable}>
            <SelectTrigger id="table-select">
              <SelectValue placeholder="Select a table..." />
            </SelectTrigger>
            <SelectContent>
              {tables.map(table => (
                <SelectItem key={table.name} value={table.name}>
                  {table.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTable && (
          <div>
            <Label>Conditions (WHERE clause)</Label>
            <div className="space-y-4 mt-2">
              {whereClauses.map((clause, index) => (
                <div key={clause.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-2 items-center">
                  <Select value={clause.column} onValueChange={(value) => handleClauseChange(clause.id, 'column', value)}>
                    <SelectTrigger><SelectValue placeholder="Column" /></SelectTrigger>
                    <SelectContent>{columns.map(col => <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={clause.operator} onValueChange={(value) => handleClauseChange(clause.id, 'operator', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{operators.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input placeholder="Value" value={clause.value} onChange={(e) => handleClauseChange(clause.id, 'value', e.target.value)} />
                  <Button variant="ghost" size="icon" onClick={() => removeClause(clause.id)} disabled={whereClauses.length === 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addClause}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Condition
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleRunQuery} disabled={!selectedTable || isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Run Query
        </Button>
      </CardFooter>
    </Card>
  );
}
