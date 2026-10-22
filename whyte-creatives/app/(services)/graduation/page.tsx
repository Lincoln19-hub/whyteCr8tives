import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePage, { serviceMetadata } from "@/components/ServicePage";
import { serviceBySlug } from "@/data/services";

/** "graduation" — one of the seven "Services & Ratecards" pages.
 *  They all render the same template; only the copy differs. */
const service = serviceBySlug("graduation");

export const metadata: Metadata = service
  ? serviceMetadata(service)
  : { title: "Service not found" };

export default function Page() {
  if (!service) notFound();
  return <ServicePage service={service} />;
}
