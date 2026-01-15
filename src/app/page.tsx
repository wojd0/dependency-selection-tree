"use client";

import { useState } from 'react';
import { manageDependencies } from '@/ai/flows/automatic-dependency-management';
import { initialItems, Item } from '@/app/data';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import { UtensilsCrossed, Carrot, CookingPot, LoaderCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type ItemType = 'recipe' | 'ingredient' | 'kitchen utensil';

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSelectionChange = async (itemName: string, checked: boolean) => {
    const newItems = items.map((item) =>
      item.name === itemName ? { ...item, selected: !!checked } : item
    );

    if (!keepDependencies) {
      setItems(newItems);
      return;
    }

    setIsLoading(true);
    try {
      const selectedItems = newItems.filter((item) => item.selected);
      // We need to provide the original items with dependency info to the AI
      const availableItems = initialItems.map(({ selected, ...rest }) => rest);

      const result = await manageDependencies({
        selectedItems,
        availableItems,
      });
      
      const updatedSelectedNames = new Set(result.updatedItems.map(item => item.name));

      const finalItemsState = items.map(item => ({
        ...item,
        selected: updatedSelectedNames.has(item.name)
      }));
      
      setItems(finalItemsState);

    } catch (error) {
      console.error('AI dependency management failed:', error);
      toast({
        title: 'Error updating dependencies',
        description: 'The AI model could not process the request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = Object.keys(categoryConfig) as ItemType[];

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Smart Pantry</CardTitle>
          <CardDescription>
            Select items and let AI manage the dependencies for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-between rounded-lg border bg-background p-4">
            <Label htmlFor="keep-dependencies" className="text-base font-medium">
              Keep Dependencies
            </Label>
            <div className="flex items-center gap-3">
              {isLoading && <LoaderCircle className="animate-spin text-primary" />}
              <Switch
                id="keep-dependencies"
                checked={keepDependencies}
                onCheckedChange={setKeepDependencies}
                disabled={isLoading}
              />
            </div>
          </div>

          <Separator className="mb-4" />

          <div className={`relative ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
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
                      <div className="grid gap-4 pt-2">
                        {categoryItems.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center space-x-3 transition-colors rounded-md p-2 hover:bg-accent/50"
                          >
                            <Checkbox
                              id={item.name}
                              checked={item.selected}
                              onCheckedChange={(checked) => handleSelectionChange(item.name, checked as boolean)}
                              aria-label={`Select ${item.name}`}
                            />
                            <Label
                              htmlFor={item.name}
                              className="w-full cursor-pointer text-base font-normal text-foreground"
                            >
                              {item.name}
                            </Label>
                          </div>
                        ))}
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
