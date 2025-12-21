import { Metadata } from "next";
import { HomeClient } from "@/components/marketing/HomeClient";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";

export const metadata: Metadata = {
  title: "TechSolutionsUtrecht | Web Design, Software & Hardware Utrecht",
  description: "Expert web design, software ontwikkeling en hardware reparaties in Utrecht. Uw partner voor digitale groei en technische ondersteuning op locatie.",
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <>
      <OrganizationSchema />
      <HomeClient />
    </>
  );
}
