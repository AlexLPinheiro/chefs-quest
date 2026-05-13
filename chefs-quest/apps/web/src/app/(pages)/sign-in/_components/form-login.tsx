"use client"

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";

interface FormLoginProps {
    callbackurl: string | undefined;
}

export default function FormLogin({ callbackurl }: FormLoginProps) {
    const [loading, setLoading] = useState(false);
    // const router = useRouter();
    // const pathname = usePathname();

    const handleMicrosoftLogin = async () => {
        setLoading(true);
        try {
            await authClient.signIn.social({
                provider: "microsoft",
                callbackURL: callbackurl,
            });


        } catch (error) {
            console.error("Microsoft login error:", error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white from-g-gray-00 to-g-gray-05 px-4">
            <button
                className="flex h-11 w-full items-center justify-center gap-2 border-1.5 rounded-2xl"
                onClick={handleMicrosoftLogin}
                disabled={loading}
            >
                Logue com sua conta senai.
            </button>
        </div>
    )

}