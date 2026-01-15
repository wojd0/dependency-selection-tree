'use server';

/**
 * @fileOverview A flow for managing dependencies of items in a selection tree.
 *
 * - manageDependencies - A function that handles the automatic selection/deselection of dependencies based on user selection.
 * - ManageDependenciesInput - The input type for the manageDependencies function.
 * - ManageDependenciesOutput - The return type for the manageDependencies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ItemTypeSchema = z.enum(['recipe', 'ingredient', 'kitchen utensil']);
export type ItemType = z.infer<typeof ItemTypeSchema>;

const ItemSchema = z.object({
  name: z.string().describe('The name of the item.'),
  type: ItemTypeSchema.describe('The type of the item (recipe, ingredient, or kitchen utensil).'),
  dependencies: z.array(z.string()).optional().describe('List of dependencies for this item'),
});
export type Item = z.infer<typeof ItemSchema>;

const ManageDependenciesInputSchema = z.object({
  selectedItems: z.array(ItemSchema).describe('The list of currently selected items.'),
  availableItems: z.array(ItemSchema).describe('The list of available items.'),
});
export type ManageDependenciesInput = z.infer<typeof ManageDependenciesInputSchema>;

const ManageDependenciesOutputSchema = z.object({
  updatedItems: z.array(ItemSchema).describe('The list of items with updated selection status based on dependencies.'),
});
export type ManageDependenciesOutput = z.infer<typeof ManageDependenciesOutputSchema>;

export async function manageDependencies(input: ManageDependenciesInput): Promise<ManageDependenciesOutput> {
  return manageDependenciesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'manageDependenciesPrompt',
  input: {
    schema: ManageDependenciesInputSchema,
  },
  output: {
    schema: ManageDependenciesOutputSchema,
  },
  prompt: `You are a dependency management expert. Given a list of selected items and all available items,
         you will determine the minimal set of dependencies required based on the selected items.

         Selected Items:
         {{#each selectedItems}}
           - {{name}} ({{type}})
             {{#if dependencies}}
               Dependencies: {{dependencies}}
             {{/if}}
         {{/each}}

         Available Items:
         {{#each availableItems}}
           - {{name}} ({{type}})
             {{#if dependencies}}
               Dependencies: {{dependencies}}
             {{/if}}
         {{/each}}

         Based on the selected items, determine which items from available items should be selected to satisfy all dependencies.
         If an item is deselected, remove it's dependencies unless they are dependencies of another selected item.

         Return a list of all available items with their selection status updated.  Do not change item type or name.
         Return in JSON format:
         \`\`\`json
         {
           "updatedItems": [
             {
               "name": "item name",
               "type": "item type",
               "dependencies": ["list", "of", "dependencies"],
               // Include all original fields, do not modify the original structure
             }
           ]
         }
         \`\`\`
`,
});

const manageDependenciesFlow = ai.defineFlow(
  {
    name: 'manageDependenciesFlow',
    inputSchema: ManageDependenciesInputSchema,
    outputSchema: ManageDependenciesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
