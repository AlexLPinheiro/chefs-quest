import { Suspense } from "react";
import FormLogin from "./_components/form-login";
import styles from "./sign-in.module.css";

function Loading() {
    return (
        <div className={styles.loading}>
            <p className={styles.loadingText}>Preparing login...</p>
        </div>

    );
}

interface LoginPageProps {
    searchParams: Promise<{
        callbackurl?: string;
    }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const params = await searchParams;
    const callbackUrl = params.callbackurl;

    return(
        <Suspense fallback={<Loading/>}>
            <FormLogin callbackurl={callbackUrl} />
        </Suspense>
    )
}
