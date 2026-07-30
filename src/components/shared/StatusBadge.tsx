import { IconType } from "react-icons";

type StatusEntry = { label: string; bg: string; color: string; icon: IconType };
type Props = { config: StatusEntry; size?: number };

export default function StatusBadge({ config, size = 12 }: Props) {
  const Icon = config.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap"
      style={{ background: config.bg, color: config.color }}>
      <Icon size={size} />
      {config.label}
    </span>
  );
}
