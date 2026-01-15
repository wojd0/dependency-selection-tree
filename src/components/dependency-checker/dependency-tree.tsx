"use client";

import { Package } from 'lucide-react';
import { Item, ItemType, DependencyMode, CategoryConfig } from '@/app/data';
import { TreeRootNode } from './tree-root-node';
import { CategoryNode } from './category-node';

interface DependencyTreeProps {
  items: Item[];
  categories: string[];
  categoryConfig: Record<string, CategoryConfig>;
  openCategories: Record<string, boolean>;
  requiredDependencies: Set<string>;
  keepDependencies: boolean;
  dependencyMode: DependencyMode;
  allSelectedState: boolean | 'indeterminate';
  areAllCategoriesOpen: boolean;
  onSelectAll: (checked: boolean | 'indeterminate') => void;
  onCategorySelectionChange: (category: ItemType, checked: boolean | 'indeterminate') => void;
  onItemSelectionChange: (itemName: string, checked: boolean) => void;
  onCategoryOpenChange: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
  onToggleAll: () => void;
}

export function DependencyTree({
  items,
  categories,
  categoryConfig,
  openCategories,
  requiredDependencies,
  keepDependencies,
  dependencyMode,
  allSelectedState,
  areAllCategoriesOpen,
  onSelectAll,
  onCategorySelectionChange,
  onItemSelectionChange,
  onCategoryOpenChange,
  onToggleAll,
}: DependencyTreeProps) {
  return (
    <div className="space-y-1">
      <TreeRootNode
        label="Export all"
        icon={Package}
        checked={allSelectedState}
        onCheckedChange={onSelectAll}
        onToggleAll={onToggleAll}
        isAllOpen={areAllCategoriesOpen}
      >
        {categories.map((category) => {
          const categoryItems = items.filter((item) => item.type === category);
          if (categoryItems.length === 0) return null;

          return (
            <CategoryNode
              key={category}
              items={items}
              category={category as ItemType}
              categoryConfig={categoryConfig[category]}
              categoryItems={categoryItems}
              openCategories={openCategories}
              requiredDependencies={requiredDependencies}
              keepDependencies={keepDependencies}
              dependencyMode={dependencyMode}
              onCategorySelectionChange={onCategorySelectionChange}
              onItemSelectionChange={onItemSelectionChange}
              onCategoryOpenChange={onCategoryOpenChange}
            />
          );
        })}
      </TreeRootNode>
    </div>
  );
}
