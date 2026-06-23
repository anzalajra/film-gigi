-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN     "heroEyebrow" TEXT NOT NULL DEFAULT 'Crowdfunding · Final Project',
ADD COLUMN     "videoThumb" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "whyPoints" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "parallaxImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "parallaxQuote" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "parallaxAttr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "donateParallax" TEXT NOT NULL DEFAULT '';
