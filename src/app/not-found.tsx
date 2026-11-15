import Link from "next/link";
import { btn } from "@/components/ui/styles";

export default function NotFound() {
  return (
    <main id="icerik" className="bg-blueprint flex min-h-[80svh] items-center bg-paper pt-24">
      <div className="container-x">
        <p className="eyebrow text-copper">Hata 404</p>
        <h1 className="font-display mt-4 text-[clamp(3rem,10vw,8rem)]">Sayfa bulunamadı</h1>
        <p className="mt-4 max-w-md text-steel-ink">Aradığınız sayfa taşınmış veya kaldırılmış olabilir.</p>
        <Link href="/" className={`${btn.copper} mt-8`}>
          Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
