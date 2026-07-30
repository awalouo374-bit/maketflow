import { MdWarning } from "react-icons/md";

type Props = { message: string };

export default function ErrorAlert({ message }: Props) {
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded px-4 py-3">
      <MdWarning size={16} className="text-red-500 shrink-0" />
      <span className="text-red-500 text-sm font-medium">{message}</span>
    </div>
  );
}
