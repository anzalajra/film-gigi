-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN     "directorImageUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "directorName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "directorQuote" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "producerImageUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "producerName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "producerQuote" TEXT NOT NULL DEFAULT '';
