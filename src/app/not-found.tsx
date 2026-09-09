import Link from "next/link";
import { PrettyUrlRedirect } from "@/components/layout/PrettyUrlRedirect";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <PrettyUrlRedirect />
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Ez az oldal nem található</h1>
      <p className="mt-3 max-w-md text-muted">
        Lehet, hogy a link elírás, vagy a termék már nem elérhető. Ha egy megosztott designra kattintottál, egy pillanat és átirányítunk.
      </p>
      <Link href="/" className="mt-8 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground">
        Vissza a kezdőlapra
      </Link>
    </main>
  );
}
