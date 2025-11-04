'use client';

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import DashboardCards from "@/components/dashboard/dashboardCards";
import { Input } from "@/components/ui/input";
import DashboardTable from "@/components/dashboard/dashboardTable";
import { useState } from "react";

export default function Dashboard() {
    const [search, setSearch] = useState("");
    
    return (
        <div className="flex flex-col items-center justify-center gap-4 min-h-screen w-full max-w-full overflow-x-hidden p-6">
            <DashboardCards />
            <div className="flex flex-col items-center gap-4 w-full h-screen bg-white rounded-lg border border-black/10">
                <div className="flex items-center justify-between p-10 w-full">
                    <Button className="bg-[#ebf8f5] border border-[#c4e9e2] py-6 text-base text-[#3bb49f]">
                        <Link href={"/auth/register/admin-hospital"}>
                            Register Admin Hospital +
                        </Link>
                    </Button>
                     <div className="relative w-full max-w-sm">
                        <Image
                            src="/dashboard/Search.svg"
                            alt="Search Icon"
                            width={18}
                            height={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
                        />
                        <Input
                            type="text"
                            value={search}
                            placeholder="Cari Pegawai"
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-4 border-gray-200 text-sm text-gray-600 placeholder-gray-400 bg-white rounded-lg"
                        />
                    </div>
                </div>
                <DashboardTable search={search} />
            </div>
        </div>
    );
}
