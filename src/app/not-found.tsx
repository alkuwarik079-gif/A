import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[80svh] place-items-center px-4 pt-[var(--nav-h)] text-center">
      <div>
        <p className="font-display text-[10rem] font-black leading-none text-emerald-deep">؟</p>
        <h1 className="font-display text-4xl font-black">الصفحة غير موجودة</h1>
        <Link href="/" className="mt-8 inline-block rounded-full bg-lime px-8 py-3 font-display font-black text-ink">العودة إلى الرئيسة</Link>
      </div>
    </div>
  );
}
