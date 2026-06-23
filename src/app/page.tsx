import { db } from "@/lib/db";
import Navbar from "@/components/storefront/Navbar";
import { StorefrontReveal } from "@/components/storefront/ds";
import HeroSection from "@/components/storefront/HeroSection";
import SynopsisSection from "@/components/storefront/SynopsisSection";
import VideoSection from "@/components/storefront/VideoSection";
import StatementSection from "@/components/storefront/StatementSection";
import ParallaxQuoteSection from "@/components/storefront/ParallaxQuoteSection";
import SlideshowSection from "@/components/storefront/SlideshowSection";
import WhyImportantSection from "@/components/storefront/WhyImportantSection";
import ProductionTeamSection from "@/components/storefront/ProductionTeamSection";
import PdfLinkSection from "@/components/storefront/PdfLinkSection";
import PackagesSection from "@/components/storefront/PackagesSection";
import QrisSection from "@/components/storefront/QrisSection";
import DonorsSection from "@/components/storefront/DonorsSection";
import SponsorsSection from "@/components/storefront/SponsorsSection";
import ContactSection from "@/components/storefront/ContactSection";

export const dynamic = "force-dynamic";

interface WhyPoint {
  icon?: string;
  title: string;
  text: string;
}

function parseWhyPoints(raw: string): WhyPoint[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((p) => p && typeof p.title === "string" && typeof p.text === "string");
    }
  } catch {}
  return [];
}

async function getData() {
  const [config, slides, team, packages, sponsors, donations] = await Promise.all([
    db.siteConfig.findUnique({ where: { id: 1 } }),
    db.slideImage.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    db.productionTeam.findMany({ orderBy: { sortOrder: "asc" } }),
    db.supportPackage.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    db.sponsor.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    db.donation.findMany({ where: { isPublic: true }, orderBy: { donatedAt: "desc" } }),
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

  const whyPoints = parseWhyPoints(config.whyPoints);

  return (
    <main className="fg">
      <StorefrontReveal />
      <Navbar logoUrl={config.logoUrl} />

      <HeroSection
        eyebrow={config.heroEyebrow}
        title={config.heroTitle}
        subtitle={config.heroSubtitle}
        heroImageUrl={config.heroImageUrl}
        logoUrl={config.logoUrl}
      />

      <SynopsisSection content={config.synopsis} />

      <VideoSection videoUrl={config.videoUrl} thumb={config.videoThumb} />

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

      {(config.parallaxImage || config.parallaxQuote) && (
        <ParallaxQuoteSection
          image={config.parallaxImage}
          quote={config.parallaxQuote}
          attribution={config.parallaxAttr}
        />
      )}

      <SlideshowSection images={slides} />

      <WhyImportantSection content={config.whyImportant} points={whyPoints} />

      <ProductionTeamSection team={team} />

      <PdfLinkSection pdfUrl={config.pdfUrl} />

      <PackagesSection
        packages={packages}
        qrisString={config.qrisActive ? config.qrisString : undefined}
        totalRaised={totalRaised}
        target={config.targetAmount}
        parallax={config.donateParallax}
      />

      {config.qrisActive && config.qrisString && (
        <QrisSection qrisString={config.qrisString} minAmount={config.qrisMinAmount} />
      )}

      <DonorsSection donors={donations} />

      <SponsorsSection sponsors={sponsors} />

      <ContactSection
        whatsapp={config.contactWhatsapp}
        instagram={config.contactInstagram}
        email={config.contactEmail}
      />

      <footer
        style={{
          padding: "var(--space-8) var(--gutter)",
          textAlign: "center",
          color: "var(--ink-20)",
          fontSize: "var(--text-xs)",
          borderTop: "1px solid var(--line-faint)",
        }}
      >
        © {new Date().getFullYear()} Film Gigi. Dibuat dengan <span style={{ color: "var(--gold)" }}>♥</span> oleh tim mahasiswa.
      </footer>
    </main>
  );
}
