"use client";

import { useState, useMemo } from 'react';
import { initialItems, Item } from '@/app/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UtensilsCrossed, Carrot, CookingPot } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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

  const categories = Object.keys(categoryConfig) as ItemType[];

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Smart Pantry</CardTitle>
          <CardDescription>
            Select items and their dependencies will be automatically managed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-4 rounded-lg border bg-background p-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="keep-dependencies" className="text-base font-medium">
                Keep Dependencies
              </Label>
              <Switch
                id="keep-dependencies"
                checked={keepDependencies}
                onCheckedChange={setKeepDependencies}
              />
            </div>
            {keepDependencies && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-base font-medium">Dependency Rule</Label>
                  <RadioGroup
                    value={dependencyMode}
                    onValueChange={(value) => setDependencyMode(value as DependencyMode)}
                    className="flex gap-4"
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

          <Separator className="mb-4" />

          <div>
            <Accordion type="multiple" defaultValue={categories} className="w-full">
              {categories.map((category) => {
                const Icon = categoryConfig[category].icon;
                const categoryItems = items.filter((item) => item.type === category);

                return (
                  <AccordionItem value={category} key={category}>
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        {categoryConfig[category].title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      <div className="grid gap-2 pt-2">
                        {categoryItems.map((item) => {
                           const isRequired = requiredDependencies.has(item.name);
                           const isDisabled = keepDependencies && dependencyMode === 'force' && isRequired && item.selected;
                           const isInvalid = keepDependencies && dependencyMode === 'warn' && isRequired && !item.selected;

                           return (
                            <div
                              key={item.name}
                              className={cn(
                                "flex items-center space-x-3 transition-colors rounded-md p-2",
                                isInvalid ? "bg-destructive/10" : "hover:bg-accent/50"
                              )}
                            >
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
                                  "w-full cursor-pointer text-base font-normal",
                                  isDisabled ? "cursor-not-allowed text-muted-foreground" : "text-foreground",
                                  isInvalid && "text-destructive font-medium"
                                )}
                              >
                                {item.name}
                                {isInvalid && <span className="ml-2 text-xs">(Required by another item)</span>}
                              </Label>
                            </div>
                           )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
