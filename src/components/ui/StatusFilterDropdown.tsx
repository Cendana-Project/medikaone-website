"use client";

import { useState, useEffect } from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface StatusOption {
  value: string;
  label: string;
}

interface StatusFilterDropdownProps {
  options: StatusOption[];
  appliedStatuses: string[];
  onApply: (statuses: string[]) => void;
  title?: string;
  buttonText?: string;
}

export function StatusFilterDropdown({
  options,
  appliedStatuses,
  onApply,
  title = "Filter Status",
  buttonText = "Filter",
}: StatusFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftStatuses, setDraftStatuses] = useState<string[]>(appliedStatuses);

  useEffect(() => {
    if (isOpen) {
      setDraftStatuses(appliedStatuses);
    }
  }, [isOpen, appliedStatuses]);

  const handleToggleOption = (val: string) => {
    if (draftStatuses.includes(val)) {
      setDraftStatuses(draftStatuses.filter((s) => s !== val));
    } else {
      setDraftStatuses([...draftStatuses, val]);
    }
  };

  const handleSelectAll = () => {
    setDraftStatuses(options.map((o) => o.value));
  };

  const handleCancel = () => {
    setDraftStatuses(appliedStatuses);
    setIsOpen(false);
  };

  const handleApply = () => {
    onApply(draftStatuses);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultAll = options.map((o) => o.value);
    setDraftStatuses(defaultAll);
    onApply(defaultAll);
    setIsOpen(false);
  };

  const hasActiveFilter =
    appliedStatuses.length > 0 && appliedStatuses.length < options.length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={`flex items-center gap-2 py-2 px-3.5 h-10 text-xs sm:text-sm font-medium rounded-lg cursor-pointer border ${
            hasActiveFilter
              ? "bg-[#EBF8F5] text-[#3BB49F] border-[#3BB49F] font-semibold"
              : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
          }`}
        >
          <Filter size={15} className={hasActiveFilter ? "text-[#3BB49F]" : "text-gray-500"} />
          <span>{buttonText}</span>
          {hasActiveFilter && (
            <span className="w-2 h-2 rounded-full bg-[#3BB49F] animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-max min-w-[240px] max-w-xs p-3 bg-white rounded-xl border border-gray-200 shadow-lg flex flex-col gap-2.5 z-50"
      >
        <div className="flex items-center justify-between gap-3 px-1 pt-0.5">
          <DropdownMenuLabel className="text-xs font-semibold text-gray-600 tracking-wide p-0 whitespace-nowrap">
            {title}
          </DropdownMenuLabel>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-[11px] text-[#3BB49F] hover:underline font-semibold cursor-pointer whitespace-nowrap shrink-0 ml-auto"
          >
            Pilih Semua
          </button>
        </div>

        <DropdownMenuSeparator />

        {/* Checkboxes List */}
        <div className="flex flex-col gap-1.5 py-1 max-h-56 overflow-y-auto">
          {options.map((opt) => {
            const isChecked = draftStatuses.includes(opt.value);
            return (
              <label
                key={opt.value}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer text-xs font-medium text-gray-800 transition-colors select-none"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => handleToggleOption(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>

        <DropdownMenuSeparator />

        {/* Action Buttons: Cancel & Apply */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {hasActiveFilter ? (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer px-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="h-8 px-3 text-xs border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer font-medium"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApply}
              className="h-8 px-3 text-xs bg-[#3BB49F] hover:bg-[#329a88] text-white rounded-lg cursor-pointer font-semibold shadow-2xs"
            >
              Terapkan
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

