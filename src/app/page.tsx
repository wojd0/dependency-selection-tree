"use client";

import { useState, useMemo, useEffect } from 'react';
import { initialItems, Item } from '@/app/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UtensilsCrossed, Carrot, CookingPot, Plus, Minus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { automaticDependencyManagement } from '@/ai/flows/automatic-dependency-management';

type ItemType = 'recipe' | 'ingredient' | 'kitchen utensil';
type DependencyMode = 'force' | 'warn';

const categoryConfig: Record<
  ItemType,
  {
    title: string;
    icon: React.ElementType;
  }
> = {
  recipe: {
    title: 'Recipes',
    icon: UtensilsCrossed,
  },
  ingredient: {
    title: 'Ingredients',
    icon: Carrot,
  },
  'kitchen utensil': {
    title: 'Kitchen Utensils',
    icon: CookingPot,
  },
};

export default function Home() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [keepDependencies, setKeepDependencies] = useState(false);
  const [dependencyMode, setDependencyMode] = useState<DependencyMode>('force');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    recipe: true,
    ingredient: true,
    'kitchen utensil': true,
  });

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
        const isRequired = requiredDependencies.has(item.name);
        if (keepDependencies && dependencyMode === 'force' && isRequired && !isSelectingAll) {
          return item; // Don't deselect forced items when unchecking
        }
        return { ...item, selected: isSelectingAll };
      }
      return item;
    });

    if (keepDependencies && isSelectingAll) {
      const depsToSelect = new Set<string>();
      categoryItems.forEach(item => {
        if(newItems.find(i => i.name === item.name)?.selected && item.dependencies) {
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
    let newItems = [...items];
    const isSelectingAll = checked === true;

    newItems = newItems.map(item => {
      const isRequired = requiredDependencies.has(item.name);
      if (keepDependencies && dependencyMode === 'force' && isRequired && !isSelectingAll) {
        return item; // Don't deselect forced items when unchecking
      }
      return { ...item, selected: isSelectingAll };
    });

    if (keepDependencies && isSelectingAll) {
      const depsToSelect = new Set<string>();
      newItems.forEach(item => {
        if (item.selected && item.dependencies) {
          item.dependencies.forEach(dep => depsToSelect.add(dep));
        }
      });
      newItems = newItems.map((item) =>
        depsToSelect.has(item.name) ? { ...item, selected: true } : item
      );
    }

    setItems(newItems);
  };

  const allSelectedState = useMemo(() => {
    const selectedCount = items.filter(item => item.selected).length;
    if (selectedCount === 0) return false;
    if (selectedCount === items.length) return true;
    return 'indeterminate';
  }, [items]);

  const categories = Object.keys(categoryConfig) as ItemType[];

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Smart Pantry</CardTitle>
          <CardDescription>
            Select items and their dependencies will be automatically managed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-4 rounded-lg border bg-background p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox id="select-all" checked={allSelectedState} onCheckedChange={handleSelectAll} />
                <Label htmlFor="select-all" className="text-base font-medium">
                  Export all
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="keep-dependencies"
                  checked={keepDependencies}
                  onCheckedChange={setKeepDependencies}
                />
                <Label htmlFor="keep-dependencies" className="text-base font-medium">
                  Keep Dependencies
                </Label>
              </div>
            </div>
            {keepDependencies && (
              <>
                <Separator />
                <div className="space-y-2 pt-2">
                  <Label className="text-base font-medium">Dependency Rule</Label>
                  <RadioGroup
                    value={dependencyMode}
                    onValueChange={(value) => setDependencyMode(value as DependencyMode)}
                    className="flex gap-4 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="force" id="force" />
                      <Label htmlFor="force">Force (Disable deselect)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="warn" id="warn" />
                      <Label htmlFor="warn">Warn (Show error)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
          </div>

          <Separator className="mb-2" />

          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = categoryConfig[category].icon;
              const categoryItems = items.filter((item) => item.type === category);
              const selectedInCategory = categoryItems.filter(item => item.selected).length;
              const categorySelectedState = selectedInCategory === 0 ? false : selectedInCategory === categoryItems.length ? true : 'indeterminate';
              const isCategoryOpen = openCategories[category];

              return (
                <Collapsible
                  key={category}
                  open={isCategoryOpen}
                  onOpenChange={(isOpen) => setOpenCategories(prev => ({...prev, [category]: isOpen}))}
                >
                  <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center text-sm">
                        {isCategoryOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </button>
                    </CollapsibleTrigger>
                    <Checkbox
                      id={`select-${category}`}
                      checked={categorySelectedState}
                      onCheckedChange={(checked) => handleCategorySelectionChange(category, checked)}
                    />
                    <Label
                      htmlFor={`select-${category}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        <Icon className="h-5 w-5 text-gray-600" />
                        {categoryConfig[category].title}
                      </div>
                    </Label>
                  </div>
                  <CollapsibleContent>
                    <div className="pl-8 pt-1">
                      <div className="relative">
                        <div className="absolute -left-3.5 top-0 h-full w-px bg-gray-200"></div>
                        <div className="space-y-1">
                          {categoryItems.map((item, index) => {
                            const isRequired = requiredDependencies.has(item.name);
                            const isDisabled = keepDependencies && dependencyMode === 'force' && isRequired && item.selected;
                            const isInvalid = keepDependencies && dependencyMode === 'warn' && isRequired && !item.selected;
                            
                            return (
                              <div key={item.name} className="relative flex items-center space-x-3 p-2 rounded-md">
                                <div className="absolute -left-[22px] top-1/2 h-px w-3 bg-gray-200"></div>
                                <Checkbox
                                  id={item.name}
                                  checked={item.selected}
                                  onCheckedChange={(checked) => handleSelectionChange(item.name, checked as boolean)}
                                  disabled={isDisabled}
                                  aria-label={`Select ${item.name}`}
                                />
                                <Label
                                  htmlFor={item.name}
                                  className={cn(
                                    "w-full cursor-pointer text-sm font-normal",
                                    isDisabled ? "cursor-not-allowed text-gray-400" : "text-gray-800",
                                    isInvalid && "text-red-600 font-medium"
                                  )}
                                >
                                  {item.name}
                                  {isInvalid && <span className="ml-2 text-xs">(Required by another item)</span>}
                                </Label>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
