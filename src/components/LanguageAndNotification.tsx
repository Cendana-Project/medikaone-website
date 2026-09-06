"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LanguageAndNotification() {
    return (
        <div className="flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 px-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                        <Image
                            src="/id.png"
                            alt="Indonesian Flag"
                            width={24}
                            height={16}
                            className="rounded-sm"
                        />
                        <span className="text-sm font-medium text-gray-700">IDN</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-40">
                    <DropdownMenuItem className="flex items-center gap-2">
                        <Image src="/id.png" alt="ID" width={20} height={14} />
                        <span>Indonesia (IDN)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2">
                        <Image src="/us.png" alt="EN" width={20} height={14} />
                        <span>English (ENG)</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon">
                <Image
                    src="/dashboard/lonceng.svg"
                    alt="Notification Bell"
                    width={40}
                    height={40}
                />
            </Button>
        </div>
    );
}
