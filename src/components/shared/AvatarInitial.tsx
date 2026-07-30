type Props = { name: string; size?: "sm" | "md" };

const sizes = { sm: "w-7 h-7 text-xs", md: "w-8 h-8 text-sm" };

export default function AvatarInitial({ name, size = "md" }: Props) {
  return (
    <div className={`avatar-initial ${sizes[size]}`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
