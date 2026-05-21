"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button, Card, CardBody } from "@cookest/ui";

interface DangerSectionProps {
  onDelete: () => Promise<void>;
}

export function DangerSection({ onDelete }: DangerSectionProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete();
    } catch {
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  return (
    <Card className="border-red-200">
      <CardBody className="space-y-4 p-6">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Danger Zone</h2>
        </div>

        <p className="text-sm text-muted">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>

        {!showConfirm ? (
          <Button
            variant="secondary"
            className="border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => setShowConfirm(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        ) : (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
            <p className="text-sm text-red-800">
              Are you sure? This will permanently delete your account.
            </p>
            <div className="flex gap-2 ml-auto shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Yes, Delete"}
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
