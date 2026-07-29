import { IconType } from "react-icons";

type StatusEntry = { label: string; bg: string; color: string; icon: IconType };

type Props = { config: StatusEntry; size?: number };

export default function StatusBadge({ config, size = 14 }: Props) {
  const Icon = config.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
      style={{ background: config.bg, color: config.color }}
    >
      <Icon size={size} />
      {config.label}
    </span>
  );
}
