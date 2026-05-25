"use client"

import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import styles from "../sign-in.module.css";

interface FormLoginProps {
    callbackurl: string | undefined;
}

export default function FormLogin({ callbackurl }: FormLoginProps) {
    const [loading, setLoading] = useState(false);

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
        <div className={styles.loginScreen}>
            <div className={styles.loginCard}>
                <h1 className={styles.loginTitle}>Chef&apos;s Quest</h1>
                <p className={styles.loginText}>Entre com sua conta do Senai para continuar.</p>
            <button
                className={styles.loginButton}
                onClick={handleMicrosoftLogin}
                disabled={loading}
            >
                {loading ? "Entrando..." : "Entrar com conta Senai"}
            </button>
            </div>
        </div>
    )

}