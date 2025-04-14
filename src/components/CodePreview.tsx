// src/components/CodePreview.tsx
"use client";
import { useState } from "react";
import { DroppedItem } from "../types";
import { generateComponentCode } from "../utils/generateComponentCode";

type CodePreviewProps = {
  items: DroppedItem[];
};

export default function CodePreview({ items }: CodePreviewProps) {
  const [code, setCode] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleGenerateCode = () => {
    const generated = generateComponentCode(items);
    setCode(generated);
    setIsOpen(true);
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white border rounded p-4 shadow-lg z-50">
      {/* Close Button */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-1 right-1 bg-white text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      )}

      <button
        onClick={handleGenerateCode}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        Generate Code
      </button>
      {isOpen && code && (
        <textarea
          readOnly
          value={code}
          className="mt-4 w-full h-64 border rounded p-2 text-xs text-black font-mono"
        />
      )}
    </div>
  );
}
