'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const handleLogout = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        router.push("/login");
    };
    return (
        <div className="flex flex-col gap-6 min-h-screen items-center justify-center bg-white">
            <div className="flex gap-4">
                <Button className="bg-[#2F907F] py-6 text-base">
                    <Link href={"/auth/register/admin-hospital"}>
                        Register Admin Hospital
                    </Link>
                </Button>

                <Button className="bg-[#2F907F] py-6 text-base">
                    <Link href={"/auth/register/admin-hospital"}>
                        Register Staff Hospital
                    </Link>
                </Button>
            </div>
            <Button
                onClick={handleLogout}
                variant="outline"
                className="text-[#2F907F] border-[#2F907F] hover:bg-[#2F907F] hover:text-white transition-colors"
            >
                Logout
            </Button>
        </div>
    );
}
