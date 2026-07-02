import Image from "next/image";
import { Container } from "./primitives";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-soft text-cream/70">
      <Container className="py-14">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-3">
            <Image
              src="/georgo-logo.png"
              alt="Georgo Academy"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg object-contain"
            />
            <span className="text-base font-semibold text-cream">
              Georgo Academy
            </span>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-cream/60">
            Georgo Academy CELPIP Speaking Practice is a practice tool only. It
            is not affiliated with CELPIP and does not provide official CELPIP
            scores.
          </p>
          <p className="text-xs text-cream/40">
            {year} Georgo Academy. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
