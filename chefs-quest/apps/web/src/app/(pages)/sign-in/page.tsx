import { Suspense } from "react";
import FormLogin from "./_components/form-login";

function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
            <p className="mt-4 text-lg text-gray-700">Preparing login...</p>
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
