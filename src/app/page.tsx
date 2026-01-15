"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from '@/components/ui/separator';

import { useDependencyManager } from '@/hooks/use-dependency-manager';
import { DependencySettings } from '@/components/dependency-checker/dependency-settings';
import { DependencyTree } from '@/components/dependency-checker/dependency-tree';
import { type DataSet, dataSets, categoryConfigs } from '@/app/data';


export default function Home() {
  const {
    dataSet,
    items,
    keepDependencies,
    dependencyMode,
    openCategories,
    requiredDependencies,
    allSelectedState,
    handleDataSetChange,
    handleSelectionChange,
    handleCategorySelectionChange,
    handleSelectAll,
    setOpenCategories,
    setKeepDependencies,
    setDependencyMode,
    toggleAllCategories,
    areAllCategoriesOpen
  } = useDependencyManager(dataSets.pantry, 'pantry');

  const categoryConfig = categoryConfigs[dataSet];
  const categories = Object.keys(categoryConfig);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardDescription>
                Select items and their dependencies will be automatically managed.
              </CardDescription>
            </div>
            <Select onValueChange={(value) => handleDataSetChange(value as DataSet, dataSets[value as DataSet])} value={dataSet}>
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
          <DependencySettings
            dataSet={dataSet}
            keepDependencies={keepDependencies}
            onKeepDependenciesChange={setKeepDependencies}
            dependencyMode={dependencyMode}
            onDependencyModeChange={setDependencyMode}
          />

          <Separator className="mb-2" />

          <DependencyTree
            items={items}
            categories={categories}
            categoryConfig={categoryConfig}
            openCategories={openCategories}
            requiredDependencies={requiredDependencies}
            keepDependencies={keepDependencies}
            dependencyMode={dependencyMode}
            allSelectedState={allSelectedState}
            onSelectAll={handleSelectAll}
            onCategorySelectionChange={handleCategorySelectionChange}
            onItemSelectionChange={handleSelectionChange}
            onCategoryOpenChange={setOpenCategories}
            onToggleAll={toggleAllCategories}
            areAllCategoriesOpen={areAllCategoriesOpen}
          />
        </CardContent>
      </Card>
    </main>
  );
}
