"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ColumnDef<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
};

export type SortDirection = "ALL" | "ASC" | "DESC";

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchField?: (row: T) => string;
  createButtonLabel?: string;
  onCreateButtonClick?: () => void;
  createButtonIcon?: React.ReactNode;
  extraHeaderControls?: React.ReactNode;
  isLoading?: boolean;
  emptyText?: string;
  keyExtractor: (row: T) => string | number;
}

export function DataTable<T>({
  columns,
  data,
  searchPlaceholder = "Cari data...",
  searchField,
  createButtonLabel,
  onCreateButtonClick,
  createButtonIcon,
  extraHeaderControls,
  isLoading = false,
  emptyText = "Tidak ada data yang ditemukan",
  keyExtractor,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const itemsPerPage = 10;

  // Search filtering
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();

    return data.filter((item) => {
      if (searchField) {
        return searchField(item).toLowerCase().includes(q);
      }
      return Object.values(item as Record<string, unknown>).some((val) =>
        String(val ?? "").toLowerCase().includes(q)
      );
    });
  }, [data, search, searchField]);

  // Column sorting
  const sortedData = useMemo(() => {
    if (!sortKey || sortDir === "ALL") return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = (a as Record<string, unknown>)[sortKey];
      const valB = (b as Record<string, unknown>)[sortKey];

      if (valA == null) return 1;
      if (valB == null) return -1;

      let comparison = 0;
      if (typeof valA === "number" && typeof valB === "number") {
        comparison = valA - valB;
      } else {
        comparison = String(valA).localeCompare(String(valB));
      }

      return sortDir === "ASC" ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDir]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedData.map(keyExtractor));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  };

  const handleSortChange = (key: string, dir: SortDirection) => {
    setSortKey(key);
    setSortDir(dir);
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedIds.has(keyExtractor(row)));

  return (
    <div className="flex flex-col gap-4 w-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
      {/* Top Header Action Bar */}
      <div className="flex flex-wrap items-center justify-between p-6 gap-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3 flex-wrap">
          {createButtonLabel && onCreateButtonClick && (
            <Button
              onClick={onCreateButtonClick}
              className="bg-[#EBF8F5] hover:bg-[#D8F2EC] text-[#3BB49F] font-medium border border-[#C4E9E2] px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              {createButtonIcon}
              <span>{createButtonLabel}</span>
            </Button>
          )}
          {extraHeaderControls}
        </div>

        {/* Right Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 py-2 bg-gray-50/50 border-gray-200 text-sm focus-visible:ring-[#3BB49F] rounded-lg"
          />
        </div>
      </div>

      {/* Table Data */}
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/70">
            <TableRow className="border-b border-gray-200">
              <TableHead className="w-[48px] pl-6">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(c) => handleSelectAll(!!c)}
                />
              </TableHead>

              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const activeDir = isSorted ? sortDir : "ALL";

                return (
                  <TableHead
                    key={col.key}
                    style={{ width: col.width }}
                    className={`font-semibold text-gray-700 text-sm py-3.5 px-4 ${
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {col.sortable !== false ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center gap-1.5 hover:text-[#3BB49F] transition-colors focus:outline-none cursor-pointer">
                            <span>{col.label}</span>
                            {activeDir === "ASC" ? (
                              <ArrowUp className="h-3.5 w-3.5 text-[#3BB49F]" />
                            ) : activeDir === "DESC" ? (
                              <ArrowDown className="h-3.5 w-3.5 text-[#3BB49F]" />
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400 opacity-60" />
                            )}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-36 bg-white">
                          <DropdownMenuItem
                            onClick={() => handleSortChange(col.key, "ALL")}
                            className="cursor-pointer text-xs"
                          >
                            Filter All (Default)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSortChange(col.key, "ASC")}
                            className="cursor-pointer text-xs flex items-center gap-2"
                          >
                            <ArrowUp className="h-3 w-3" /> Sort ASC
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSortChange(col.key, "DESC")}
                            className="cursor-pointer text-xs flex items-center gap-2"
                          >
                            <ArrowDown className="h-3 w-3" /> Sort DESC
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span>{col.label}</span>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center text-gray-500 py-12"
                >
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#3BB49F] border-t-transparent" />
                    <span>Memuat data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => {
                const id = keyExtractor(row);
                const isChecked = selectedIds.has(id);

                return (
                  <TableRow
                    key={id}
                    className="hover:bg-gray-50/80 transition-colors border-b border-gray-100"
                  >
                    <TableCell className="pl-6">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(c) => handleSelectRow(id, !!c)}
                      />
                    </TableCell>

                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={`px-4 py-3.5 text-sm ${
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {col.render
                          ? col.render(row, idx)
                          : String((row as Record<string, unknown>)[col.key] ?? "-")}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center text-gray-500 py-12"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
        <Pagination className="w-fit">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage((p) => p - 1);
                }}
                className={
                  currentPage === 1 ? "opacity-40 pointer-events-none" : "cursor-pointer"
                }
              >
                Previous
              </PaginationPrevious>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <Pagination className="w-fit">
          <PaginationContent className="gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                  className={`cursor-pointer ${
                    page === currentPage
                      ? "bg-[#3BB49F] text-white hover:bg-[#329a88] hover:text-white font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>

        <Pagination className="w-fit">
          <PaginationContent>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                }}
                className={
                  currentPage === totalPages ? "opacity-40 pointer-events-none" : "cursor-pointer"
                }
              >
                Next
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
