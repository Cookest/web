"use client";

import { useState } from "react";
import { Key } from "lucide-react";
import { Button, Card, CardBody, Input } from "@cookest/ui";
import { api } from "@/lib/api";

export function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function handleChange() {
    setError("");
    setMsg("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setMsg("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Failed to change password. Check your current password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardBody className="space-y-4 p-6">
        <div className="flex items-center gap-2 text-heading">
          <Key className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Change Password</h2>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-heading">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-heading">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              placeholder="New password"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-heading">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {msg && <p className="text-sm text-green-600">{msg}</p>}

        <Button onClick={handleChange} disabled={saving}>
          <Key className="mr-2 h-4 w-4" />
          {saving ? "Changing…" : "Change Password"}
        </Button>
      </CardBody>
    </Card>
  );
}
