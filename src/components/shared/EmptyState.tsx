import { IconType } from "react-icons";

type Props = {
  icon: IconType;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
        <Icon size={36} className="text-slate-300" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-7">{description}</p>
      {action}
    </div>
  );
}
