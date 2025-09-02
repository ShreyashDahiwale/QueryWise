'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface DataDisplayProps {
  queryResult: Record<string, any>[] | null;
  isLoading: boolean;
  error: string | null;
}

export function DataDisplay({ queryResult, isLoading, error }: DataDisplayProps) {
  const columns = queryResult && queryResult.length > 0 ? Object.keys(queryResult[0]) : [];

  const handleDownload = () => {
    if (!queryResult) return;

    const worksheet = XLSX.utils.json_to_sheet(queryResult);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    XLSX.writeFile(workbook, 'query_results.xlsx');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2 p-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-destructive text-center py-10 px-4">
          <p className="font-semibold text-lg">An error occurred</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      );
    }

    if (!queryResult) {
      return (
        <div className="text-muted-foreground text-center py-10 px-4">
          <p>Run a query to see the results here.</p>
        </div>
      );
    }
    
    if (queryResult.length === 0) {
      return (
        <div className="text-muted-foreground text-center py-10 px-4">
          <p>Query executed successfully, but returned no results.</p>
        </div>
      );
    }

    return (
      <div className="h-[60vh] w-full overflow-auto">
        <div className="min-w-max">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col} className="font-bold whitespace-nowrap px-4 py-3">{col.replace(/_/g, ' ').toUpperCase()}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {queryResult.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((col) => (
                    <TableCell key={`${rowIndex}-${col}`} className="whitespace-nowrap px-4 py-3">{String(row[col])}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Records</CardTitle>
            </div>
            {queryResult && queryResult.length > 0 && (
                <Button variant="outline" size="icon" onClick={handleDownload} aria-label="Download results">
                    <Download className="h-4 w-4" />
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
