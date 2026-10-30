import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UnitView from "@/components/UnitView";
import { getUnit, units } from "@/lib/content";

export function generateStaticParams() {
  return units.map((u) => ({ unit: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ unit: string }> }): Promise<Metadata> {
  const { unit } = await params;
  const u = getUnit(unit);
  return { title: u ? `${u.title} — للغة العربية` : "للغة العربية" };
}

export default async function UnitPage({ params }: { params: Promise<{ unit: string }> }) {
  const { unit } = await params;
  if (!getUnit(unit)) notFound();
  return <UnitView slug={unit} />;
}
