"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";
import { DEFAULT_COLUMNS } from "../init-user-board";

export async function listBoards() {
  const session = await getSession();
  if (!session?.user) return { error: "Unauthorized" };

  await connectDB();

  const boards = await Board.find({
    userId: session.user.id,
    isArchived: { $ne: true },
  })
    .sort({ createdAt: -1 })
    .lean();

  return { data: JSON.parse(JSON.stringify(boards)) };
}

export async function getBoardById(boardId: string) {
  const session = await getSession();
  if (!session?.user) return { error: "Unauthorized" };

  await connectDB();

  const board = await Board.findOne({
    _id: boardId,
    userId: session.user.id,
    isArchived: { $ne: true },
  })
    .populate({
      path: "columns",
      populate: {
        path: "jobApplications",
      },
    })
    .lean();

  if (!board) return { error: "Board not found" };

  return { data: JSON.parse(JSON.stringify(board)) };
}

export async function createBoard(name: string) {
  const session = await getSession();
  if (!session?.user) return { error: "Unauthorized" };

  if (!name?.trim()) {
    return { error: "Board name is required" };
  }

  await connectDB();

  const board = await Board.create({
    name: name.trim(),
    userId: session.user.id,
    columns: [],
  });

  const columns = await Promise.all(
    DEFAULT_COLUMNS.map((col) =>
      Column.create({
        name: col.name,
        order: col.order,
        boardId: board._id,
        jobApplications: [],
      }),
    ),
  );

  board.columns = columns.map((col) => col._id);
  await board.save();

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${board._id.toString()}`);

  return { data: JSON.parse(JSON.stringify(board)) };
}

export async function updateBoard(boardId: string, name: string) {
  const session = await getSession();
  if (!session?.user) return { error: "Unauthorized" };

  await connectDB();

  const board = await Board.findOneAndUpdate(
    { _id: boardId, userId: session.user.id, isArchived: { $ne: true } },
    { $set: { name: name?.trim() } },
    { new: true },
  ).lean();

  if (!board) return { error: "Board not found" };

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${boardId}`);
  return { data: JSON.parse(JSON.stringify(board)) };
}

export async function deleteBoard(boardId: string) {
  const session = await getSession();
  if (!session?.user) return { error: "Unauthorized" };

  await connectDB();

  const board = await Board.findOne({ _id: boardId, userId: session.user.id });
  if (!board) return { error: "Board not found" };

  await Board.deleteOne({ _id: boardId, userId: session.user.id });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteColumn(boardId: string, columnId: string) {
  const session = await getSession();
  if (!session?.user) return { error: "Unauthorized" };

  await connectDB();

  const board = await Board.findOne({ _id: boardId, userId: session.user.id });
  if (!board) return { error: "Board not found" };

  const column = await Column.findOne({ _id: columnId, boardId: boardId });
  if (!column) return { error: "Column not found" };

  // Remove job applications that belong to the column
  await JobApplication.deleteMany({ columnId: columnId });

  // Remove column reference from board
  await Board.findByIdAndUpdate(boardId, { $pull: { columns: columnId } });

  // Delete the column
  await Column.deleteOne({ _id: columnId });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${boardId}`);

  return { success: true };
}
