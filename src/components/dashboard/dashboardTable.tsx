"use client";

import { useEffect, useMemo, useState } from "react";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { tableData } from "@/data/dashboard/tableData";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import DeleteUser from "./deleteUser";
import Link from "next/link";

interface DashboardTableProps {
    search: string;
}

export default function DashboardTable({ search }: DashboardTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredData = useMemo(() => {
        const keyword = search.toLowerCase();
        return tableData.filter(
            (emp) =>
                emp.name.toLowerCase().includes(keyword) ||
                emp.username.toLowerCase().includes(keyword) ||
                emp.email.toLowerCase().includes(keyword) ||
                emp.role.toLowerCase().includes(keyword)
            );
    }, [search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    return (
        <div className="border border-gray-200 bg-white w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40px]">
                        <Checkbox />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email address</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {currentData.length > 0 ? (
                        currentData.map((emp) => (
                            <TableRow key={emp.id}>
                                <TableCell>
                                <Checkbox />
                                </TableCell>

                                <TableCell className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={emp.avatar} alt={emp.name} />
                                    <AvatarFallback>
                                    {emp.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-gray-900">{emp.name}</p>
                                    <p className="text-gray-500 text-sm">{emp.username}</p>
                                </div>
                                </TableCell>

                                <TableCell>
                                <Badge
                                    variant="outline"
                                    className="bg-[#ECFDF3] text-[#027A48] border-none"
                                >
                                    • {emp.status}
                                </Badge>
                                </TableCell>

                                <TableCell>{emp.role}</TableCell>
                                <TableCell>{emp.email}</TableCell>
                                <TableCell>{emp.password}</TableCell>

                                <TableCell className="flex justify-center gap-2">
                                    <DeleteUser
                                        onConfirm={() => console.log("hapus", emp.id)}
                                    />

                                    <Link href="/auth/edit-user" passHref>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-2 px-8"
                                        >
                                            <Image
                                                src="/dashboard/Text.svg"
                                                alt="Edit icon"
                                                width={16}
                                                height={16}
                                            />
                                            Edit
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="text-center text-gray-500 py-8"
                            >
                                Tidak ada hasil yang cocok
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="w-full border-t border-gray-200">
                <div className="flex items-center justify-between px-4 py-3 w-full">
                    <Pagination className="w-fit">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                    e.preventDefault();
                                    handlePrevious();
                                    }}
                                    className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                                >
                                    Previous
                                </PaginationPrevious>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                    <Pagination>
                        <PaginationContent>
                            {[...Array(totalPages)].map((_, index) => {
                                const page = index + 1;
                                return (
                                    <PaginationItem key={page}>
                                    <PaginationLink
                                        href="#"
                                        isActive={page === currentPage}
                                        onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage(page);
                                        }}
                                    >
                                        {page}
                                    </PaginationLink>
                                    </PaginationItem>
                                );
                            })}
                        </PaginationContent>
                    </Pagination>

                    <Pagination className="w-fit">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                    e.preventDefault();
                                    handleNext();
                                    }}
                                    className={currentPage === totalPages ? "opacity-50 pointer-events-none bo" : ""}
                                >
                                    Next
                                </PaginationNext>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}
