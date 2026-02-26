"use client";

import { useState } from "react";

interface RequestAppModalProps {
  appId: string;
  appName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function RequestAppModal({ appId, appName, isOpen, onClose }: RequestAppModalProps) {
  const [requestReason, setRequestReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit() {
    if (!requestReason.trim()) {
      setError("请填写请求理由");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"}/api/app-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "USER"
        },
        body: JSON.stringify({ appId, requestReason })
      });

      if (!response.ok) {
        throw new Error(`提交失败: ${response.status}`);
      }

      setRequestReason("");
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "提交失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-slate-900">请求试用应用</h2>
        <p className="mt-2 text-sm text-slate-600">应用名称：{appName}</p>

        <label className="mt-5 block text-sm font-medium text-slate-700">请求理由 *</label>
        <textarea
          value={requestReason}
          onChange={(event) => setRequestReason(event.target.value)}
          rows={5}
          placeholder="请说明该应用如何提升团队效率或解决当前问题"
          className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm outline-none ring-brand-500 transition focus:ring"
        />

        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            取消
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "提交中..." : "提交请求"}
          </button>
        </div>
      </div>
    </div>
  );
}
