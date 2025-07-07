import { config } from 'dotenv';
config();

import '@/ai/flows/generate-sql-from-natural-language.ts';
import '@/ai/flows/validate-natural-language-query.ts';