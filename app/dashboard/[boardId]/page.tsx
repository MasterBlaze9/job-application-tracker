import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import KanbanBoardClient from "@/components/kanban-board-client";
import mongoose from "mongoose";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Arrow } from "@radix-ui/react-dropdown-menu";
import { ArrowLeft } from "lucide-react";

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
  return JSON.parse(JSON.stringify(boardDoc));
}

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    redirect("/dashboard");
  }

  const board = await getBoard(boardId, session.user.id);

  if (!board) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6">
        <div className="flex flex-row pt-6">
          <Link
            href="/dashboard"
            className="text-primary hover:underline font-medium"
          >
            <Button variant={"ghost"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>

        </div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">{board.name}</h1>
          <p className="text-gray-600">Track your job applications</p>
        </div>
        <KanbanBoardClient board={board} userId={session.user.id} />
      </div>
    </div>
  );
}
