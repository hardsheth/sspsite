"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} showCloseButton={false} className="max-w-md p-6">
      <div className="text-center">
        <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">{title}</h4>
        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">{description}</p>

        <div className="flex items-center justify-center w-full gap-3 mt-6">
          <button
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
