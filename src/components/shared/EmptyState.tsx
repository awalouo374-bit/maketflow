import { IconType } from "react-icons";

type Props = {
  icon: IconType;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
      <div className="flex justify-center mb-4 opacity-40">
        <Icon size={64} color="#94a3b8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 mb-6">{description}</p>
      {action}
    </div>
  );
}
