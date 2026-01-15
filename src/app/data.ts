import type { ItemType } from '@/ai/flows/automatic-dependency-management';

export interface Item {
  name: string;
  type: ItemType;
  dependencies?: string[];
  selected: boolean;
}

export const initialItems: Item[] = [
  // Recipes
  { name: 'pancakes', type: 'recipe', dependencies: ['flour', 'eggs', 'milk', 'butter', 'salt', 'cinnamon', 'sugar', 'pan', 'blender', 'spoon'], selected: false },
  { name: 'winter tea', type: 'recipe', dependencies: ['black tea', 'cinnamon', 'sugar', 'pot', 'spoon'], selected: false },

  // Ingredients
  { name: 'flour', type: 'ingredient', selected: false },
  { name: 'eggs', type: 'ingredient', selected: false },
  { name: 'milk', type: 'ingredient', selected: false },
  { name: 'butter', type: 'ingredient', selected: false },
  { name: 'salt', type: 'ingredient', selected: false },
  { name: 'black tea', type: 'ingredient', selected: false },
  { name: 'cinnamon', type: 'ingredient', selected: false },
  { name: 'sugar', type: 'ingredient', selected: false },
  { name: 'nutella', type: 'ingredient', selected: false },
  { name: 'honey', type: 'ingredient', selected: false },

  // Kitchen Utensils
  { name: 'pan', type: 'kitchen utensil', selected: false },
  { name: 'blender', type: 'kitchen utensil', selected: false },
  { name: 'pot', type: 'kitchen utensil', selected: false },
  { name: 'spoon', type: 'kitchen utensil', selected: false },
  { name: 'napkin', type: 'kitchen utensil', selected: false },
  { name: 'plate', type: 'kitchen utensil', selected: false },
];
