import { useState, useEffect } from "react";
import { products as api, BackendProduct } from "../services/api";
import { allProducts, Product } from "../components/data/products";

// ── Stable ID: last 8 hex chars of ObjectId → 7-digit number ──────────────
function hashId(hex: string): number {
  return (parseInt(hex.slice(-8), 16) % 9_000_000) + 1_000_000;
}

/** Stable random splash image — same product always gets the same photo. */
function splashImage(productId: string): string {
  return `https://picsum.photos/seed/${productId}/600/800`;
}

// Maps numeric URL id → backend _id string so useProduct can call getOne
export const backendIdMap = new Map<number, string>();

export type AdaptedProduct = Product & {
  _id: string;
  comparePrice?: number;
  gender?: string;
  rating?: number;
  numReviews?: number;
  soldCount?: number;
  description?: string;
};

// ── Adapter ────────────────────────────────────────────────────────────────
export function adaptProduct(p: BackendProduct): AdaptedProduct {
  const id = hashId(p._id);
  backendIdMap.set(id, p._id);

  const firstImage = p.images?.find(img => img?.url?.trim());

  return {
    id,
    _id:          p._id,
    name:         p.name        || "Untitled Piece",
    designer:     p.designer    ?? "Annie Patricia",
    price:        p.price       || 0,
    comparePrice: p.comparePrice && p.comparePrice > p.price ? p.comparePrice : undefined,
    image:        firstImage?.url || splashImage(p._id),
    category:     p.category    || "",
    badge:        (p.badge ?? undefined) as Product["badge"],
    inStock:      p.inStock     ?? true,
    gender:       p.gender,
    rating:       p.rating,
    numReviews:   p.numReviews,
    soldCount:    p.soldCount,
    description:  p.description,
  };
}

// ── Params type (all backend-supported query fields) ───────────────────────
export interface ProductQueryParams {
  page?:       number | string;
  limit?:      number | string;
  category?:   string;           // exact backend category name
  gender?:     "WOMEN" | "MEN" | "UNISEX" | string;
  badge?:      "NEW" | "BESTSELLER" | "SALE" | string;
  sort?:       "price" | "createdAt" | "rating" | "soldCount" | "name";
  order?:      "asc" | "desc";
  minPrice?:   number | string;
  maxPrice?:   number | string;
  search?:     string;
  inStock?:    boolean | string;
  isFeatured?: boolean | string;
}

// ── Module-level cache (no-filter requests only) ───────────────────────────
let globalCache: AdaptedProduct[] | null = null;
let globalCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1_000;

// ── useProducts ────────────────────────────────────────────────────────────
export interface UseProductsResult {
  products:    AdaptedProduct[];
  loading:     boolean;
  total:       number;
  pages:       number;
  fromBackend: boolean;
}

export function useProducts(params?: ProductQueryParams): UseProductsResult {
  const isFiltered = !!(params && Object.keys(params).some(k => !["page", "limit"].includes(k)));

  // Start with cache or static for no-filter case, empty for filtered
  const [products, setProducts]       = useState<AdaptedProduct[]>(() =>
    (!isFiltered && globalCache) ? globalCache : (allProducts as unknown as AdaptedProduct[])
  );
  const [loading, setLoading]         = useState(true);
  const [total, setTotal]             = useState(0);
  const [pages, setPages]             = useState(1);
  const [fromBackend, setFromBackend] = useState(false);

  const paramsKey = JSON.stringify(params ?? {});

  useEffect(() => {
    // Serve cache for the plain no-filter call
    if (!isFiltered && globalCache && Date.now() - globalCacheTime < CACHE_TTL) {
      setProducts(globalCache);
      setTotal(globalCache.length);
      setPages(1);
      setFromBackend(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    // Build query string — convert all values to strings for URLSearchParams
    const query: Record<string, string> = {
      limit: String(params?.limit ?? (isFiltered ? "24" : "500")),
      page:  String(params?.page  ?? "1"),
    };
    if (params?.category)   query.category   = params.category;
    if (params?.gender)     query.gender     = params.gender;
    if (params?.badge)      query.badge      = params.badge;
    if (params?.sort)       query.sort       = params.sort;
    if (params?.order)      query.order      = params.order;
    if (params?.minPrice != null) query.minPrice = String(params.minPrice);
    if (params?.maxPrice != null) query.maxPrice = String(params.maxPrice);
    if (params?.search)     query.search     = params.search;
    if (params?.inStock != null)  query.inStock  = String(params.inStock);
    if (params?.isFeatured != null) query.isFeatured = String(params.isFeatured);

    api.getAll(query)
      .then(res => {
        if (cancelled) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        if (!list.length && !isFiltered) throw new Error("Empty response");

        const adapted = list.map(adaptProduct);

        if (!isFiltered) {
          globalCache     = adapted;
          globalCacheTime = Date.now();
        }

        const pagination = res?.pagination;
        setProducts(adapted);
        setTotal(pagination?.total ?? adapted.length);
        setPages(pagination?.pages ?? 1);
        setFromBackend(true);
      })
      .catch(err => {
        if (cancelled) return;
        console.warn("[useProducts] Falling back to static data:", err.message);
        const fallback = (allProducts as unknown as AdaptedProduct[]);
        setProducts(fallback);
        setTotal(fallback.length);
        setPages(1);
        setFromBackend(false);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  return { products, loading, total, pages, fromBackend };
}

// ── useProduct (single) ────────────────────────────────────────────────────
export function useProduct(id: string | number): {
  product: AdaptedProduct | null;
  loading: boolean;
} {
  const [product, setProduct] = useState<AdaptedProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const numId    = typeof id === "string" ? parseInt(id, 10) : id;
  const backendId = backendIdMap.get(numId);

  // Also try slug (if id looks like a string _id or slug)
  const lookupId  = backendId ?? String(id);

  useEffect(() => {
    if (!lookupId) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);

    api.getOne(lookupId)
      .then(res => {
        if (cancelled || !res?.data) return;
        setProduct(adaptProduct(res.data));
      })
      .catch(() => {
        if (cancelled) return;
        // Fall back to cache then static
        const fromCache = globalCache?.find(p => p.id === numId || p._id === String(id));
        const fromStatic = (allProducts as unknown as AdaptedProduct[]).find(p => p.id === numId);
        setProduct(fromCache ?? fromStatic ?? null);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookupId]);

  return { product, loading };
}
