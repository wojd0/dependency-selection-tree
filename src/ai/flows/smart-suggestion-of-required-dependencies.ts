'use server';

/**
 * @fileOverview Suggests recipes and tools that require a selected ingredient.
 *
 * - suggestDependencies - A function that suggests recipes and tools based on an ingredient.
 * - SuggestDependenciesInput - The input type for the suggestDependencies function.
 * - SuggestDependenciesOutput - The return type for the suggestDependencies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDependenciesInputSchema = z.object({
  ingredient: z.string().describe('The ingredient selected by the user.'),
});

export type SuggestDependenciesInput = z.infer<typeof SuggestDependenciesInputSchema>;

const SuggestDependenciesOutputSchema = z.object({
  recipes: z.array(z.string()).describe('Recipes that require the ingredient.'),
  tools: z.array(z.string()).describe('Tools that are needed to work with the ingredient or recipe.'),
});

export type SuggestDependenciesOutput = z.infer<typeof SuggestDependenciesOutputSchema>;

export async function suggestDependencies(input: SuggestDependenciesInput): Promise<SuggestDependenciesOutput> {
  return suggestDependenciesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDependenciesPrompt',
  input: {schema: SuggestDependenciesInputSchema},
  output: {schema: SuggestDependenciesOutputSchema},
  prompt: `Based on the ingredient "{{{ingredient}}}", suggest which recipes might require it and what tools might be needed.
Recipes:
{{recipes}}
Tools:
{{tools}}`,
});

const recipes = ['pancakes', 'winter tea'];
const tools = ['pan', 'blender', 'pot', 'spoon'];

const suggestDependenciesFlow = ai.defineFlow(
  {
    name: 'suggestDependenciesFlow',
    inputSchema: SuggestDependenciesInputSchema,
    outputSchema: SuggestDependenciesOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
      recipes,
      tools,
    });
    return output!;
  }
);
