type Props = { label: string; children: React.ReactNode };

export default function FormField({ label, children }: Props) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
