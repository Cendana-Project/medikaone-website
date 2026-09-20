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
import { tableData } from "@/data/dashboard/tableData";
import Cookies from "js-cookie";

import { useGetUserInfo } from "@/hooks/auth/useGetUserInfo";
import { useGetDoctors } from "@/hooks/doctorRegistration/useGetDoctors";
import { useGetGlobalDoctors } from "@/hooks/doctorRegistration/useGetGlobalDoctors";

interface UserRow {
  id: string;
  name: string;
  username: string;
  status: string;
  role: string;
  email: string;
  avatar?: string;
}

interface DashboardTableProps {
    search: string;
    roleFilter?: string;
    statusFilter?: string;
}

export default function DashboardTable({ search, roleFilter = "all", statusFilter = "all" }: DashboardTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const hospitalId = Cookies.get("hospitalId") || "";
    const { userInfo } = useGetUserInfo();
    const { doctors: apiDoctors } = useGetDoctors(hospitalId);
    const { doctors: globalDoctors } = useGetGlobalDoctors();

    // Map real API user objects & fallback demo users
    const apiUsers = useMemo(() => {
      const list: UserRow[] = [];

      // Current Logged in User
      if (userInfo) {
        list.push({
          id: userInfo.id || "current-user",
          name: userInfo.first_name ? `${userInfo.first_name} ${userInfo.last_name || ""}`.trim() : (userInfo.username || userInfo.email || "Pengguna Sistem"),
          username: `@${userInfo.username || "user"}`,
          status: "Active",
          role: userInfo.role ? userInfo.role.toUpperCase().replace(/_/g, " ") : "ADMIN",
          email: userInfo.email || "-",
          avatar: (userInfo as unknown as Record<string, string>)?.photo_url || (userInfo as unknown as Record<string, string>)?.avatar || "",
        });
      }

      // Doctors from API
      if (Array.isArray(apiDoctors)) {
        apiDoctors.forEach((doc) => {
          if (!list.some((u) => u.email === doc.email || u.id === doc.doctor_id)) {
            list.push({
              id: doc.doctor_id || doc.affiliation_id || String(Math.random()),
              name: `${doc.first_name} ${doc.last_name || ""}`.trim(),
              username: `@${(doc.first_name || "doc").toLowerCase()}`,
              status: doc.status === "ACTIVE" ? "Active" : "Inactive",
              role: "Dokter",
              email: doc.email || "-",
              avatar: "",
            });
          }
        });
      }

      // Global Doctors if Superadmin
      if (Array.isArray(globalDoctors)) {
        globalDoctors.forEach((doc) => {
          if (!list.some((u) => u.email === doc.email || u.id === doc.doctor_id)) {
            list.push({
              id: doc.doctor_id || String(Math.random()),
              name: doc.full_name || `${doc.first_name} ${doc.last_name || ""}`.trim(),
              username: `@${(doc.first_name || "doc").toLowerCase()}`,
              status: "Active",
              role: "Dokter",
              email: doc.email || "-",
              avatar: "",
            });
          }
        });
      }

      // Include mock demo user dataset for Kelola Users overview
      tableData.forEach((mock) => {
        if (!list.some((u) => u.email === mock.email)) {
          list.push({
            id: String(mock.id),
            name: mock.name,
            username: mock.username,
            status: mock.status,
            role: mock.role,
            email: mock.email,
            avatar: mock.avatar,
          });
        }
      });

      return list;
    }, [userInfo, apiDoctors, globalDoctors]);

    const filteredData = useMemo(() => {
        const keyword = search.toLowerCase();
        return apiUsers.filter((emp) => {
            const matchesSearch =
                emp.name.toLowerCase().includes(keyword) ||
                emp.username.toLowerCase().includes(keyword) ||
                emp.email.toLowerCase().includes(keyword) ||
                emp.role.toLowerCase().includes(keyword);

            const matchesRole =
                !roleFilter || roleFilter === "all" || emp.role.toLowerCase().includes(roleFilter.toLowerCase());

            const matchesStatus =
                !statusFilter || statusFilter === "all" || emp.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [apiUsers, search, roleFilter, statusFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, roleFilter, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

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
                        <TableHead>Nama User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email address</TableHead>
                        <TableHead className="text-center">Aksi</TableHead>
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
                                    <AvatarFallback className="bg-[#EBF8F5] text-[#3BB49F] font-bold text-xs">
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

                                <TableCell className="font-medium text-gray-700">{emp.role}</TableCell>
                                <TableCell>{emp.email}</TableCell>

                                <TableCell className="flex justify-center gap-2">
                                    <DeleteUser
                                        onConfirm={() => console.log("hapus", emp.id)}
                                    />

                                    <Link href="/dashboard/profile" passHref>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-2 px-6 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
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
                                colSpan={6}
                                className="text-center text-gray-500 py-8"
                            >
                                Tidak ada user yang cocok
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
