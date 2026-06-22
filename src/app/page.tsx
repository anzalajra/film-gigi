import { db } from "@/lib/db";
import Navbar from "@/components/storefront/Navbar";
import HeroSection from "@/components/storefront/HeroSection";
import SynopsisSection from "@/components/storefront/SynopsisSection";
import VideoSection from "@/components/storefront/VideoSection";
import StatementSection from "@/components/storefront/StatementSection";
import SlideshowSection from "@/components/storefront/SlideshowSection";
import QrisSection from "@/components/storefront/QrisSection";
import WhyImportantSection from "@/components/storefront/WhyImportantSection";
import ProductionTeamSection from "@/components/storefront/ProductionTeamSection";
import PdfLinkSection from "@/components/storefront/PdfLinkSection";
import ProgressSection from "@/components/storefront/ProgressSection";
import PackagesSection from "@/components/storefront/PackagesSection";
import DonorsSection from "@/components/storefront/DonorsSection";
import SponsorsSection from "@/components/storefront/SponsorsSection";
import ContactSection from "@/components/storefront/ContactSection";

export const dynamic = "force-dynamic";

async function getData() {
  const [config, slides, team, packages, sponsors, donations] = await Promise.all([
    db.siteConfig.findUnique({ where: { id: 1 } }),
    db.slideImage.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    db.productionTeam.findMany({ orderBy: { sortOrder: "asc" } }),
    db.supportPackage.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    db.sponsor.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    db.donation.findMany({
      where: { isPublic: true },
      orderBy: { donatedAt: "desc" },
    }),
  ]);

  const totalRaised = await db.donation.aggregate({ _sum: { amount: true } });

  return { config, slides, team, packages, sponsors, donations, totalRaised: totalRaised._sum.amount ?? 0 };
}

export default async function StorefrontPage() {
  const { config, slides, team, packages, sponsors, donations, totalRaised } = await getData();

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/50">
        Sedang dalam persiapan...
      </div>
    );
  }

  return (
    <main className="bg-[#0a0a0a]">
      <Navbar logoUrl={config.logoUrl} />

      <HeroSection
        title={config.heroTitle}
        subtitle={config.heroSubtitle}
        heroImageUrl={config.heroImageUrl}
      />

      <SynopsisSection content={config.synopsis} />

      <VideoSection videoUrl={config.videoUrl} />

      <StatementSection
        sectionId="producer"
        label="Producer Statement"
        name={config.producerName}
        imageUrl={config.producerImageUrl}
        quote={config.producerQuote}
      />

      <StatementSection
        sectionId="director"
        label="Director Statement"
        name={config.directorName}
        imageUrl={config.directorImageUrl}
        quote={config.directorQuote}
        reverse
        dark
      />

      <SlideshowSection images={slides} />

      <WhyImportantSection content={config.whyImportant} />

      <ProductionTeamSection team={team} />

      <PdfLinkSection pdfUrl={config.pdfUrl} />

      {config.qrisActive && config.qrisString && (
        <QrisSection
          qrisString={config.qrisString}
          minAmount={config.qrisMinAmount}
          sectionId="donasi"
        />
      )}

      <ProgressSection totalRaised={totalRaised} target={config.targetAmount} />

      <PackagesSection packages={packages} qrisString={config.qrisActive ? config.qrisString : undefined} />

      <DonorsSection donors={donations} />

      <SponsorsSection sponsors={sponsors} />

      <ContactSection
        whatsapp={config.contactWhatsapp}
        instagram={config.contactInstagram}
        email={config.contactEmail}
      />

      <footer className="py-8 text-center text-white/20 text-xs border-t border-white/5">
        © {new Date().getFullYear()} Film Gigi. Dibuat dengan ❤
      </footer>
    </main>
  );
}
