'use client';

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Move, Loader2, RotateCcw } from "lucide-react";

interface AvatarCropModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string | null;
    onSave: (croppedBlob: Blob) => Promise<void>;
}

export default function AvatarCropModal({
    isOpen,
    onClose,
    imageSrc,
    onSave,
}: AvatarCropModalProps) {
    const [zoom, setZoom] = useState<number>(1.0);
    const [offsetX, setOffsetX] = useState<number>(0);
    const [offsetY, setOffsetY] = useState<number>(0);
    const [baseSize, setBaseSize] = useState<{ width: number; height: number }>({ width: 180, height: 180 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const imageRef = useRef<HTMLImageElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const VIEWFINDER_SIZE = 180; // Viewfinder circle diameter

    // Reset settings when image changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setZoom(1.0);
            setOffsetX(0);
            setOffsetY(0);

            // If image is already loaded/cached in DOM, compute scale to fit immediately
            if (imageRef.current && imageRef.current.complete && imageRef.current.naturalWidth) {
                const nw = imageRef.current.naturalWidth;
                const nh = imageRef.current.naturalHeight;
                const scaleToFit = Math.min(VIEWFINDER_SIZE / nw, VIEWFINDER_SIZE / nh);
                setBaseSize({
                    width: nw * scaleToFit,
                    height: nh * scaleToFit,
                });
            }
        }
    }, [isOpen, imageSrc]);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const nw = img.naturalWidth || 180;
        const nh = img.naturalHeight || 180;
        
        // Scale image to fit within the 180px viewfinder circle at default zoom = 1.0
        const scaleToFit = Math.min(VIEWFINDER_SIZE / nw, VIEWFINDER_SIZE / nh);
        setBaseSize({
            width: nw * scaleToFit,
            height: nh * scaleToFit,
        });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
    };

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;
        setOffsetX(e.clientX - dragStart.x);
        setOffsetY(e.clientY - dragStart.y);
    }, [isDragging, dragStart]);

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleReset = () => {
        setZoom(1.0);
        setOffsetX(0);
        setOffsetY(0);
    };

    const handleCropAndSave = async () => {
        if (!imageRef.current) return;
        setIsSubmitting(true);

        try {
            const canvas = document.createElement("canvas");
            const CROP_SIZE = 300; // Output avatar size 300x300
            canvas.width = CROP_SIZE;
            canvas.height = CROP_SIZE;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const img = imageRef.current;

            // Clear canvas
            ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);

            // Draw clip circle
            ctx.beginPath();
            ctx.arc(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            // Fill white background for clean crop
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, CROP_SIZE, CROP_SIZE);

            // Calculate scaling and center translation
            const scaleFactor = CROP_SIZE / VIEWFINDER_SIZE;

            const drawWidth = baseSize.width * zoom * scaleFactor;
            const drawHeight = baseSize.height * zoom * scaleFactor;

            const centerX = CROP_SIZE / 2 + offsetX * scaleFactor;
            const centerY = CROP_SIZE / 2 + offsetY * scaleFactor;

            ctx.drawImage(
                img,
                centerX - drawWidth / 2,
                centerY - drawHeight / 2,
                drawWidth,
                drawHeight
            );

            canvas.toBlob(
                async (blob) => {
                    if (blob) {
                        await onSave(blob);
                        onClose();
                    }
                    setIsSubmitting(false);
                },
                "image/png",
                0.95
            );
        } catch (err) {
            console.error("Cropping failed", err);
            setIsSubmitting(false);
        }
    };

    if (!imageSrc) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md bg-white rounded-xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-gray-900">
                        Atur & Sesuaikan Foto Profil
                    </DialogTitle>
                    <p className="text-xs text-gray-500">
                        Geser gambar dan sesuaikan zoom untuk memfokuskan foto dalam bingkai bulat.
                    </p>
                </DialogHeader>

                {/* Viewfinder Canvas */}
                <div className="flex flex-col items-center gap-4 my-2">
                    <div
                        ref={containerRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className="relative w-[260px] h-[260px] bg-slate-900 rounded-lg overflow-hidden cursor-move flex items-center justify-center select-none"
                    >
                        {/* Render Source Image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            ref={imageRef}
                            src={imageSrc}
                            onLoad={handleImageLoad}
                            alt="Crop Preview"
                            draggable={false}
                            className="absolute max-w-none transition-transform duration-75"
                            style={{
                                width: `${baseSize.width}px`,
                                height: `${baseSize.height}px`,
                                transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
                                transformOrigin: "center center",
                            }}
                        />

                        {/* Circular Viewfinder Overlay */}
                        <div className="pointer-events-none absolute w-[180px] h-[180px] rounded-full border-2 border-[#3BB49F] shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]" />
                    </div>

                    {/* Controls */}
                    <div className="w-full flex flex-col gap-3 px-2">
                        <div className="flex items-center gap-3">
                            <ZoomOut size={16} className="text-gray-500 shrink-0" />
                            <input
                                type="range"
                                min="0.5"
                                max="4.0"
                                step="0.05"
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3BB49F]"
                            />
                            <ZoomIn size={16} className="text-gray-500 shrink-0" />
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <Move size={12} /> Drag gambar untuk menggeser posisi
                            </span>
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-1 text-[#3BB49F] hover:underline cursor-pointer"
                            >
                                <RotateCcw size={12} /> Reset
                            </button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-lg cursor-pointer"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleCropAndSave}
                        disabled={isSubmitting}
                        className="bg-[#3BB49F] hover:bg-[#349d8b] text-white rounded-lg px-5 cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            "Simpan & Unggah"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
