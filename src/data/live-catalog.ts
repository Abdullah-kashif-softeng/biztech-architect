import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
  Laptop, Server, Router, Camera, Printer, Keyboard, AppWindow, Box,
  Video, Network, Wrench, Building2, Cpu, HardDrive, Monitor, Shield,
  Wifi, Cloud, Database, Smartphone, Headphones, Package, Layers,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import laptopsImg from "@/assets/products/laptops-desktops.jpg";
import serversImg from "@/assets/products/servers.jpg";
import networkingImg from "@/assets/products/networking.jpg";
import camerasImg from "@/assets/products/cameras.jpg";
import printersImg from "@/assets/products/printers.jpg";
import accessoriesImg from "@/assets/products/accessories.jpg";
import softwareImg from "@/assets/products/software.jpg";

import cctvSvc from "@/assets/services/cctv.jpg";
import netSvc from "@/assets/services/networking.jpg";
import supportSvc from "@/assets/services/it-support.jpg";
import supplySvc from "@/assets/services/corporate-supply.jpg";

/* ---------- shared types (same field names the components already use) ---------- */

export type FeaturedItem = {
  name: string;
  brand: string;
  highlight: string;
  specs: string[];
  price?: string;
  priceNote?: string;
  billingPeriod?: string | null;
  minMonths?: number | null;
  maxMonths?: number | null;
  inStock?: boolean;
  image?: string | null;
};

export type ProductCategory = {
  slug: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  image: string;
  tagline: string;
  intro: string;
  brands: string[];
  useCases: string[];
  featured: FeaturedItem[];
};

export type ServiceDetail = {
  slug: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  image: string;
  tagline: string;
  intro: string;
  included: string[];
  process: { step: string; title: string; desc: string }[];
  industries: string[];
};

/* ---------- helpers ---------- */

const ICONS: Record<string, LucideIcon> = {
  Laptop, Server, Router, Camera, Printer, Keyboard, AppWindow, Box,
  Video, Network, Wrench, Building2, Cpu, HardDrive, Monitor, Shield,
  Wifi, Cloud, Database, Smartphone, Headphones, Package, Layers,
};

const CATEGORY_IMAGES: Record<string, string> = {
  "laptops-desktops": laptopsImg,
  servers: serversImg,
  networking: networkingImg,
  cameras: camerasImg,
  printers: printersImg,
  accessories: accessoriesImg,
  software: softwareImg,
};

const SERVICE_IMAGES: Record<string, string> = {
  cctv: cctvSvc,
  networking: netSvc,
  "it-support": supportSvc,
  "corporate-supply": supplySvc,
};

const icon = (name: string | null | undefined, fallback: LucideIcon) =>
  (name && ICONS[name]) || fallback;

const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

/* ---------- fetchers ---------- */

async function fetchCategories(): Promise<ProductCategory[]> {
  const [cats, prods] = await Promise.all([
    supabase.from("product_categories").select("*").order("sort_order"),
    supabase.from("products").select("*").order("sort_order").order("name"),
  ]);
  if (cats.error) throw cats.error;
  if (prods.error) throw prods.error;

  const byCat = new Map<string, FeaturedItem[]>();
  for (const p of prods.data ?? []) {
    const list = byCat.get(p.category_slug) ?? [];
    list.push({
      name: p.name,
      brand: str(p.brand),
      highlight: str(p.highlight) || str(p.description),
      specs: arr(p.specs),
      price: p.price ?? undefined,
      priceNote: p.price_note ?? undefined,
      billingPeriod: p.billing_period,
      minMonths: p.min_months,
      maxMonths: p.max_months,
      inStock: p.in_stock,
      image: p.image_url,
    });
    byCat.set(p.category_slug, list);
  }

  return (cats.data ?? []).map((c) => ({
    slug: c.slug,
    name: c.name,
    shortName: str(c.short_name) || c.name,
    icon: icon(c.icon, Box),
    image: (c.image_url && c.image_url.trim()) || CATEGORY_IMAGES[c.slug] || laptopsImg,
    tagline: str(c.tagline),
    intro: str(c.intro),
    brands: arr(c.brands),
    useCases: arr(c.use_cases),
    featured: byCat.get(c.slug) ?? [],
  }));
}

async function fetchServices(): Promise<ServiceDetail[]> {
  const { data, error } = await supabase.from("services").select("*").order("sort_order");
  if (error) throw error;

  return (data ?? []).map((s) => ({
    slug: s.slug,
    name: s.name,
    shortName: str(s.short_name) || s.name,
    icon: icon(s.icon, Wrench),
    image: (s.image_url && s.image_url.trim()) || SERVICE_IMAGES[s.slug] || supportSvc,
    tagline: str(s.tagline),
    intro: str(s.intro),
    included: arr(s.included),
    process: Array.isArray(s.process)
      ? (s.process as unknown[]).map((p) => {
          const o = (p ?? {}) as Record<string, unknown>;
          return { step: str(o.step), title: str(o.title), desc: str(o.desc) };
        })
      : [],
    industries: arr(s.industries),
  }));
}

/* ---------- hooks ---------- */

export function useCategories() {
  return useQuery({ queryKey: ["public", "product_categories"], queryFn: fetchCategories, staleTime: 30_000 });
}

export function useServices() {
  return useQuery({ queryKey: ["public", "services"], queryFn: fetchServices, staleTime: 30_000 });
}

export function useCategory(slug: string) {
  const q = useCategories();
  return { ...q, category: q.data?.find((c) => c.slug === slug) };
}

export function useService(slug: string) {
  const q = useServices();
  return { ...q, service: q.data?.find((s) => s.slug === slug) };
}

export const FALLBACK_CATEGORY_IMAGE = laptopsImg;
export const FALLBACK_SERVICE_IMAGE = cctvSvc;
