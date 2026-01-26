"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth/auth-clients";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import router from "next/router";
import { useState } from "react";

export default function SignUp() {

	const [name, setName] = useState("");
	const[email,setEmail] = useState("");
	const [password, setPassword] = useState("");
	
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const result =await signUp.email({
				name,
				email,
				password
			});

			if (result.error) {
				setError(result.error.message ?? "Failed to sign up. Please try again.");
			} else {
				router.push("/dashboard");
			}
			
		} catch (err) {
			setError("An unexpected error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
			<Card>
				<CardHeader>
					<CardTitle>Sign Up</CardTitle>
					<CardDescription>
						Create a new account to start tracking your applications.
					</CardDescription>
				</CardHeader>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
					{error &&
						<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>
					}
						<div className="space-y-2">
							<Label htmlFor="name" className="text-gray-700">Name</Label>
							<Input id="name" type="text" placeholder="Your full name" value={name} onChange={(e)=> setName(e.target.value)}
								className="mt-1 mb-4 w-full" required />
						</div>
						<div className="space-y-2">
							<Label htmlFor="email" className="text-gray-700">Email</Label>
							<Input id="email" type="email" placeholder="Your email address" value={email} onChange={(e)=> setEmail(e.target.value)}
								className="mt-1 mb-4 w-full" required />
						</div>
						<div className="space-y-2">
							<Label htmlFor="password" className="text-gray-700">Password</Label>
							<Input id="password" type="password" placeholder="Your password" value={password} onChange={(e)=> setPassword(e.target.value)}
								className="mt-1 mb-4 w-full" required />
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						<Button type="submit"
							className="w-full bg-primary hover:bg-primary/90"
							disabled={loading}
						>Create Account</Button>
						<p className="text-center text-sm text-gray-600">Already have an account?{" "} <Link href="/sign-in" className="text-primary">Sign In</Link></p>
					</CardFooter>
				</form>
			</Card>

		</div>
	);
}

