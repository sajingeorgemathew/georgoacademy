import { Container } from "./primitives";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <Container className="py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-lg font-semibold text-white">
            Georgo Academy CELPIP Speaking Practice
          </p>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Practice tool only. Not affiliated with CELPIP and not an official
            score provider.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {year} Georgo Academy. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
