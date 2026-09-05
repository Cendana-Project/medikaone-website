'use client';

import React, { useRef } from "react";

interface PinInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: boolean;
}

export function PinInput({
    length = 6,
    value = "",
    onChange,
    disabled = false,
    error = false,
}: PinInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Split string into array of characters of given length
    const digits = Array.from({ length }, (_, i) => value[i] || "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const char = e.target.value.slice(-1); // Get last typed character
        if (char && !/^\d$/.test(char)) return; // Only allow digits

        const newDigits = [...digits];
        newDigits[index] = char;
        const newPin = newDigits.join("");
        onChange(newPin);

        // Move to next input if digit entered
        if (char && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (!digits[index] && index > 0) {
                // If current box is empty, move back and delete previous
                const newDigits = [...digits];
                newDigits[index - 1] = "";
                onChange(newDigits.join(""));
                inputRefs.current[index - 1]?.focus();
            } else if (digits[index]) {
                // Clear current digit
                const newDigits = [...digits];
                newDigits[index] = "";
                onChange(newDigits.join(""));
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();
        if (!/^\d+$/.test(pastedData)) return;

        const pastedDigits = pastedData.slice(0, length);
        onChange(pastedDigits);

        // Focus the input corresponding to length of pasted digits or last box
        const focusIndex = Math.min(pastedDigits.length, length - 1);
        inputRefs.current[focusIndex]?.focus();
    };

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-3 w-full my-2">
            {Array.from({ length }, (_, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={digits[index]}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`w-12 h-14 sm:w-16 sm:h-16 text-center text-2xl font-extrabold rounded-xl border-2 transition-all duration-200 outline-none select-none ${
                        error
                            ? "border-red-400 bg-red-50 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : digits[index]
                            ? "border-[#2F907F] bg-white text-[#2F907F] shadow-sm ring-2 ring-[#2F907F]/20"
                            : "border-[#D0D5DD] bg-[#F9FAFB] text-gray-900 hover:border-gray-400 focus:border-[#2F907F] focus:bg-white focus:ring-4 focus:ring-[#2F907F]/20 shadow-xs"
                    }`}
                />
            ))}
        </div>
    );
}
