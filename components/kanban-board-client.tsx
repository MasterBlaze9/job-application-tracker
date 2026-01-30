"use client";

import dynamic from "next/dynamic";
import type { Board } from "@/lib/models/models.types";

const KanbanBoard = dynamic(() => import("@/components/kanban-board"), {
	ssr: false,
	loading: () => <p>Loading board...</p>,
});

export default function KanbanBoardClient({
	board,
	userId,
}: {
	board: Board;
	userId: string;
}) {
	return <KanbanBoard board={board} userId={userId} />;
}
