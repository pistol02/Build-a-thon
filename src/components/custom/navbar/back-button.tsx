"use client"
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

export default function BackButton() {
    const router = useRouter()
    const pathname = usePathname();
    return pathname !== "/dashboard" && (
        <Button
            onClick={() => router.back()}
            variant="ghost"
            className="bg-primary/30 text-primary rounded-md !p-2 h-7 w-7"
        >
            <ChevronLeft size={12} />
        </Button>
    )
}
