"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface DeleteDialogProps {
    onConfirm: () => void;
}

export default function DeleteUser({ onConfirm }: DeleteDialogProps) {
    const [open, setOpen] = useState(false);

    const handleConfirm = () => {
        onConfirm();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 px-6"
                >
                    <Image
                        src="/dashboard/DELETE.svg"
                        alt="Delete icon"
                        width={16}
                        height={16}
                    />
                    Delete
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[340px] text-center py-6 bg-white">
                <div className="flex flex-col items-center space-y-4">
                    <div className="bg-red-50 p-4 rounded-full">
                        <div className="bg-red-100 p-6 rounded-full">
                            <Image
                                src="/dashboard/DELETE.svg"
                                alt="Delete icon"
                                width={32}
                                height={32}
                            />
                        </div>
                    </div>

                    <DialogHeader className="space-y-1 flex text-center justify-center items-center">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            Konfirmasi Hapus
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600">
                            Apakah Anda yakin ingin menghapus akun ini?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex justify-center gap-3 pt-2 w-full">
                        <Button variant="outline" onClick={() => setOpen(false)} className="rounded-lg text-xs">
                            Batalkan
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirm}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs"
                        >
                            Hapus Akun
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
