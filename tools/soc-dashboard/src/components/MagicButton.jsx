import { cn } from "../lib/utils";

export function MagicButton({
  children,
  className,
  onClick,
  disabled,
  icon,
}) {
  // 📘 Para que entiendas: Un botón interactivo (MagicButton) usa animaciones
  // sutiles y un anillo destellante alrededor para dar feedback enriquecido
  // al usuario, muy usado en Hero sections.
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-10 overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl gap-2">
        {icon}
        {children}
      </span>
    </button>
  );
}
