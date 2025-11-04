"use client";

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
    return (
        <Dialog>
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

            <DialogContent className="sm:max-w-[340px] text-center py-6">
                <div className="flex flex-col items-center space-y-4">
                    <div className="bg-red-50 p-4 rounded-full">
                        <div className="bg-red-200 p-8 rounded-full">
                            <Image
                                src="/dashboard/DELETE.svg"
                                alt="Delete icon"
                                width={40}
                                height={40}
                            />
                        </div>
                    </div>

                    <DialogHeader className="space-y-1 flex text-center justify-center items-center">
                        <DialogTitle className="text-2xl font-semibold">
                            Informasi
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600">
                            Apakah anda yakin menghapus akun ini?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex justify-center gap-3 pt-2">
                        <Button variant="outline">Batalkan</Button>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                        >
                            Hapus Akun
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
