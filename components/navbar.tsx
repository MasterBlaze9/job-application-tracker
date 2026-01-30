"use client";

import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { getSession } from "@/lib/auth/auth";
import { DropdownMenu } from "./ui/dropdown-menu"
import { DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import SignOutBtn from "./sign-out-btn";
import { useSession } from "@/lib/auth/auth-clients";

export default function NavBar() {
	const{data:session} = useSession();
	return (
		<nav className="border-b border-gray-200 bg-white">
			<div className="container mx-auto flex h-16 items-center px-4 justify-between">
				<Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary">
					<Briefcase size={32} />
					Job Tracker
				</Link>
				<div className="flex items-center gap-4">
					{session?.user ? (
						<>
							<Button asChild variant={"ghost"} className="text-gray-700 hover:text-black">
								<Link href="/dashboard">
									Dashboard
								</Link>
							</Button>
							<DropdownMenu >
								<DropdownMenuTrigger asChild>
									<Button variant="ghost">
										<Avatar>
											<AvatarFallback className="bg-primary text-white">
												{session.user.name[0].toUpperCase()}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuLabel>
										<div>
											<p>{session.user.name}</p>
											<p>{session.user.email}</p>
										</div>
									</DropdownMenuLabel>
									<SignOutBtn />
								</DropdownMenuContent>
							</DropdownMenu>

						</>
					) : (
						<>
							<Button asChild variant={"ghost"} className="text-gray-700 hover:text-black">
								<Link href="/sign-in">
									Log In
								</Link>
							</Button>
							<Button asChild className="bg-primary  hover:bg-primary/90">
								<Link href="/sign-up">
									Start for Free
								</Link>
							</Button>
						</>
					)}
				</div>
			</div>

		</nav>
	)
}