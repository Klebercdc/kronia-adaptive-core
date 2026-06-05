import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/kronia-logo.png";
import heroImg from "@/assets/welcome-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KRONIA — O coach que nunca dorme" },
      {
        name: "description",
        content:
          "KRONIA é o coach adaptativo que calibra seu treino, nutrição e recuperação em tempo real.",
      },
      { property: "og:title", content: "KRONIA — O coach que nunca dorme" },
      {
        property: "og:description",
        content: "Treino, nutrição e recuperação adaptados ao seu corpo, todos os dias.",
      },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  return (
    <main
      className="relative min-h-screen w-full overflow-hidden bg-[color:var(--background)] text-foreground"
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div
          className="absolute left-1/2 top-[18%] h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-[120px] opacity-60"
          style={{ background: "radial-gradient(circle, var(--glow) 0%, transparent 70%)" }}
        />
        <div
          className="absolute left-1/2 bottom-0 h-[260px] w-[640px] -translate-x-1/2 blur-[90px] opacity-40"
          style={{ background: "radial-gradient(ellipse, var(--glow) 0%, transparent 70%)" }}
        />
      </div>

      {/* Faint grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col px-6">
        {/* Logo + Wordmark */}
        <div className="flex flex-col items-center pt-12 animate-float-in">
          <div className="relative">
            <div
              className="absolute inset-0 -m-6 rounded-full blur-2xl opacity-80 animate-pulse-soft"
              style={{ background: "var(--glow)" }}
            />
            <img
              src={logo}
              alt="KRONIA"
              width={104}
              height={104}
              className="relative drop-shadow-[0_0_24px_color-mix(in_oklch,var(--glow)_70%,transparent)]"
              style={{ width: 104, height: 104, objectFit: "contain" }}
            />
          </div>

          <h1 className="mt-5 text-[34px] font-semibold tracking-[0.34em] text-foreground/95">
            KRONIA
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <span
              className="h-px w-10"
              style={{
                background:
                  "linear-gradient(90deg, transparent, color-mix(in oklch, var(--glow) 70%, transparent))",
              }}
            />
            <span className="text-[12px] tracking-[0.22em] text-[color:var(--glow)]">
              O coach que nunca dorme
            </span>
            <span
              className="h-px w-10"
              style={{
                background:
                  "linear-gradient(90deg, color-mix(in oklch, var(--glow) 70%, transparent), transparent)",
              }}
            />
          </div>
        </div>

        {/* Hero image */}
        <div className="relative mt-6 flex-1 flex items-center justify-center animate-float-in">
          <div className="relative w-full max-w-[360px] aspect-square">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 45%, transparent 35%, var(--background) 78%)",
              }}
            />
            <img
              src={heroImg}
              alt="Atleta com energia fluindo pela coluna"
              width={720}
              height={720}
              className="h-full w-full object-contain"
              style={{
                maskImage:
                  "radial-gradient(ellipse at 50% 50%, black 55%, transparent 85%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at 50% 50%, black 55%, transparent 85%)",
              }}
            />
          </div>
        </div>

        {/* CTAs */}
        <div className="pb-8 pt-4 space-y-3 animate-float-in">
          <Link
            to="/hoje"
            className="relative block w-full overflow-hidden rounded-2xl py-4 text-center text-[15px] font-medium text-[oklch(0.14_0.015_255)] transition-transform active:scale-[0.99]"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.78 0.14 230), oklch(0.68 0.16 270))",
              boxShadow:
                "0 10px 32px -10px color-mix(in oklch, var(--glow) 60%, transparent), inset 0 1px 0 oklch(1 0 0 / 0.25)",
            }}
          >
            Criar conta
          </Link>

          <Link
            to="/hoje"
            className="block w-full rounded-2xl border border-[color:var(--border)] py-4 text-center text-[14px] font-medium text-foreground/90 glass transition-transform active:scale-[0.99]"
          >
            Já tenho conta
          </Link>

          <p className="pt-1 text-center text-[11px] tracking-wide text-muted-foreground">
            Free <span className="opacity-50">·</span> Pro R$29,90{" "}
            <span className="opacity-50">·</span> Ultra R$59,90
          </p>
        </div>
      </div>
    </main>
  );
}
