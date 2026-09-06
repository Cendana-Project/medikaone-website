'use client';

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import DashboardCards from "@/components/dashboard/dashboardCards";
import { Input } from "@/components/ui/input";
import DashboardTable from "@/components/dashboard/dashboardTable";
import { useGetUserInfo } from "@/hooks/auth/useGetUserInfo";
import RegisterHospitalModal from "@/components/dashboard/RegisterHospitalModal";
import RegisterAdminHospitalModal from "@/components/dashboard/RegisterAdminHospitalModal";
import RegisterStaffHospitalModal from "@/components/dashboard/RegisterStaffHospitalModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function RoleContent() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [isRegisterHospitalOpen, setIsRegisterHospitalOpen] = useState(false);
    const [isRegisterAdminOpen, setIsRegisterAdminOpen] = useState(false);
    const [isRegisterStaffOpen, setIsRegisterStaffOpen] = useState(false);

    const { userInfo } = useGetUserInfo();
    const searchParams = useSearchParams();
    const router = useRouter();

    const normalizedRole = (userInfo?.role || "").toUpperCase().replace(/[-\s]+/g, "_");
    const isSuperAdmin = normalizedRole === "SUPER_ADMIN";
    const isAdmin = isSuperAdmin || normalizedRole === "ADMIN" || normalizedRole === "HOSPITAL_ADMIN";

    useEffect(() => {
        const modalParam = searchParams.get("modal");
        if (modalParam === "register-hospital") {
            setIsRegisterHospitalOpen(true);
        } else if (modalParam === "register-admin") {
            setIsRegisterAdminOpen(true);
        } else if (modalParam === "register-staff") {
            setIsRegisterStaffOpen(true);
        }
    }, [searchParams]);

    const handleCloseHospitalModal = () => {
        setIsRegisterHospitalOpen(false);
        if (searchParams.get("modal")) {
            router.replace("/dashboard/roles");
        }
    };

    const handleCloseAdminModal = () => {
        setIsRegisterAdminOpen(false);
        if (searchParams.get("modal")) {
            router.replace("/dashboard/roles");
        }
    };

    const handleCloseStaffModal = () => {
        setIsRegisterStaffOpen(false);
        if (searchParams.get("modal")) {
            router.replace("/dashboard/roles");
        }
    };

    const hasActiveFilter = roleFilter !== "all" || statusFilter !== "all";

    const resetFilters = () => {
        setRoleFilter("all");
        setStatusFilter("all");
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-full p-6">
            <DashboardCards />

            <div className="flex flex-col w-full bg-white rounded-lg border border-black/10 overflow-hidden shadow-xs">
                {/* Top Action Bar: Buttons + Filter + Search */}
                <div className="flex flex-wrap items-center justify-between px-6 py-4 w-full gap-4 border-b border-gray-100 bg-white">
                    {/* Left side: Register buttons */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        {isSuperAdmin && (
                            <>
                                <Button
                                    type="button"
                                    onClick={() => setIsRegisterHospitalOpen(true)}
                                    className="bg-[#ebf8f5] hover:bg-[#d8f2ec] border border-[#c4e9e2] py-2 px-3.5 text-xs sm:text-sm font-semibold text-[#3bb49f] cursor-pointer shadow-xs"
                                >
                                    Register Rumah Sakit +
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setIsRegisterAdminOpen(true)}
                                    className="bg-[#ebf8f5] hover:bg-[#d8f2ec] border border-[#c4e9e2] py-2 px-3.5 text-xs sm:text-sm font-semibold text-[#3bb49f] cursor-pointer shadow-xs"
                                >
                                    Register Admin Hospital +
                                </Button>
                            </>
                        )}

                        {isAdmin && (
                            <Button
                                type="button"
                                onClick={() => setIsRegisterStaffOpen(true)}
                                className="bg-[#ebf8f5] hover:bg-[#d8f2ec] border border-[#c4e9e2] py-2 px-3.5 text-xs sm:text-sm font-semibold text-[#3bb49f] cursor-pointer shadow-xs"
                            >
                                Register Staff Hospital +
                            </Button>
                        )}
                    </div>

                    {/* Right side: Filter Button & Search input */}
                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        {/* Filter Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={`flex items-center gap-2 py-2 px-3.5 text-xs sm:text-sm font-medium rounded-lg cursor-pointer border ${hasActiveFilter
                                        ? "bg-[#EBF8F5] text-[#3BB49F] border-[#3BB49F] font-semibold"
                                        : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    <Filter size={15} className={hasActiveFilter ? "text-[#3BB49F]" : "text-gray-500"} />
                                    <span>Filter</span>
                                    {hasActiveFilter && (
                                        <span className="w-2 h-2 rounded-full bg-[#3BB49F] animate-pulse" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 bg-white">
                                <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Filter Role
                                </DropdownMenuLabel>
                                <DropdownMenuRadioGroup value={roleFilter} onValueChange={setRoleFilter}>
                                    <DropdownMenuRadioItem value="all" className="cursor-pointer text-xs">
                                        Semua Role
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="admin" className="cursor-pointer text-xs">
                                        Admin
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dokter" className="cursor-pointer text-xs">
                                        Dokter
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="perawat" className="cursor-pointer text-xs">
                                        Perawat
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="resepsionis" className="cursor-pointer text-xs">
                                        Resepsionis
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>

                                <DropdownMenuSeparator />

                                <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Filter Status
                                </DropdownMenuLabel>
                                <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                                    <DropdownMenuRadioItem value="all" className="cursor-pointer text-xs">
                                        Semua Status
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="active" className="cursor-pointer text-xs">
                                        Active
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="inactive" className="cursor-pointer text-xs">
                                        Inactive
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>

                                {hasActiveFilter && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="w-full text-left px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-md font-medium flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <RotateCcw size={13} />
                                            Reset Filter
                                        </button>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Search Input */}
                        <div className="relative flex-1 sm:w-64">
                            <Image
                                src="/dashboard/Search.svg"
                                alt="Search Icon"
                                width={16}
                                height={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
                            />
                            <Input
                                type="text"
                                value={search}
                                placeholder="Cari Pegawai..."
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-3 py-2 border-gray-200 text-xs sm:text-sm text-gray-700 placeholder-gray-400 bg-white rounded-lg h-9"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Component sitting directly beneath action bar */}
                <DashboardTable
                    search={search}
                    roleFilter={roleFilter}
                    statusFilter={statusFilter}
                />
            </div>

            {/* Registration Modals */}
            <RegisterHospitalModal
                isOpen={isRegisterHospitalOpen}
                onClose={handleCloseHospitalModal}
            />

            <RegisterAdminHospitalModal
                isOpen={isRegisterAdminOpen}
                onClose={handleCloseAdminModal}
            />

            <RegisterStaffHospitalModal
                isOpen={isRegisterStaffOpen}
                onClose={handleCloseStaffModal}
            />
        </div>
    );
}

export default function RolesPage() {
    return (
        <Suspense fallback={<div className="p-6">Loading roles...</div>}>
            <RoleContent />
        </Suspense>
    );
}
