"use client";

import { useTransition } from "react";

interface DeleteRestaurantButtonProps {
    id: string;
    name: string;
    onDelete: (id: string) => Promise<{ success?: boolean; error?: string }>;
}

export default function DeleteRestaurantButton({ id, name, onDelete }: DeleteRestaurantButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        const confirmed = confirm(
            `"${name}" isimli restoranı ve bu restorana ait tüm rezervasyonları silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!`
        );

        if (confirmed) {
            startTransition(async () => {
                try {
                    const result = await onDelete(id);
                    if (result?.error) {
                        alert(`Silme işlemi başarısız: ${result.error}`);
                    }
                } catch (err: any) {
                    console.error("Restoran silme hatası:", err);
                    alert(`Silme işlemi sırasında beklenmedik hata: ${err.message}`);
                }
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="inline-block px-5 py-2.5 bg-red-500/10 border border-red-500/20 hover:bg-red-600 hover:text-white text-red-500 hover:scale-105 text-[9px] font-black rounded-xl tracking-widest uppercase transition-all shadow-md italic cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isPending ? "SİLİNİYOR..." : "SİL"}
        </button>
    );
}
