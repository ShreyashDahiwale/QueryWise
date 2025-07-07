'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManualQueryBuilder } from './manual-query-builder';
import { AiQueryTool } from './ai-query-tool';
import { Wand2, Table } from 'lucide-react';

interface QueryInterfaceProps {
  onQueryStart: () => void;
  onQueryResult: (result: { data?: any[]; error?: string }) => void;
  rowLimit: number;
  orderByColumn: string | undefined;
  orderDirection: 'asc' | 'desc' | undefined;
}

export function QueryInterface({ onQueryStart, onQueryResult, rowLimit, orderByColumn, orderDirection }: QueryInterfaceProps) {
  return (
    <Tabs defaultValue="manual" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="manual">
          <Table className="mr-2 h-4 w-4" />
          Manual Builder
        </TabsTrigger>
        <TabsTrigger value="ai">
          <Wand2 className="mr-2 h-4 w-4" />
          AI Query Tool
        </TabsTrigger>
      </TabsList>
      <TabsContent value="manual" className="mt-4">
        <ManualQueryBuilder
          onQueryStart={onQueryStart}
          onQueryResult={onQueryResult}
          rowLimit={rowLimit}
          orderByColumn={orderByColumn}
          orderDirection={orderDirection}
        />
      </TabsContent>
      <TabsContent value="ai" className="mt-4">
        <AiQueryTool
          onQueryStart={onQueryStart}
          onQueryResult={onQueryResult}
          rowLimit={rowLimit}
          orderByColumn={orderByColumn}
          orderDirection={orderDirection}
        />
      </TabsContent>
    </Tabs>
  );
}
