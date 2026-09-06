'use client';

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Move, Loader2, RotateCcw } from "lucide-react";

interface AvatarCropModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string | null;
    onSave: (croppedBlob: Blob) => Promise<void> | void;
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
    const [baseSize, setBaseSize] = useState<{ width: number; height: number }>({ width: 220, height: 220 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const imageRef = useRef<HTMLImageElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const CROP_FRAME_SIZE = 220; // Circular crop frame size (220px x 220px)

    // Calculate maximum drag offset allowed so image never leaves circular viewfinder
    const getClampedOffset = useCallback((x: number, y: number, currentZoom: number, size: { width: number; height: number }) => {
        const scaledW = size.width * currentZoom;
        const scaledH = size.height * currentZoom;

        const maxOffsetX = Math.max(0, (scaledW - CROP_FRAME_SIZE) / 2);
        const maxOffsetY = Math.max(0, (scaledH - CROP_FRAME_SIZE) / 2);

        const clampedX = Math.min(maxOffsetX, Math.max(-maxOffsetX, x));
        const clampedY = Math.min(maxOffsetY, Math.max(-maxOffsetY, y));

        return { x: clampedX, y: clampedY };
    }, []);

    // Reset settings when image changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setZoom(1.0);
            setOffsetX(0);
            setOffsetY(0);

            if (imageRef.current && imageRef.current.complete && imageRef.current.naturalWidth) {
                const nw = imageRef.current.naturalWidth;
                const nh = imageRef.current.naturalHeight;
                // Scale to cover the 220px circular frame completely
                const scaleToCover = Math.max(CROP_FRAME_SIZE / nw, CROP_FRAME_SIZE / nh);
                setBaseSize({
                    width: nw * scaleToCover,
                    height: nh * scaleToCover,
                });
            }
        }
    }, [isOpen, imageSrc]);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const nw = img.naturalWidth || 220;
        const nh = img.naturalHeight || 220;

        // Cover the 220px circular frame without empty space
        const scaleToCover = Math.max(CROP_FRAME_SIZE / nw, CROP_FRAME_SIZE / nh);
        setBaseSize({
            width: nw * scaleToCover,
            height: nh * scaleToCover,
        });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
    };

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const rawX = e.clientX - dragStart.x;
        const rawY = e.clientY - dragStart.y;
        const clamped = getClampedOffset(rawX, rawY, zoom, baseSize);
        setOffsetX(clamped.x);
        setOffsetY(clamped.y);
    }, [isDragging, dragStart, zoom, baseSize, getClampedOffset]);

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch Event Handlers for Mobile & Trackpads
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            setIsDragging(true);
            setDragStart({ x: touch.clientX - offsetX, y: touch.clientY - offsetY });
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || e.touches.length !== 1) return;
        const touch = e.touches[0];
        const rawX = touch.clientX - dragStart.x;
        const rawY = touch.clientY - dragStart.y;
        const clamped = getClampedOffset(rawX, rawY, zoom, baseSize);
        setOffsetX(clamped.x);
        setOffsetY(clamped.y);
    };

    const handleZoomChange = (newZoom: number) => {
        setZoom(newZoom);
        const clamped = getClampedOffset(offsetX, offsetY, newZoom, baseSize);
        setOffsetX(clamped.x);
        setOffsetY(clamped.y);
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
            const OUTPUT_SIZE = 300; // Output 300x300 avatar image
            canvas.width = OUTPUT_SIZE;
            canvas.height = OUTPUT_SIZE;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const img = imageRef.current;
            ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

            // Clip circle shape
            ctx.beginPath();
            ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            // Background fill
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

            const scaleFactor = OUTPUT_SIZE / CROP_FRAME_SIZE;
            const drawWidth = baseSize.width * zoom * scaleFactor;
            const drawHeight = baseSize.height * zoom * scaleFactor;
            const centerX = OUTPUT_SIZE / 2 + offsetX * scaleFactor;
            const centerY = OUTPUT_SIZE / 2 + offsetY * scaleFactor;

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
            console.error("Cropping error", err);
            setIsSubmitting(false);
        }
    };

    if (!imageSrc) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md bg-white rounded-xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-gray-900">
                        Sesuaikan Position Foto
                    </DialogTitle>
                    <p className="text-xs text-gray-500">
                        Geser foto dan sesuaikan tingkat zoom dalam bingkai bundar.
                    </p>
                </DialogHeader>

                {/* Clean Circular Viewfinder without huge black background box */}
                <div className="flex flex-col items-center gap-4 my-3">
                    <div
                        ref={containerRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleMouseUp}
                        className="relative w-[220px] h-[220px] rounded-full border-4 border-[#3BB49F] shadow-lg bg-gray-100 overflow-hidden cursor-move flex items-center justify-center select-none touch-none"
                    >
                        {/* Source Image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            ref={imageRef}
                            src={imageSrc}
                            onLoad={handleImageLoad}
                            alt="Crop Preview"
                            draggable={false}
                            className="absolute max-w-none transition-transform duration-75 select-none pointer-events-none"
                            style={{
                                width: `${baseSize.width}px`,
                                height: `${baseSize.height}px`,
                                transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
                                transformOrigin: "center center",
                            }}
                        />
                    </div>

                    {/* Controls */}
                    <div className="w-full flex flex-col gap-3 px-2">
                        <div className="flex items-center gap-3">
                            <ZoomOut size={16} className="text-gray-500 shrink-0" />
                            <input
                                type="range"
                                min="1.0"
                                max="3.5"
                                step="0.05"
                                value={zoom}
                                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3BB49F]"
                            />
                            <ZoomIn size={16} className="text-gray-500 shrink-0" />
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span className="flex items-center gap-1 text-[11px]">
                                <Move size={12} /> Klik & geser foto untuk mengubah posisi
                            </span>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex items-center gap-1 text-[#3BB49F] hover:underline cursor-pointer font-medium"
                            >
                                <RotateCcw size={12} /> Reset
                            </button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-lg cursor-pointer text-xs"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleCropAndSave}
                        disabled={isSubmitting}
                        className="bg-[#3BB49F] hover:bg-[#349d8b] text-white rounded-lg px-5 cursor-pointer text-xs font-semibold"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            "Pilih Foto Ini"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
