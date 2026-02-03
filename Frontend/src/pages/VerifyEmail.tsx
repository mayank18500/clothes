import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current) return;

        if (!token) {
            setStatus("error");
            return;
        }

        effectRan.current = true;

        const verify = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                    credentials: "include"
                });
                const data = await res.json();

                if (res.ok) {
                    setStatus("success");
                    toast.success("Email verified successfully!");
                    setTimeout(() => navigate("/"), 2000);
                } else {
                    setStatus("error");
                    toast.error(data.message || "Verification failed");
                }
            } catch (error) {
                setStatus("error");
                toast.error("An error occurred");
            }
        };

        verify();
    }, [token, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Email Verification</CardTitle>
                    <CardDescription>
                        {status === "verifying" && "Verifying your email..."}
                        {status === "success" && "Verification Successful!"}
                        {status === "error" && "Verification Failed"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                    {status === "verifying" && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
                    {status === "success" && <div className="text-green-500 font-semibold">Redirecting...</div>}
                    {status === "error" && <div className="text-red-500">Invalid or expired token.</div>}
                </CardContent>
            </Card>
        </div>
    );
};

export default VerifyEmail;
