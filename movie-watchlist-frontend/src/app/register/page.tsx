"use client";
// src/app/auth/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function AuthPage() {
    const [form, setForm] = useState({ email: "", username: "", password: "", first: "", last: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const [passwordStrength, setPasswordStrength] = useState(0)


    const validatePassword = (password: string): string[] => {
        const errors: string[] = []

        if (form.password.length < 8) {
            errors.push("Password must be at least 8 characters long")
        }

        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter")
        }

        if (!/[0-9]/.test(password)) {
            errors.push("Password must contain at least one number")
        }

        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
            errors.push("Password must contain at least one special character")
        }

        return errors
    }


    const calculatePasswordStrength = (password: string): number => {
        if (!password) return 0

        let strength = 0

        // Length check
        if (form.password.length >= 8) strength += 25

        // Character type checks
        if (/[A-Z]/.test(password)) strength += 25
        if (/[0-9]/.test(password)) strength += 25
        if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength += 25

        return strength
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await register(form.first, form.last, form.email, form.username, form.password);

            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-4 z-30">
            <header className="flex items-center justify-between mb-12">
                <Link href="/">
                    <h1 className="text-2xl font-bold font-sans">Movie List</h1>
                </Link>
                <div className="flex gap-4 ">
                    <Link className=" my-auto font-sans" href="/login">
                        <p>Login</p>
                    </Link>
                    <Link href="/register">
                        <p className="py-3 px-3 bg-white rounded-2xl text-black font-sans">Sign Up</p>
                    </Link>
                </div>
            </header>

            <div className="absolute top-0 left-0 blur-xs w-full -z-10" >
                <img className="w-full h-full blur-sm" src="https://png.pngtree.com/thumb_back/fh260/background/20250307/pngtree-a-vibrant-movie-themed-background-with-the-film-reels-camera-and-image_17080149.jpg">
                </img>
                <div className="absolute inset-0 bg-black/40" />
            </div>


            <div className="z-20" style={{
                minHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg)",
                padding: "24px",
            }}>
                {/* Background texture */}
                <div style={{
                    position: "fixed", inset: 0, pointerEvents: "none",
                    background: "radial-gradient(ellipse at 20% 50%, rgba(232,184,75,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(192,57,43,0.05) 0%, transparent 60%)",
                }} />

                <div className="card fade-up  p-[40px] bg-white rounded-lg border-gray-600 border-2 w-[35vw]">
                    {/* Logo */}
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                        <br />
                        <h1 className=" text-black text-3xl font-semibold leading-none tracking-tight font-sans">Create an Account</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col g-14 space-y-5">


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex space-x-2 flex-col">
                                <label className="text-black mb-1 block font-sans ">First Name</label>
                                <input
                                    className="input outline-1 outline-black text-black rounded-xs px-1 py-1"
                                    type="first"
                                    placeholder="John"
                                    value={form.first}
                                    onChange={(e) => setForm({ ...form, first: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex space-x-2 flex-col">
                                <label className="text-black mb-1 block font-sans">Last Name</label>
                                <input
                                    className="input outline-1 outline-black text-black rounded-xs px-1 py-1"
                                    type="last"
                                    placeholder="Doe"
                                    value={form.last}
                                    onChange={(e) => setForm({ ...form, last: e.target.value })}
                                    required
                                />

                            </div>
                        </div>

                        <div>
                            <label className="text-black mb-1 block font-sans">E-mail</label>
                            <input
                                className="input outline-1 outline-black text-black w-full rounded-xs px-1 py-1"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-black mb-1 block font-sans">Username</label>
                            <input
                                className="input outline-1  outline-black text-black  w-full rounded-xs px-1 py-1"
                                type="text"
                                placeholder="filmfanatic"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                            />
                        </div>

                        {error && (
                            <div style={{
                                background: "rgba(192,57,43,0.15)", border: "1px solid rgba(192,57,43,0.3)",
                                borderRadius: 8, padding: "10px 14px", color: "#e74c3c", fontSize: 14,
                            }}>
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 flex flex-col">
                                <label className="text-black mb-1 block" htmlFor="password font-sans">Password</label>
                                <input
                                    className="input outline-1  outline-black text-black rounded-xs px-1 py-1"
                                    id="password"
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => {
                                        const newPassword = e.target.value
                                        setForm({ ...form, password: newPassword });
                                        setPasswordStrength(calculatePasswordStrength(newPassword))
                                    }}
                                    required
                                />
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-black font-sans">Strength:</span>
                                        <span className="text-black font-sans ">
                                            {passwordStrength === 0 && "Very Weak"}
                                            {passwordStrength === 25 && "Weak"}
                                            {passwordStrength === 50 && "Medium"}
                                            {passwordStrength === 75 && "Strong"}
                                            {passwordStrength === 100 && "Very Strong"}
                                        </span>
                                    </div>
                                    <progress value={passwordStrength} className="h-2 w-full" />
                                    <div className="text-xs text-gray-500 font-sans">
                                        Password must contain:
                                        <ul className="list-disc pl-5 mt-1">
                                            <li className={form.password.length >= 8 ? "text-green-500" : ""}>At least 8 characters</li>
                                            <li className={/[A-Z]/.test(form.password) ? "text-green-500" : ""}>
                                                At least one uppercase letter
                                            </li>
                                            <li className={/[0-9]/.test(form.password) ? "text-green-500" : ""}>At least one number</li>
                                            <li className={/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password) ? "text-green-500" : ""}>
                                                At least one special character
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 flex flex-col">
                                <label className="text-black mb-1 block" htmlFor="confirmPassword font-sans">Confirm Password</label>
                                <input
                                    className="input outline-1  outline-black text-black rounded-xs px-1 py-1"
                                    id="confirmPassword"
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                    required
                                />
                                {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
                                    <p className="text-xs text-red-500">Passwords do not match</p>
                                )}
                            </div>
                        </div>



                        <button
                            className="p-3 bg-black rounded-lg text-white font-sans"
                            type="submit"
                            disabled={loading}
                            style={{ marginTop: 4, padding: "12px", fontSize: 15, fontWeight: 500 }}
                        >Submit
                        </button>

                        <p className="text-sm text-gray-500 mx-auto font-sans">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Login
                            </Link>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    );
}