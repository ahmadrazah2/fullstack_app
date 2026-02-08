"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../lib/api";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await registerUser({ email, password });
            router.push("/login?registered=true");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="grid">
            <div>
                <h1>Register</h1>
                <p>Create a new account</p>
            </div>

            <form className="card grid" onSubmit={handleRegister}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
            <p>
                Already have an account? <a href="/login">Login</a>
            </p>
        </main>
    );
}
