import { IconType } from "react-icons";

type Props = { icon: IconType; title: string; description: string; action?: React.ReactNode };

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-lg bg-[#f5f5f5] flex items-center justify-center mb-5">
        <Icon size={32} className="text-slate-300" />
      </div>
      <h2 className="font-semibold text-slate-800 text-base mb-2">{title}</h2>
      <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-6">{description}</p>
      {action}
    </div>
  );
}
