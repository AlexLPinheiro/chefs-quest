"use client"

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/app/assets/image/logo.png";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/app/actions/progress";
import styles from "../sign-in.module.css";

export default function FormLogin() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Autentica o usuário pelo nome e redireciona
    const handleLogin = async (formData: FormData) => {
        setLoading(true);
        const name = formData.get("username") as string;
        if (!name.trim()) {
            setLoading(false);
            return;
        }
        await loginUser(name.trim());
        router.push("/home");
    };

    return (
        <main className={styles.loginScreen}>
            <section className={styles.loginPanel} aria-labelledby="login-title">
                <Image src={Logo} alt="Chef's Quest" className={styles.logo} priority />

                <header className={styles.loginHeader}>
                    <h1 id="login-title" className={styles.loginTitle}>Chef&apos;s Quest</h1>
                    <p className={styles.loginText}>Digite seu nome para continuar</p>
                </header>

                <form
                    className={styles.loginCard}
                    onSubmit={(event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        void handleLogin(formData);
                    }}
                >
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="username">Nome de usuário</label>
                        <input
                            id="username"
                            name="username"
                            className={styles.fieldInput}
                            type="text"
                            placeholder="Seu nome"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <Button
                        className={styles.loginButton}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Entrando..." : "Continuar"}
                    </Button>
                </form>
            </section>
        </main>
    )
}
