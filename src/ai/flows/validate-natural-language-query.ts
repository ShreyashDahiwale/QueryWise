//Validate the natural language query to see if the information provided is sufficient to generate the SQL query.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateNaturalLanguageQueryInputSchema = z.object({
  naturalLanguageQuery: z.string().describe('The natural language query to validate.'),
  tableNames: z.string().describe('The available table names in the database.'),
  expectedOutput: z.string().describe('The expected output from the SQL query.'),
});
export type ValidateNaturalLanguageQueryInput = z.infer<typeof ValidateNaturalLanguageQueryInputSchema>;

const ValidateNaturalLanguageQueryOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the information provided is sufficient to generate the SQL query.'),
  clarificationNeeded: z.string().optional().describe('If the information is insufficient, the question to ask for clarification.'),
});
export type ValidateNaturalLanguageQueryOutput = z.infer<typeof ValidateNaturalLanguageQueryOutputSchema>;

export async function validateNaturalLanguageQuery(input: ValidateNaturalLanguageQueryInput): Promise<ValidateNaturalLanguageQueryOutput> {
  return validateNaturalLanguageQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateNaturalLanguageQueryPrompt',
  input: {schema: ValidateNaturalLanguageQueryInputSchema},
  output: {schema: ValidateNaturalLanguageQueryOutputSchema},
  prompt: `You are an AI tool that validates whether the provided information is sufficient to generate an SQL query based on the natural language query, table names, and expected output.\n\nHere are the table names available in the database: {{{tableNames}}}.\n\nHere is the natural language query: {{{naturalLanguageQuery}}}.\n\nHere is the expected output: {{{expectedOutput}}}.\n\nDetermine if the provided information is sufficient to generate the SQL query. If it is, return isValid as true. If not, return isValid as false and provide a clarificationNeeded question to ask the user to get more information.\n\nOutput in JSON format:\n{
  "isValid": boolean,
  "clarificationNeeded": string (Optional)
}`,
});

const validateNaturalLanguageQueryFlow = ai.defineFlow(
  {
    name: 'validateNaturalLanguageQueryFlow',
    inputSchema: ValidateNaturalLanguageQueryInputSchema,
    outputSchema: ValidateNaturalLanguageQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
