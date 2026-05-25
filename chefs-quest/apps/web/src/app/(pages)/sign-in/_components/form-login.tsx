"use client"

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/app/assets/image/logo.png";
import { Button } from "@/components/ui/button";
import styles from "../sign-in.module.css";

export default function FormLogin() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Bypass temporario: nao chama social auth e segue direto para home.
    const handleMicrosoftLogin = () => {
        setLoading(true);
        // await authClient.signIn.social({ provider: "microsoft", callbackURL });
        router.push("/home");
    };

    return (
        <main className={styles.loginScreen}>
            <section className={styles.loginPanel} aria-labelledby="login-title">
                <header className={styles.loginHeader}>
                    <h1 id="login-title" className={styles.loginTitle}>Login</h1>
                    <p className={styles.loginText}>Por favor, efetue login para continuar</p>
                </header>

                <form
                    className={styles.loginCard}
                    onSubmit={(event) => {
                        event.preventDefault();
                        void handleMicrosoftLogin();
                    }}
                >
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="email">Usuario</label>
                        <input
                            id="email"
                            className={styles.fieldInput}
                            type="email"
                            placeholder="exemplo@gmail.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="password">Senha</label>
                        <input
                            id="password"
                            className={styles.fieldInput}
                            type="password"
                            placeholder="***************"
                            autoComplete="current-password"
                        />
                    </div>

                    <div className={styles.formOptions}>
                        <label className={styles.rememberOption}>
                            <input type="checkbox" defaultChecked />
                            <span>Lembrar-me</span>
                        </label>

                        <button className={styles.forgotButton} type="button">
                            Esqueceu sua senha?
                        </button>
                    </div>

                    <Button
                        className={styles.loginButton}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </Button>

                    <div className={styles.separator}>
                        <span>Ou</span>
                    </div>

                    <Button
                        className={styles.registerButton}
                        type="button"
                        variant="outline"
                    >
                        Cadastrar
                    </Button>
                </form>

                <Image src={Logo} alt="Chef's Quest" className={styles.logo} priority />
            </section>
        </main>
    )
}
