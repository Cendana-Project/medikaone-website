'use client';

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, HelpCircle, Loader2 } from "lucide-react";

export interface ConfirmDetailItem {
    label: string;
    value: string;
}

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    isLoading?: boolean;
    details?: ConfirmDetailItem[];
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Ya, Lanjutkan",
    cancelText = "Batal",
    variant = "default",
    isLoading = false,
    details = [],
}: ConfirmModalProps) {
    const isDestructive = variant === "destructive";

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
            <DialogContent className="max-w-md bg-white rounded-xl p-6">
                <DialogHeader className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            isDestructive ? "bg-red-100 text-red-600" : "bg-[#EBF8F5] text-[#3BB49F]"
                        }`}>
                            {isDestructive ? <AlertTriangle size={20} /> : <HelpCircle size={20} />}
                        </div>
                        <DialogTitle className="text-lg font-bold text-gray-900">
                            {title}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-gray-600 mt-1">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {/* Details Summary Preview if provided */}
                {details.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 my-2 flex flex-col gap-1.5 text-xs text-gray-700">
                        {details.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start gap-2">
                                <span className="text-gray-500 font-medium">{item.label}:</span>
                                <span className="font-semibold text-gray-900 text-right truncate max-w-[200px]">
                                    {item.value || "-"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 mt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-lg text-sm"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`rounded-lg text-sm px-5 font-semibold text-white transition-colors ${
                            isDestructive 
                                ? "bg-red-600 hover:bg-red-700" 
                                : "bg-[#3BB49F] hover:bg-[#349d8b]"
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            confirmText
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
