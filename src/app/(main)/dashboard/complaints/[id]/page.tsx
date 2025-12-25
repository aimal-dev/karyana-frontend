"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function ComplaintRedirect({ params }: { params: { id: string } }) {
    const router = useRouter();
    
    useEffect(() => {
        // Since we don't have a dedicated single complaint page design yet,
        // we redirect the user to the main complaints list.
        // In a real app, we might want to highlight the specific complaint.
        router.push('/dashboard/complaints');
    }, [router]);

    return (
        <div className="h-[60vh] flex items-center justify-center">
             <div className="text-center">
                <Loader2 className="size-10 text-indigo-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Redirecting to complaints...</p>
             </div>
        </div>
    );
}
