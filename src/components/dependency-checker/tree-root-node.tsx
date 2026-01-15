"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";

interface TreeRootNodeProps {
  label: string;
  icon: React.ElementType;
  checked: boolean | 'indeterminate';
  isAllOpen: boolean;
  onCheckedChange: (checked: boolean | 'indeterminate') => void;
  onToggleAll: () => void;
  children: React.ReactNode;
}

export function TreeRootNode({ label, icon: Icon, checked, isAllOpen, onCheckedChange, onToggleAll, children }: TreeRootNodeProps) {
  return (
    <div>
      <div className="flex items-center space-x-3 p-2 rounded-md">
        <Checkbox id="select-all" checked={checked} onCheckedChange={onCheckedChange} />
        <Label htmlFor="select-all" className="flex-1 cursor-pointer">
          <div className="flex items-center gap-2 font-semibold">
            <Icon className="h-5 w-5 text-gray-600" />
            {label}
          </div>
        </Label>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onToggleAll}>
          {isAllOpen ? (
            <ChevronsDownUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronsUpDown className="h-4 w-4 text-gray-500" />
          )}
          <span className="sr-only">{isAllOpen ? "Collapse all" : "Expand all"}</span>
        </Button>
      </div>
      <div className="pl-8 pt-1">
        <div className="relative">
          <div className="absolute -left-3.5 top-0 h-full w-px bg-gray-200"></div>
          <div className="space-y-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
