
export type ItemType =
  // Pantry items
  | 'recipe'
  | 'ingredient'
  | 'kitchen utensil'
  // Expense management items
  | 'processes'
  | 'connectors'
  | 'scripts'
  | 'decisionTables'
  | 'dataModels'
  | 'triggers'
  | 'forms'
  | 'formWidgets'
  | 'contentTypes'
  | 'schemas'
  | 'mixins'
  | 'securityPolicy';

export const allItemTypes: ItemType[] = [
  'recipe',
  'ingredient',
  'kitchen utensil',
  'processes',
  'connectors',
  'scripts',
  'decisionTables',
  'dataModels',
  'triggers',
  'forms',
  'formWidgets',
  'contentTypes',
  'schemas',
  'mixins',
  'securityPolicy',
];


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


export const expenseManagementItems: Item[] = [
  // PROCESS AUTOMATION
  {
    name: 'invoice-approval-workflow',
    type: 'processes',
    dependencies: [
      'invoice-submission-form',
      'manager-approval-form',
      'it-equipment-request-form',
      'alfresco-connector',
      'email-connector',
      'docusign-connector',
      'pdf-generator-connector',
      'invoice-decision-table',
      'format-currency-script',
      'invoice-data-model',
      'invoice-document-type',
      'audit-trail-mixin',
      'finance-access-policy'
    ],
    selected: false
  },
  {
    name: 'employee-onboarding-workflow',
    type: 'processes',
    dependencies: [
      'employee-details-form',
      'it-equipment-request-form',
      'email-connector',
      'pdf-generator-connector',
      'employee-data-model',
      'employee-contract-type',
      'audit-trail-mixin',
      'hr-access-policy'
    ],
    selected: false
  },
  { name: 'alfresco-connector', type: 'connectors', selected: false },
  { name: 'email-connector', type: 'connectors', selected: false },
  { name: 'docusign-connector', type: 'connectors', selected: false },
  { name: 'pdf-generator-connector', type: 'connectors', selected: false },
  { name: 'slack-connector', type: 'connectors', selected: false },
  { name: 'sap-connector', type: 'connectors', selected: false },
  { name: 'format-currency-script', type: 'scripts', selected: false },
  { name: 'calculate-tax-script', type: 'scripts', selected: false },
  { name: 'generate-id-script', type: 'scripts', selected: false },
  { name: 'invoice-decision-table', type: 'decisionTables', selected: false },
  { name: 'leave-approval-rules', type: 'decisionTables', selected: false },
  { name: 'invoice-data-model', type: 'dataModels', selected: false },
  { name: 'employee-data-model', type: 'dataModels', selected: false },
  { name: 'product-data-model', type: 'dataModels', selected: false },
  { name: 'invoice-received-trigger', type: 'triggers', dependencies: ['invoice-approval-workflow'], selected: false },
  { name: 'new-employee-trigger', type: 'triggers', dependencies: ['employee-onboarding-workflow'], selected: false },

  // FORMS
  { name: 'invoice-submission-form', type: 'forms', dependencies: ['currency-input-widget'], selected: false },
  { name: 'manager-approval-form', type: 'forms', dependencies: ['signature-capture-widget'], selected: false },
  { name: 'employee-details-form', type: 'forms', selected: false },
  { name: 'it-equipment-request-form', type: 'forms', selected: false },
  { name: 'feedback-survey-form', type: 'forms', selected: false },
  { name: 'expense-claim-form', type: 'forms', selected: false },
  { name: 'currency-input-widget', type: 'formWidgets', selected: false },
  { name: 'signature-capture-widget', type: 'formWidgets', selected: false },
  { name: 'org-chart-picker-widget', type: 'formWidgets', selected: false },
  { name: 'file-preview-widget', type: 'formWidgets', selected: false },

  // CONTENT
  { name: 'invoice-document-type', type: 'contentTypes', dependencies: ['financial-metadata-schema', 'audit-trail-mixin'], selected: false },
  { name: 'employee-contract-type', type: 'contentTypes', dependencies: ['hr-metadata-schema', 'audit-trail-mixin'], selected: false },
  { name: 'financial-metadata-schema', type: 'schemas', selected: false },
  { name: 'hr-metadata-schema', type: 'schemas', selected: false },
  { name: 'audit-trail-mixin', type: 'mixins', selected: false },
  { name: 'retention-mixin', type: 'mixins', selected: false },
  { name: 'finance-access-policy', type: 'securityPolicy', selected: false },
  { name: 'hr-access-policy', type: 'securityPolicy', selected: false },
];
