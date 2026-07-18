"use client";

import { useTransition } from "react";
import { updateRestaurantStatus } from "@/app/actions/restaurant";

interface ApproveRestaurantButtonProps {
    id: string;
    status: 'approved' | 'rejected';
    label: string;
    className: string;
}

export default function ApproveRestaurantButton({ id, status, label, className }: ApproveRestaurantButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleUpdate = () => {
        startTransition(async () => {
            try {
                await updateRestaurantStatus(id, status);
            } catch (err: any) {
                console.error("Status update error:", err);
                alert(`Onay güncelleme sırasında hata oluştu: ${err.message}`);
            }
        });
    };

    return (
        <button
            onClick={handleUpdate}
            disabled={isPending}
            className={`${className} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {isPending ? "GÜNCELLENİYOR..." : label}
        </button>
    );
}
