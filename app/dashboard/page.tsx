import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import KanbanBoardClient from "@/components/kanban-board-client";
import Link from "next/link";
import { listBoards } from "@/lib/actions/boards";
import CreateBoardDialog from "@/components/create-board-dialog";
import BoardList from "@/components/board-list";

async function getBoard(boardId: string, userId: string) {
	await connectDB();

	const boardDoc = await Board.findOne({
		_id: boardId,
		userId,
		isArchived: { $ne: true },
	})
		.populate({
			path: "columns",
			populate: {
				path: "jobApplications",
			},
		})
		.lean();

	if (!boardDoc) return null;

	const board = JSON.parse(JSON.stringify(boardDoc));

	return board;
}

async function DashboardPage() {
	const session = await getSession();

	if (!session?.user) {
		redirect("/sign-in");
	}

	const boards = (await listBoards()).data || [];

	const activeBoardId = boards[0]?._id;


	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto p-6">
				<div className="mb-6 flex flex-col gap-4">
					<div className="flex items-center justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-black">
								Boards List
							</h1>
							<p className="text-gray-600">Track your job applications</p>
						</div>
						<CreateBoardDialog />
					</div>
					<div className="flex gap-4">
					<BoardList boards={boards} activeBoardId={activeBoardId} />

					</div>

				</div>
				
			</div>
		</div>
	);
}

export default async function Dashboard() {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<DashboardPage />
		</Suspense>
	);
}
