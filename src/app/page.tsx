'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/query-wise/header';
import { QueryInterface } from '@/components/query-wise/query-interface';
import { DataDisplay } from '@/components/query-wise/data-display';
import { Sun, Moon } from 'lucide-react';

export default function Home() {
  const [queryResult, setQueryResult] = useState<Record<string, any>[] | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rowLimit, setRowLimit] = useState(100);
  const [orderByColumn, setOrderByColumn] = useState<string | undefined>(undefined);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

  const handleQueryStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleQueryResult = ({ data, error: queryError }: { data?: any[] | null; error?: string }) => {
    if (queryError) {
      setError(queryError);
      setQueryResult(null);
    } else if (data) {
      // When new data arrives, if the current orderByColumn is not in the new columns, reset it.
      if (orderByColumn && data.length > 0 && !Object.keys(data[0]).includes(orderByColumn)) {
        setOrderByColumn(undefined);
      }
      setQueryResult(data);
      setError(null);
    }
    setIsLoading(false);
  };

  const handleTableChange = () => {
    // Reset values when table changes
    setRowLimit(100);
    setOrderByColumn(undefined);
    setOrderDirection('asc');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const columns = queryResult && queryResult.length > 0 ? Object.keys(queryResult[0]) : [];

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${theme}`}>
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <div className="absolute top-4 right-4">
          <Button onClick={toggleTheme} variant="outline" size="sm">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start h-full">
          <div className="lg:col-span-2 lg:sticky lg:top-8">
            <QueryInterface
              rowLimit={rowLimit}
              orderByColumn={orderByColumn}
              orderDirection={orderDirection}
              onQueryStart={handleQueryStart}
              onQueryResult={handleQueryResult}
              onTableChange={handleTableChange}
            />
          </div>
          <div className="lg:col-span-3">
            <div className="mb-4 flex flex-wrap gap-4 items-end">
              <div>
                <Label htmlFor="rowLimit">Row Limit</Label>
                <Input
                  id="rowLimit"
                  type="number"
                  value={rowLimit}
                  onChange={(e) => setRowLimit(Math.max(1, Number(e.target.value)))}
                  min="1"
                  className="w-24"
                />
              </div>
              {queryResult && queryResult.length > 0 && (
                <>
                  <div>
                    <Label htmlFor="orderByColumn">Order By</Label>
                    <Select onValueChange={(value) => setOrderByColumn(value)} value={orderByColumn}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a column" />
                      </SelectTrigger>
                      <SelectContent>
                         {columns.map((columnName) => (
                          <SelectItem key={columnName} value={columnName}>
                            {columnName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                     <Label htmlFor="orderDirection" className="invisible">Direction</Label>
                    <Select onValueChange={(value: 'asc' | 'desc') => setOrderDirection(value)} value={orderDirection}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
            <DataDisplay
              queryResult={queryResult}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
