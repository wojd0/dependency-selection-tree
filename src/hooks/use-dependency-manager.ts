"use client";

import { useState, useMemo, useCallback } from 'react';
import { Item, ItemType, DependencyMode, DataSet, categoryConfigs } from '@/app/data';

export function useDependencyManager(initialItems: Item[], initialDataSet: DataSet) {
  const [dataSet, setDataSet] = useState<DataSet>(initialDataSet);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [keepDependencies, setKeepDependencies] = useState(false);
  const [dependencyMode, setDependencyMode] = useState<DependencyMode>('force');
  
  const initialOpenState = useCallback((newDataSet: DataSet) => {
    const initialState: Record<string, boolean> = {};
    const categories = Object.keys(categoryConfigs[newDataSet]);
    categories.forEach(category => {
      initialState[category] = true;
    });
    return initialState;
  }, []);

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(initialOpenState(initialDataSet));

  const handleDataSetChange = (newDataSet: DataSet, newItems: Item[]) => {
    setDataSet(newDataSet);
    setItems(newItems);
    setKeepDependencies(false);
    setOpenCategories(initialOpenState(newDataSet));
  };

  const requiredDependencies = useMemo(() => {
    if (!keepDependencies) return new Set<string>();
    const deps = new Set<string>();
    items.forEach(item => {
      if (item.selected && item.dependencies) {
        item.dependencies.forEach(dep => deps.add(dep));
      }
    });
    return deps;
  }, [items, keepDependencies]);

  const handleSelectionChange = (itemName: string, checked: boolean) => {
    let newItems = items.map((item) =>
      item.name === itemName ? { ...item, selected: !!checked } : item
    );

    if (keepDependencies && checked) {
      const selectedItem = newItems.find((item) => item.name === itemName);

      if (selectedItem?.dependencies) {
        const depsToSelect = new Set(selectedItem.dependencies);
        newItems = newItems.map((item) =>
          depsToSelect.has(item.name) ? { ...item, selected: true } : item
        );
      }
    }

    setItems(newItems);
  };

  const handleCategorySelectionChange = (category: ItemType, checked: boolean | 'indeterminate') => {
    let newItems = [...items];
    const categoryItems = items.filter(item => item.type === category);
    const categoryItemNames = new Set(categoryItems.map(item => item.name));

    const isSelectingAll = checked === true;

    newItems = newItems.map(item => {
      if (categoryItemNames.has(item.name)) {
        if (!isSelectingAll && keepDependencies && dependencyMode === 'force' && requiredDependencies.has(item.name)) {
          const isDependedOnByOtherCategory = items.some(otherItem =>
            otherItem.selected &&
            otherItem.type !== category &&
            otherItem.dependencies?.includes(item.name)
          );
          if (isDependedOnByOtherCategory) {
            return item;
          }
        }
        return { ...item, selected: isSelectingAll };
      }
      return item;
    });

    if (keepDependencies && isSelectingAll) {
      const depsToSelect = new Set<string>();
      categoryItems.forEach(item => {
        if (item.dependencies) {
          item.dependencies.forEach(dep => depsToSelect.add(dep));
        }
      });
      newItems = newItems.map((item) =>
        depsToSelect.has(item.name) ? { ...item, selected: true } : item
      );
    }

    setItems(newItems);
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    const isSelectingAll = checked === true;
    let newItems;
    if (isSelectingAll) {
      newItems = items.map(item => ({ ...item, selected: true }));
    } else {
      newItems = items.map(item => {
        if (keepDependencies && dependencyMode === 'force' && requiredDependencies.has(item.name)) {
          return item;
        }
        return { ...item, selected: false };
      });
    }
    setItems(newItems);
  };

  const allSelectedState = useMemo(() => {
    const selectedCount = items.filter(item => item.selected).length;
    if (selectedCount === 0) return false;
    if (selectedCount === items.length) return true;
    return 'indeterminate';
  }, [items]);

  const areAllCategoriesOpen = useMemo(() => {
    const currentCategories = Object.keys(categoryConfigs[dataSet]);
    return currentCategories.every(category => openCategories[category]);
  }, [openCategories, dataSet]);

  const toggleAllCategories = useCallback(() => {
    setOpenCategories(prevOpenCategories => {
      const nextState = !areAllCategoriesOpen;
      const newOpenCategories: Record<string, boolean> = {};
      const currentCategories = Object.keys(categoryConfigs[dataSet]);
      currentCategories.forEach(key => {
        newOpenCategories[key] = nextState;
      });
      return newOpenCategories;
    });
  }, [areAllCategoriesOpen, dataSet]);

  return {
    dataSet,
    items,
    keepDependencies,
    dependencyMode,
    openCategories,
    requiredDependencies,
    allSelectedState,
    areAllCategoriesOpen,
    handleDataSetChange,
    handleSelectionChange,
    handleCategorySelectionChange,
    handleSelectAll,
    toggleAllCategories,
    setItems,
    setKeepDependencies,
    setDependencyMode,
    setOpenCategories,
  };
}
