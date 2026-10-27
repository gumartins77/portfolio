import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <h1 className="section-title">
        PÁGINA NÃO <span>ENCONTRADA.</span>
      </h1>
      <Link href="/" className="btn-primary">
        Voltar ao início
      </Link>
    </main>
  );
}
