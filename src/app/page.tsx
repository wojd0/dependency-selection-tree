"use client";

import { useState, useMemo } from 'react';
import { initialItems, expenseManagementItems, Item, ItemType, allItemTypes } from '@/app/data';
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
import {
  UtensilsCrossed,
  Carrot,
  CookingPot,
  Plus,
  Minus,
  Workflow,
  Plug,
  FileCode,
  Table,
  Database,
  Zap,
  ClipboardList,
  ToyBrick,
  FileText,
  ScrollText,
  Combine,
  Shield,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type DependencyMode = 'force' | 'warn';
type DataSet = 'pantry' | 'expense';

const pantryCategoryConfig: Record<string, { title: string; icon: React.ElementType }> = {
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

const expenseCategoryConfig: Record<string, { title: string; icon: React.ElementType }> = {
  processes: { title: 'Processes', icon: Workflow },
  connectors: { title: 'Connectors', icon: Plug },
  scripts: { title: 'Scripts', icon: FileCode },
  decisionTables: { title: 'Decision Tables', icon: Table },
  dataModels: { title: 'Data Models', icon: Database },
  triggers: { title: 'Triggers', icon: Zap },
  forms: { title: 'Forms', icon: ClipboardList },
  formWidgets: { title: 'Form Widgets', icon: ToyBrick },
  contentTypes: { title: 'Content Types', icon: FileText },
  schemas: { title: 'Schemas', icon: ScrollText },
  mixins: { title: 'Mixins', icon: Combine },
  securityPolicy: { title: 'Security Policy', icon: Shield },
};

const categoryConfigs = {
  pantry: pantryCategoryConfig,
  expense: expenseCategoryConfig,
}

const dataSets = {
  pantry: initialItems,
  expense: expenseManagementItems,
}

export default function Home() {
  const [dataSet, setDataSet] = useState<DataSet>('pantry');
  const [items, setItems] = useState<Item[]>(initialItems);
  const [keepDependencies, setKeepDependencies] = useState(false);
  const [dependencyMode, setDependencyMode] = useState<DependencyMode>('force');

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    allItemTypes.forEach(type => {
      initialState[type] = true;
    });
    return initialState;
  });

  const categoryConfig = categoryConfigs[dataSet];
  
  const handleDataSetChange = (newDataSet: DataSet) => {
    setDataSet(newDataSet);
    setItems(dataSets[newDataSet]);
    setKeepDependencies(false);
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
          // If unchecking, but this item is a forced dependency, don't change its state
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
        if(item.dependencies) {
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

    let newItems = items.map(item => {
       if (!isSelectingAll && keepDependencies && dependencyMode === 'force' && requiredDependencies.has(item.name)) {
         return item;
       }
      return { ...item, selected: isSelectingAll };
    });

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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline text-3xl">Smart Pantry</CardTitle>
              <CardDescription>
                Select items and their dependencies will be automatically managed.
              </CardDescription>
            </div>
            <Select onValueChange={(value) => handleDataSetChange(value as DataSet)} value={dataSet}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select a dataset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pantry">Smart Pantry</SelectItem>
                <SelectItem value="expense">Expense Management</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
              const categoryItems = items.filter((item) => item.type === category);
              if (categoryItems.length === 0) return null;

              const Icon = categoryConfig[category]?.icon || Carrot;
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
                        {categoryConfig[category]?.title || category}
                      </div>
                    </Label>
                  </div>
                  <CollapsibleContent>
                    <div className="pl-8 pt-1">
                      <div className="relative">
                        <div className="absolute -left-3.5 top-0 h-full w-px bg-gray-200"></div>
                        <div className="space-y-1">
                          {categoryItems.map((item) => {
                            const isRequired = requiredDependencies.has(item.name);
                            const isDisabled = keepDependencies && dependencyMode === 'force' && isRequired;
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
