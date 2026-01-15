# **App Name**: Smart Pantry

## Core Features:

- Dependency Tree: Display recipes, ingredients, and kitchen utensils in a hierarchical tree structure.
- Interactive Selection: Allow users to freely select or deselect items in the tree when the 'Keep Dependencies' switch is off.
- Automatic Dependency Selection: Automatically select or deselect dependencies based on core element selection when the 'Keep Dependencies' switch is on. All changes will be performed using a tool that considers which dependencies are really required. For example if sugar and cinnamon are needed for both winter tea and pancakes, but then user deselects pancakes, only ingredients of the winter tea should be left.
- Switch Control: Implement a toggle switch for users to easily enable or disable the 'Keep Dependencies' feature.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to inspire confidence and clarity in selection.
- Background color: Light gray (#EEEEEE) to ensure readability and reduce eye strain.
- Accent color: Teal (#009688) to highlight selected items and interactive elements.
- Body and headline font: 'Inter' sans-serif font, which is clear, modern, and readable.
- Material Design icons to visually represent each category (recipes, ingredients, utensils) and their relationships.
- Use clear indentation and visual cues to represent the hierarchical structure of the dependency tree, such as different levels of nesting.
- Subtle animations on selection to provide immediate feedback and improve user experience.