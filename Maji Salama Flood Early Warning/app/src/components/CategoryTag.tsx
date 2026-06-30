interface CategoryTagProps {
  variant: 'lime' | 'amber' | 'red' | 'cyan' | 'green';
  children: React.ReactNode;
}

const variants = {
  lime: 'bg-[rgba(230,255,43,0.15)] text-ms-lime',
  amber: 'bg-[rgba(255,159,43,0.15)] text-ms-amber',
  red: 'bg-[rgba(255,43,43,0.15)] text-ms-red',
  cyan: 'bg-[rgba(0,229,255,0.15)] text-ms-cyan',
  green: 'bg-[rgba(196,255,0,0.15)] text-ms-green',
};

export function CategoryTag({ variant, children }: CategoryTagProps) {
  return (
    <span
      className={`inline-block font-mono text-label-sm uppercase px-3 py-1.5 rounded-md ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
