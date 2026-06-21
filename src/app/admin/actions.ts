"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function checkAuth() {
  const session = await auth();
  if (!session) redirect("/login");
}

// ─── SiteConfig ───────────────────────────────────────────────

export async function updateSiteConfig(data: {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  logoUrl?: string;
  synopsis?: string;
  videoUrl?: string;
  whyImportant?: string;
  pdfUrl?: string;
  targetAmount?: number;
  contactWhatsapp?: string;
  contactInstagram?: string;
  contactEmail?: string;
  qrisString?: string;
  qrisActive?: boolean;
  qrisMinAmount?: number;
}) {
  await checkAuth();
  await db.siteConfig.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

// ─── Slideshow ────────────────────────────────────────────────

export async function createSlideImage(data: { imageUrl: string; caption?: string; sortOrder?: number }) {
  await checkAuth();
  await db.slideImage.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/slideshow");
}

export async function updateSlideImage(id: number, data: { caption?: string; sortOrder?: number; active?: boolean }) {
  await checkAuth();
  await db.slideImage.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/slideshow");
}

export async function deleteSlideImage(id: number) {
  await checkAuth();
  await db.slideImage.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/slideshow");
}

// ─── Donations ────────────────────────────────────────────────

export async function createDonation(data: {
  name: string;
  amount: number;
  message?: string;
  isPublic?: boolean;
  showAmount?: boolean;
  isAnonymous?: boolean;
  donatedAt?: Date;
}) {
  await checkAuth();
  await db.donation.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/donations");
}

export async function updateDonation(id: number, data: {
  name?: string;
  amount?: number;
  message?: string;
  isPublic?: boolean;
  showAmount?: boolean;
  isAnonymous?: boolean;
  donatedAt?: Date;
}) {
  await checkAuth();
  await db.donation.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/donations");
}

export async function deleteDonation(id: number) {
  await checkAuth();
  await db.donation.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/donations");
}

// ─── Sponsors ─────────────────────────────────────────────────

export async function createSponsor(data: { name: string; logoUrl: string; website?: string; sortOrder?: number }) {
  await checkAuth();
  await db.sponsor.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/sponsors");
}

export async function updateSponsor(id: number, data: { name?: string; logoUrl?: string; website?: string; sortOrder?: number; active?: boolean }) {
  await checkAuth();
  await db.sponsor.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/sponsors");
}

export async function deleteSponsor(id: number) {
  await checkAuth();
  await db.sponsor.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/sponsors");
}

// ─── Packages ─────────────────────────────────────────────────

export async function createPackage(data: { name: string; amount: number; description: string; benefits: string; sortOrder?: number }) {
  await checkAuth();
  await db.supportPackage.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/packages");
}

export async function updatePackage(id: number, data: { name?: string; amount?: number; description?: string; benefits?: string; sortOrder?: number; active?: boolean }) {
  await checkAuth();
  await db.supportPackage.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/packages");
}

export async function deletePackage(id: number) {
  await checkAuth();
  await db.supportPackage.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/packages");
}

// ─── Team ─────────────────────────────────────────────────────

export async function createTeamMember(data: { name: string; role: string; imageUrl?: string; sortOrder?: number }) {
  await checkAuth();
  await db.productionTeam.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/team");
}

export async function updateTeamMember(id: number, data: { name?: string; role?: string; imageUrl?: string; sortOrder?: number }) {
  await checkAuth();
  await db.productionTeam.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/team");
}

export async function deleteTeamMember(id: number) {
  await checkAuth();
  await db.productionTeam.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/team");
}
