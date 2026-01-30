"use client"

import { signOut } from "@/lib/auth/auth-clients";
import { DropdownMenuItem } from "./ui/dropdown-menu"
import { redirect } from "next/navigation";

export default function SignOutBtn() {

	async function handleSignOut() {
		const result = await signOut();

		if (result.data) {
			redirect("/sign-in");
		}
	}

	return (
		<DropdownMenuItem onClick={handleSignOut}>
			Log Out
		</DropdownMenuItem>
	)

}