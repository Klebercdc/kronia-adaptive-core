import logo from "@/assets/kronia-logo.png";

type Props = {
  size?: number;
  showWordmark?: boolean;
  className?: string;
};

export function BrandMark({ size = 28, showWordmark = true, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
      >
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-70"
          style={{ background: "var(--glow)" }}
        />
        <img
          src={logo}
          alt="Kronia"
          width={size}
          height={size}
          className="relative drop-shadow-[0_0_8px_color-mix(in_oklch,var(--glow)_60%,transparent)]"
          style={{ width: size, height: size, objectFit: "contain" }}
        />
      </div>
      {showWordmark && (
        <span
          className="font-semibold tracking-[0.32em] text-foreground/90"
          style={{ fontSize: Math.round(size * 0.46) }}
        >
          KRONIA
        </span>
      )}
    </div>
  );
}
