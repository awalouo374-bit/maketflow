"use client";
import { useEffect } from "react";
import { MdClose } from "react-icons/md";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
};

const widths = { sm: "sm:max-w-md", md: "sm:max-w-lg", lg: "sm:max-w-2xl" };

export default function Modal({ open, onClose, title, size = "md", children }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/35 backdrop-blur-[2px] p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`modal-sheet w-full ${widths[size]}`}>
        <div className="flex items-center justify-between px-7 py-6">
          <h2 className="font-bold text-[1.1rem] text-slate-900 m-0 tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-blue-400 hover:text-blue-600 border-none bg-transparent cursor-pointer p-1 flex items-center justify-center rounded-full hover:bg-blue-50 transition-colors"
          >
            <MdClose size={22} />
          </button>
        </div>
        <div className="overflow-y-auto modal-scroll">
          {children}
        </div>
      </div>
    </div>
  );
}
