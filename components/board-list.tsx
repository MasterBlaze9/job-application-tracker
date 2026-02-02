"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateBoard, deleteBoard } from "@/lib/actions/boards";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Pencil, Trash2, Check, X } from "lucide-react";

type BoardSummary = {
  _id: string;
  name: string;
};

export default function BoardList({
  boards,
  activeBoardId,
}: {
  boards: BoardSummary[];
  activeBoardId?: string;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const startEdit = (board: BoardSummary) => {
    setEditingId(board._id);
    setName(board.name);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setError(null);
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    startTransition(async () => {
      const result = await updateBoard(editingId, name.trim());
      if (result?.error) {
        setError(result.error);
        return;
      }
      cancelEdit();
      router.refresh();
    });
  };

  const handleDelete = (boardId: string) => {
    if (!confirm("Delete this board? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteBoard(boardId);
      if (activeBoardId === boardId) {
        router.push("/dashboard");
      } else {
        router.refresh();
      }
    });
  };

  if (!boards.length) {
    return <p className="text-sm text-gray-600">No boards yet.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {boards.map((board) => {
        const isEditing = editingId === board._id;

        return (
          <div
            key={board._id}
            className={`flex w-full rounded-md border p-3 flex-col gap-2 border-gray-200"
              }`}
          >
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  disabled={isPending}
                />
                {error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : null}
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit} disabled={isPending}>
                    <Check className="h-4 w-4 mr-1" /> Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelEdit}
                    disabled={isPending}
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>

                <Link
                  href={`/dashboard/${board._id}`}
                  className="font-semibold text-gray-900 hover:text-primary"
                >
                  <div className="flex items-center justify-between gap-2">
                    {board.name}

                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(board)}
                        aria-label={`Rename ${board.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(board._id)}
                        aria-label={`Delete ${board.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
