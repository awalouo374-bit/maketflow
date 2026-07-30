"use client";
import Modal from "./Modal";
import { MdDeleteForever, MdWarningAmber } from "react-icons/md";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
};

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Supprimer", loading }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="modal-body">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <MdWarningAmber size={22} className="text-red-500" />
          </div>
          <p className="text-sm text-slate-500 leading-relaxed pt-1">{message}</p>
        </div>
      </div>
      <div className="modal-footer">
        <button onClick={onClose} disabled={loading} className="modal-btn-cancel">Annuler</button>
        <button onClick={onConfirm} disabled={loading} className="modal-btn-danger">
          {loading
            ? <><span className="spinner-sm" /> Suppression...</>
            : <><MdDeleteForever size={17} /> {confirmLabel}</>
          }
        </button>
      </div>
    </Modal>
  );
}
