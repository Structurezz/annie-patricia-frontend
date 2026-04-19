// src/data/products.ts
// Full African Fashion Product Catalog – 159 items, PLACEHOLD.CO IMAGES

export interface Product {
    id: number;
    name: string;
    designer: string;
    price: number; // in NGN
    image: string;
    category: string;
    badge?: "NEW" | "BESTSELLER" | "SALE";
    inStock: boolean;
  }
  
  // ──────────────────────────────────────
  // Helper: Generate placeholder image
  // ──────────────────────────────────────
  const generatePlaceholder = (name: string, category: string, id: number): string => {
    const cleanName = name
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .slice(0, 25)
      .replace(/\s+/g, "+");
  
    // Use Picsum for guaranteed random image
    const width = 600;
    const height = 800;
  
    // Random image based on id to make it reproducible
    const url = `https://picsum.photos/seed/${id}/${width}/${height}`;
  
    return url;
  };

  export const FLOATING_CATEGORIES = [
    { label: "NEW IN", value: "NEW", href: "/shop?category=NEW" },
    { label: "KIMONO SETS", value: "Kimono and pant sets", href: "/shop?category=Kimono+and+pant+sets" },
    { label: "ASO OKE", value: "Asoeke", href: "/shop?category=Asoeke" },
    { label: "DRESSES", value: "Dresses", href: "/shop?category=Dresses" },
    { label: "BAGS", value: "Bags", href: "/shop?category=Bags" },
  ] as const;
  
  // ──────────────────────────────────────
  // All 159 Products – FULL LIST
  // ──────────────────────────────────────
  export const allProducts: Product[] = [
    // ──────────────────────────────────────
    // Bubus (8)
    // ──────────────────────────────────────
    {
      id: 1,
      name: "Modern Bubus Style",
      designer: "Zara",
      price: 165877,
      image: generatePlaceholder("Modern Bubus Style", "Bubus", 1),
      category: "Bubus",
      badge: "SALE",
      inStock: true
    },
    {
      id: 2,
      name: "Contemporary Bubus Set",
      designer: "Viberg",
      price: 81369,
      image: generatePlaceholder("Contemporary Bubus Set", "Bubus", 2),
      category: "Bubus",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 3,
      name: "Luxury Bubus Design",
      designer: "Louis Vuitton",
      price: 92325,
      image: generatePlaceholder("Luxury Bubus Design", "Bubus", 3),
      category: "Bubus",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 4,
      name: "Vintage Bubus Style",
      designer: "Calvin Klein",
      price: 136147,
      image: generatePlaceholder("Vintage Bubus Style", "Bubus", 4),
      category: "Bubus",
      inStock: true
    },
    {
      id: 5,
      name: "Vintage Bubus Style",
      designer: "Roberto Cavalli",
      price: 152029,
      image: generatePlaceholder("Vintage Bubus Style", "Bubus", 5),
      category: "Bubus",
      badge: "SALE",
      inStock: true
    },
    {
      id: 6,
      name: "Modern Bubus Style",
      designer: "Lee",
      price: 91040,
      image: generatePlaceholder("Modern Bubus Style", "Bubus", 6),
      category: "Bubus",
      badge: "NEW",
      inStock: false
    },
    {
      id: 7,
      name: "Classic Bubus Set",
      designer: "Delvaux",
      price: 79370,
      image: generatePlaceholder("Classic Bubus Set", "Bubus", 7),
      category: "Bubus",
      inStock: true
    },
    {
      id: 8,
      name: "Vintage Bubus Piece",
      designer: "Yohji Yamamoto",
      price: 199547,
      image: generatePlaceholder("Vintage Bubus Piece", "Bubus", 8),
      category: "Bubus",
      badge: "SALE",
      inStock: true
    },
  
    // ──────────────────────────────────────
    // Kaftan (9)
    // ──────────────────────────────────────
    {
      id: 9,
      name: "Vintage Kaftan Piece",
      designer: "Burberry",
      price: 113832,
      image: generatePlaceholder("Vintage Kaftan Piece", "Kaftan", 9),
      category: "Kaftan",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 10,
      name: "Contemporary Kaftan Set",
      designer: "Barena",
      price: 94153,
      image: generatePlaceholder("Contemporary Kaftan Set", "Kaftan", 10),
      category: "Kaftan",
      inStock: true
    },
    {
      id: 11,
      name: "Elegant Kaftan Style",
      designer: "Anrealage",
      price: 97928,
      image: generatePlaceholder("Elegant Kaftan Style", "Kaftan", 11),
      category: "Kaftan",
      inStock: false
    },
    {
      id: 12,
      name: "Contemporary Kaftan Set",
      designer: "Loro Piana",
      price: 76787,
      image: generatePlaceholder("Contemporary Kaftan Set", "Kaftan", 12),
      category: "Kaftan",
      badge: "SALE",
      inStock: false
    },
    {
      id: 13,
      name: "Modern Kaftan Outfit",
      designer: "Tsumori Chisato",
      price: 145562,
      image: generatePlaceholder("Modern Kaftan Outfit", "Kaftan", 13),
      category: "Kaftan",
      inStock: true
    },
    {
      id: 14,
      name: "Classic Kaftan Outfit",
      designer: "Acne Studios",
      price: 108401,
      image: generatePlaceholder("Classic Kaftan Outfit", "Kaftan", 14),
      category: "Kaftan",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 15,
      name: "Vintage Kaftan Piece",
      designer: "Ann Taylor",
      price: 108618,
      image: generatePlaceholder("Vintage Kaftan Piece", "Kaftan", 15),
      category: "Kaftan",
      inStock: true
    },
    {
      id: 16,
      name: "Vintage Kaftan Outfit",
      designer: "Saint Laurent",
      price: 44678,
      image: generatePlaceholder("Vintage Kaftan Outfit", "Kaftan", 16),
      category: "Kaftan",
      badge: "SALE",
      inStock: true
    },
    {
      id: 17,
      name: "Elegant Kaftan Style",
      designer: "Adidas",
      price: 107962,
      image: generatePlaceholder("Elegant Kaftan Style", "Kaftan", 17),
      category: "Kaftan",
      badge: "BESTSELLER",
      inStock: false
    },
  
    // ──────────────────────────────────────
    // Two piece (8)
    // ──────────────────────────────────────
    {
      id: 18,
      name: "Luxury Two piece Piece",
      designer: "Viberg",
      price: 100933,
      image: generatePlaceholder("Luxury Two piece Piece", "Two piece", 18),
      category: "Two piece",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 19,
      name: "Contemporary Two piece Set",
      designer: "Hermès",
      price: 116295,
      image: generatePlaceholder("Contemporary Two piece Set", "Two piece", 19),
      category: "Two piece",
      inStock: true
    },
    {
      id: 20,
      name: "Elegant Two piece Style",
      designer: "Louis Vuitton",
      price: 199547,
      image: generatePlaceholder("Elegant Two piece Style", "Two piece", 20),
      category: "Two piece",
      inStock: true
    },
    {
      id: 21,
      name: "Vintage Two piece Piece",
      designer: "Gucci",
      price: 136147,
      image: generatePlaceholder("Vintage Two piece Piece", "Two piece", 21),
      category: "Two piece",
      badge: "SALE",
      inStock: true
    },
    {
      id: 22,
      name: "Modern Two piece Outfit",
      designer: "Prada",
      price: 152029,
      image: generatePlaceholder("Modern Two piece Outfit", "Two piece", 22),
      category: "Two piece",
      inStock: true
    },
    {
      id: 23,
      name: "Classic Two piece Set",
      designer: "Chanel",
      price: 91040,
      image: generatePlaceholder("Classic Two piece Set", "Two piece", 23),
      category: "Two piece",
      badge: "NEW",
      inStock: true
    },
    {
      id: 24,
      name: "Vintage Two piece Style",
      designer: "Dior",
      price: 79370,
      image: generatePlaceholder("Vintage Two piece Style", "Two piece", 24),
      category: "Two piece",
      inStock: false
    },
    {
      id: 25,
      name: "Luxury Two piece Design",
      designer: "Fendi",
      price: 199547,
      image: generatePlaceholder("Luxury Two piece Design", "Two piece", 25),
      category: "Two piece",
      badge: "SALE",
      inStock: true
    },
  
    // ──────────────────────────────────────
    // Pants (8)
    // ──────────────────────────────────────
    {
      id: 26,
      name: "Luxury Pants Outfit",
      designer: "Brioni",
      price: 47021,
      image: generatePlaceholder("Luxury Pants Outfit", "Pants", 26),
      category: "Pants",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 27,
      name: "Contemporary Pants Set",
      designer: "Loro Piana",
      price: 94153,
      image: generatePlaceholder("Contemporary Pants Set", "Pants", 27),
      category: "Pants",
      inStock: true
    },
    {
      id: 28,
      name: "Elegant Pants Style",
      designer: "Zegna",
      price: 97928,
      image: generatePlaceholder("Elegant Pants Style", "Pants", 28),
      category: "Pants",
      inStock: false
    },
    {
      id: 29,
      name: "Modern Pants Outfit",
      designer: "Tom Ford",
      price: 76787,
      image: generatePlaceholder("Modern Pants Outfit", "Pants", 29),
      category: "Pants",
      badge: "SALE",
      inStock: true
    },
    {
      id: 30,
      name: "Classic Pants Design",
      designer: "Canali",
      price: 145562,
      image: generatePlaceholder("Classic Pants Design", "Pants", 30),
      category: "Pants",
      inStock: true
    },
    {
      id: 31,
      name: "Vintage Pants Piece",
      designer: "Kiton",
      price: 108401,
      image: generatePlaceholder("Vintage Pants Piece", "Pants", 31),
      category: "Pants",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 32,
      name: "Luxury Pants Style",
      designer: "Cucinelli",
      price: 108618,
      image: generatePlaceholder("Luxury Pants Style", "Pants", 32),
      category: "Pants",
      inStock: true
    },
    {
      id: 33,
      name: "Contemporary Pants Outfit",
      designer: "Isaia",
      price: 44678,
      image: generatePlaceholder("Contemporary Pants Outfit", "Pants", 33),
      category: "Pants",
      badge: "SALE",
      inStock: true
    },
  
    // ──────────────────────────────────────
    // Skirts (7)
    // ──────────────────────────────────────
    {
      id: 34,
      name: "Vintage Skirts Outfit",
      designer: "Moncler",
      price: 61189,
      image: generatePlaceholder("Vintage Skirts Outfit", "Skirts", 34),
      category: "Skirts",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 35,
      name: "Luxury Skirts Piece",
      designer: "Max Mara",
      price: 116295,
      image: generatePlaceholder("Luxury Skirts Piece", "Skirts", 35),
      category: "Skirts",
      inStock: true
    },
    {
      id: 36,
      name: "Elegant Skirts Style",
      designer: "Valentino",
      price: 199547,
      image: generatePlaceholder("Elegant Skirts Style", "Skirts", 36),
      category: "Skirts",
      inStock: true
    },
    {
      id: 37,
      name: "Modern Skirts Design",
      designer: "Chloé",
      price: 136147,
      image: generatePlaceholder("Modern Skirts Design", "Skirts", 37),
      category: "Skirts",
      badge: "SALE",
      inStock: true
    },
    {
      id: 38,
      name: "Classic Skirts Set",
      designer: "Givenchy",
      price: 152029,
      image: generatePlaceholder("Classic Skirts Set", "Skirts", 38),
      category: "Skirts",
      inStock: true
    },
    {
      id: 39,
      name: "Contemporary Skirts Outfit",
      designer: "Balenciaga",
      price: 91040,
      image: generatePlaceholder("Contemporary Skirts Outfit", "Skirts", 39),
      category: "Skirts",
      badge: "NEW",
      inStock: true
    },
    {
      id: 40,
      name: "Vintage Skirts Piece",
      designer: "Saint Laurent",
      price: 79370,
      image: generatePlaceholder("Vintage Skirts Piece", "Skirts", 40),
      category: "Skirts",
      inStock: false
    },
  
    // ──────────────────────────────────────
    // Kimono and pant sets (8)
    // ──────────────────────────────────────
    {
      id: 41,
      name: "Elegant Kimono and pant sets Outfit",
      designer: "H&M",
      price: 82776,
      image: generatePlaceholder("Elegant Kimono and pant sets Outfit", "Kimono and pant sets", 41),
      category: "Kimono and pant sets",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 42,
      name: "Luxury Kimono and pant sets Piece",
      designer: "Uniqlo",
      price: 116295,
      image: generatePlaceholder("Luxury Kimono and pant sets Piece", "Kimono and pant sets", 42),
      category: "Kimono and pant sets",
      inStock: true
    },
    {
      id: 43,
      name: "Modern Kimono and pant sets Design",
      designer: "Zara",
      price: 199547,
      image: generatePlaceholder("Modern Kimono and pant sets Design", "Kimono and pant sets", 43),
      category: "Kimono and pant sets",
      inStock: true
    },
    {
      id: 44,
      name: "Vintage Kimono and pant sets Style",
      designer: "Mango",
      price: 136147,
      image: generatePlaceholder("Vintage Kimono and pant sets Style", "Kimono and pant sets", 44),
      category: "Kimono and pant sets",
      badge: "SALE",
      inStock: true
    },
    {
      id: 45,
      name: "Classic Kimono and pant sets Set",
      designer: "Gap",
      price: 152029,
      image: generatePlaceholder("Classic Kimono and pant sets Set", "Kimono and pant sets", 45),
      category: "Kimono and pant sets",
      inStock: true
    },
    {
      id: 46,
      name: "Contemporary Kimono and pant sets Outfit",
      designer: "ASOS",
      price: 91040,
      image: generatePlaceholder("Contemporary Kimono and pant sets Outfit", "Kimono and pant sets", 46),
      category: "Kimono and pant sets",
      badge: "NEW",
      inStock: true
    },
    {
      id: 47,
      name: "Elegant Kimono and pant sets Piece",
      designer: "Boohoo",
      price: 79370,
      image: generatePlaceholder("Elegant Kimono and pant sets Piece", "Kimono and pant sets", 47),
      category: "Kimono and pant sets",
      inStock: false
    },
    {
      id: 48,
      name: "Luxury Kimono and pant sets Design",
      designer: "Shein",
      price: 199547,
      image: generatePlaceholder("Luxury Kimono and pant sets Design", "Kimono and pant sets", 48),
      category: "Kimono and pant sets",
      badge: "SALE",
      inStock: true
    },
  
    // ──────────────────────────────────────
    // Kimono (9)
    // ──────────────────────────────────────
    {
      id: 49,
      name: "Elegant Kimono Piece",
      designer: "Missoni",
      price: 59744,
      image: generatePlaceholder("Elegant Kimono Piece", "Kimono", 49),
      category: "Kimono",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 50,
      name: "Luxury Kimono Outfit",
      designer: "Etro",
      price: 116295,
      image: generatePlaceholder("Luxury Kimono Outfit", "Kimono", 50),
      category: "Kimono",
      inStock: true
    },
    {
      id: 51,
      name: "Modern Kimono Design",
      designer: "Kenzo",
      price: 199547,
      image: generatePlaceholder("Modern Kimono Design", "Kimono", 51),
      category: "Kimono",
      inStock: true
    },
    {
      id: 52,
      name: "Vintage Kimono Style",
      designer: "Issey Miyake",
      price: 136147,
      image: generatePlaceholder("Vintage Kimono Style", "Kimono", 52),
      category: "Kimono",
      badge: "SALE",
      inStock: true
    },
    {
      id: 53,
      name: "Classic Kimono Set",
      designer: "Yohji Yamamoto",
      price: 152029,
      image: generatePlaceholder("Classic Kimono Set", "Kimono", 53),
      category: "Kimono",
      inStock: true
    },
    {
      id: 54,
      name: "Contemporary Kimono Outfit",
      designer: "Comme des Garçons",
      price: 91040,
      image: generatePlaceholder("Contemporary Kimono Outfit", "Kimono", 54),
      category: "Kimono",
      badge: "NEW",
      inStock: true
    },
    {
      id: 55,
      name: "Elegant Kimono Piece",
      designer: "Dries Van Noten",
      price: 79370,
      image: generatePlaceholder("Elegant Kimono Piece", "Kimono", 55),
      category: "Kimono",
      inStock: false
    },
    {
      id: 56,
      name: "Luxury Kimono Design",
      designer: "Rick Owens",
      price: 199547,
      image: generatePlaceholder("Luxury Kimono Design", "Kimono", 56),
      category: "Kimono",
      badge: "SALE",
      inStock: true
    },
    {
      id: 57,
      name: "Modern Kimono Style",
      designer: "Ann Demeulemeester",
      price: 108618,
      image: generatePlaceholder("Modern Kimono Style", "Kimono", 57),
      category: "Kimono",
      inStock: true
    },
  
    // ──────────────────────────────────────
    // Dresses (9)
    // ──────────────────────────────────────
    {
      id: 58,
      name: "Classic Dresses Design",
      designer: "Pringle of Scotland",
      price: 138811,
      image: generatePlaceholder("Classic Dresses Design", "Dresses", 58),
      category: "Dresses",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 59,
      name: "Luxury Dresses Outfit",
      designer: "Lisa Folawiyo",
      price: 116295,
      image: generatePlaceholder("Luxury Dresses Outfit", "Dresses", 59),
      category: "Dresses",
      inStock: true
    },
    {
      id: 60,
      name: "Elegant Dresses Style",
      designer: "Kenneth Ize",
      price: 199547,
      image: generatePlaceholder("Elegant Dresses Style", "Dresses", 60),
      category: "Dresses",
      inStock: true
    },
    {
      id: 61,
      name: "Modern Dresses Piece",
      designer: "IleOlu",
      price: 136147,
      image: generatePlaceholder("Modern Dresses Piece", "Dresses", 61),
      category: "Dresses",
      badge: "SALE",
      inStock: true
    },
    {
      id: 62,
      name: "Vintage Dresses Set",
      designer: "Deola Sagoe",
      price: 152029,
      image: generatePlaceholder("Vintage Dresses Set", "Dresses", 62),
      category: "Dresses",
      inStock: true
    },
    {
      id: 63,
      name: "Contemporary Dresses Outfit",
      designer: "Maki Oh",
      price: 91040,
      image: generatePlaceholder("Contemporary Dresses Outfit", "Dresses", 63),
      category: "Dresses",
      badge: "NEW",
      inStock: true
    },
    {
      id: 64,
      name: "Luxury Dresses Design",
      designer: "Tiffany Amber",
      price: 79370,
      image: generatePlaceholder("Luxury Dresses Design", "Dresses", 64),
      category: "Dresses",
      inStock: false
    },
    {
      id: 65,
      name: "Classic Dresses Style",
      designer: "Lanre Da Silva",
      price: 199547,
      image: generatePlaceholder("Classic Dresses Style", "Dresses", 65),
      category: "Dresses",
      badge: "SALE",
      inStock: true
    },
    {
      id: 66,
      name: "Elegant Dresses Piece",
      designer: "Mai Atafo",
      price: 108618,
      image: generatePlaceholder("Elegant Dresses Piece", "Dresses", 66),
      category: "Dresses",
      inStock: true
    },
  
    // ──────────────────────────────────────
    // Tops /Blouses (8)
    // ──────────────────────────────────────
    {
      id: 67,
      name: "Elegant Tops /Blouses Design",
      designer: "Lisa Folawiyo",
      price: 23591,
      image: generatePlaceholder("Elegant Tops /Blouses Design", "Tops /Blouses", 67),
      category: "Tops /Blouses",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 68,
      name: "Luxury Tops /Blouses Outfit",
      designer: "Kenneth Ize",
      price: 116295,
      image: generatePlaceholder("Luxury Tops /Blouses Outfit", "Tops /Blouses", 68),
      category: "Tops /Blouses",
      inStock: true
    },
    {
      id: 69,
      name: "Modern Tops /Blouses Style",
      designer: "IleOlu",
      price: 199547,
      image: generatePlaceholder("Modern Tops /Blouses Style", "Tops /Blouses", 69),
      category: "Tops /Blouses",
      inStock: true
    },
    {
      id: 70,
      name: "Vintage Tops /Blouses Piece",
      designer: "Deola Sagoe",
      price: 136147,
      image: generatePlaceholder("Vintage Tops /Blouses Piece", "Tops /Blouses", 70),
      category: "Tops /Blouses",
      badge: "SALE",
      inStock: true
    },
    {
      id: 71,
      name: "Classic Tops /Blouses Set",
      designer: "Maki Oh",
      price: 152029,
      image: generatePlaceholder("Classic Tops /Blouses Set", "Tops /Blouses", 71),
      category: "Tops /Blouses",
      inStock: true
    },
    {
      id: 72,
      name: "Contemporary Tops /Blouses Outfit",
      designer: "Tiffany Amber",
      price: 91040,
      image: generatePlaceholder("Contemporary Tops /Blouses Outfit", "Tops /Blouses", 72),
      category: "Tops /Blouses",
      badge: "NEW",
      inStock: true
    },
    {
      id: 73,
      name: "Luxury Tops /Blouses Design",
      designer: "Lanre Da Silva",
      price: 79370,
      image: generatePlaceholder("Luxury Tops /Blouses Design", "Tops /Blouses", 73),
      category: "Tops /Blouses",
      inStock: false
    },
    {
      id: 74,
      name: "Elegant Tops /Blouses Style",
      designer: "Mai Atafo",
      price: 199547,
      image: generatePlaceholder("Elegant Tops /Blouses Style", "Tops /Blouses", 74),
      category: "Tops /Blouses",
      badge: "SALE",
      inStock: true
    },
  
    // ──────────────────────────────────────
    // Skirt sets (9)
    // ──────────────────────────────────────
    {
      id: 75,
      name: "Luxury Skirt sets Piece",
      designer: "Pringle of Scotland",
      price: 174729,
      image: generatePlaceholder("Luxury Skirt sets Piece", "Skirt sets", 75),
      category: "Skirt sets",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 76,
      name: "Elegant Skirt sets Outfit",
      designer: "Lisa Folawiyo",
      price: 116295,
      image: generatePlaceholder("Elegant Skirt sets Outfit", "Skirt sets", 76),
      category: "Skirt sets",
      inStock: true
    },
    {
      id: 77,
      name: "Modern Skirt sets Design",
      designer: "Kenneth Ize",
      price: 199547,
      image: generatePlaceholder("Modern Skirt sets Design", "Skirt sets", 77),
      category: "Skirt sets",
      inStock: true
    },
    {
      id: 78,
      name: "Vintage Skirt sets Style",
      designer: "IleOlu",
      price: 136147,
      image: generatePlaceholder("Vintage Skirt sets Style", "Skirt sets", 78),
      category: "Skirt sets",
      badge: "SALE",
      inStock: true
    },
    {
      id: 79,
      name: "Classic Skirt sets Set",
      designer: "Deola Sagoe",
      price: 152029,
      image: generatePlaceholder("Classic Skirt sets Set", "Skirt sets", 79),
      category: "Skirt sets",
      inStock: true
    },
    {
      id: 80,
      name: "Contemporary Skirt sets Outfit",
      designer: "Maki Oh",
      price: 91040,
      image: generatePlaceholder("Contemporary Skirt sets Outfit", "Skirt sets", 80),
      category: "Skirt sets",
      badge: "NEW",
      inStock: true
    },
    {
      id: 81,
      name: "Luxury Skirt sets Design",
      designer: "Tiffany Amber",
      price: 79370,
      image: generatePlaceholder("Luxury Skirt sets Design", "Skirt sets", 81),
      category: "Skirt sets",
      inStock: false
    },
    {
      id: 82,
      name: "Elegant Skirt sets Piece",
      designer: "Lanre Da Silva",
      price: 199547,
      image: generatePlaceholder("Elegant Skirt sets Piece", "Skirt sets", 82),
      category: "Skirt sets",
      badge: "SALE",
      inStock: true
    },
    {
      id: 83,
      name: "Modern Skirt sets Style",
      designer: "Mai Atafo",
      price: 108618,
      image: generatePlaceholder("Modern Skirt sets Style", "Skirt sets", 83),
      category: "Skirt sets",
      inStock: true
    },
  
    // ──────────────────────────────────────
    // Asoeke (7)
    // ──────────────────────────────────────
    {
      id: 84,
      name: "Contemporary Asoeke Piece",
      designer: "Moncler",
      price: 42166,
      image: generatePlaceholder("Contemporary Asoeke Piece", "Asoeke", 84),
      category: "Asoeke",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 85,
      name: "Luxury Asoeke Outfit",
      designer: "Max Mara",
      price: 116295,
      image: generatePlaceholder("Luxury Asoeke Outfit", "Asoeke", 85),
      category: "Asoeke",
      inStock: true
    },
    {
      id: 86,
      name: "Elegant Asoeke Style",
      designer: "Valentino",
      price: 199547,
      image: generatePlaceholder("Elegant Asoeke Style", "Asoeke", 86),
      category: "Asoeke",
      inStock: true
    },
    {
      id: 87,
      name: "Modern Asoeke Design",
      designer: "Chloé",
      price: 136147,
      image: generatePlaceholder("Modern Asoeke Design", "Asoeke", 87),
      category: "Asoeke",
      badge: "SALE",
      inStock: true
    },
    {
      id: 88,
      name: "Classic Asoeke Set",
      designer: "Givenchy",
      price: 152029,
      image: generatePlaceholder("Classic Asoeke Set", "Asoeke", 88),
      category: "Asoeke",
      inStock: true
    },
    {
      id: 89,
      name: "Vintage Asoeke Outfit",
      designer: "Balenciaga",
      price: 91040,
      image: generatePlaceholder("Vintage Asoeke Outfit", "Asoeke", 89),
      category: "Asoeke",
      badge: "NEW",
      inStock: true
    },
    {
      id: 90,
      name: "Luxury Asoeke Piece",
      designer: "Saint Laurent",
      price: 79370,
      image: generatePlaceholder("Luxury Asoeke Piece", "Asoeke", 90),
      category: "Asoeke",
      inStock: false
    },
  
    // ──────────────────────────────────────
    // Jumpsuits (8)
    // ──────────────────────────────────────
    {
      id: 91,
      name: "Classic Jumpsuits Style",
      designer: "Christian Louboutin",
      price: 172629,
      image: generatePlaceholder("Classic Jumpsuits Style", "Jumpsuits", 91),
      category: "Jumpsuits",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 92,
      name: "Luxury Jumpsuits Outfit",
      designer: "Jimmy Choo",
      price: 116295,
      image: generatePlaceholder("Luxury Jumpsuits Outfit", "Jumpsuits", 92),
      category: "Jumpsuits",
      inStock: true
    },
    {
      id: 93,
      name: "Elegant Jumpsuits Design",
      designer: "Manolo Blahnik",
      price: 199547,
      image: generatePlaceholder("Elegant Jumpsuits Design", "Jumpsuits", 93),
      category: "Jumpsuits",
      inStock: true
    },
    {
      id: 94,
      name: "Modern Jumpsuits Piece",
      designer: "Stuart Weitzman",
      price: 136147,
      image: generatePlaceholder("Modern Jumpsuits Piece", "Jumpsuits", 94),
      category: "Jumpsuits",
      badge: "SALE",
      inStock: true
    },
    {
      id: 95,
      name: "Vintage Jumpsuits Set",
      designer: "Aquazzura",
      price: 152029,
      image: generatePlaceholder("Vintage Jumpsuits Set", "Jumpsuits", 95),
      category: "Jumpsuits",
      inStock: true
    },
    {
      id: 96,
      name: "Contemporary Jumpsuits Outfit",
      designer: "Gianvito Rossi",
      price: 91040,
      image: generatePlaceholder("Contemporary Jumpsuits Outfit", "Jumpsuits", 96),
      category: "Jumpsuits",
      badge: "NEW",
      inStock: true
    },
    {
      id: 97,
      name: "Luxury Jumpsuits Style",
      designer: "Sergio Rossi",
      price: 79370,
      image: generatePlaceholder("Luxury Jumpsuits Style", "Jumpsuits", 97),
      category: "Jumpsuits",
      inStock: false
    },
    {
      id: 98,
      name: "Classic Jumpsuits Design",
      designer: "Rupert Sanderson",
      price: 199547,
      image: generatePlaceholder("Classic Jumpsuits Design", "Jumpsuits", 98),
      category: "Jumpsuits",
      badge: "SALE",
      inStock: true
    },
  
    // ──────────────────────────────────────
    // Jackets (9)
    // ──────────────────────────────────────
    {
      id: 99,
      name: "Classic Jackets Set",
      designer: "Aviator Nation",
      price: 33683,
      image: generatePlaceholder("Classic Jackets Set", "Jackets", 99),
      category: "Jackets",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 100,
      name: "Luxury Jackets Outfit",
      designer: "The Great",
      price: 116295,
      image: generatePlaceholder("Luxury Jackets Outfit", "Jackets", 100),
      category: "Jackets",
      inStock: true
    },
    {
      id: 101,
      name: "Elegant Jackets Design",
      designer: "Alex Mill",
      price: 199547,
      image: generatePlaceholder("Elegant Jackets Design", "Jackets", 101),
      category: "Jackets",
      inStock: true
    },
    {
      id: 102,
      name: "Modern Jackets Piece",
      designer: "Madewell",
      price: 136147,
      image: generatePlaceholder("Modern Jackets Piece", "Jackets", 102),
      category: "Jackets",
      badge: "SALE",
      inStock: true
    },
    {
      id: 103,
      name: "Vintage Jackets Style",
      designer: "J.Crew",
      price: 152029,
      image: generatePlaceholder("Vintage Jackets Style", "Jackets", 103),
      category: "Jackets",
      inStock: true
    },
    {
      id: 104,
      name: "Contemporary Jackets Outfit",
      designer: "Everlane",
      price: 91040,
      image: generatePlaceholder("Contemporary Jackets Outfit", "Jackets", 104),
      category: "Jackets",
      badge: "NEW",
      inStock: true
    },
    {
      id: 105,
      name: "Luxury Jackets Set",
      designer: "Reformation",
      price: 79370,
      image: generatePlaceholder("Luxury Jackets Set", "Jackets", 105),
      category: "Jackets",
      inStock: false
    },
    {
      id: 106,
      name: "Classic Jackets Design",
      designer: "Aritzia",
      price: 199547,
      image: generatePlaceholder("Classic Jackets Design", "Jackets", 106),
      category: "Jackets",
      badge: "SALE",
      inStock: true
    },
    {
      id: 107,
      name: "Elegant Jackets Piece",
      designer: "Lululemon",
      price: 108618,
      image: generatePlaceholder("Elegant Jackets Piece", "Jackets", 107),
      category: "Jackets",
      inStock: true
    },
  
    // ──────────────────────────────────────
    // Long dresses (6)
    // ──────────────────────────────────────
    {
      id: 108,
      name: "Vintage Long dresses Style",
      designer: "Common Projects",
      price: 174309,
      image: generatePlaceholder("Vintage Long dresses Style", "Long dresses", 108),
      category: "Long dresses",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 109,
      name: "Luxury Long dresses Outfit",
      designer: "Visvim",
      price: 116295,
      image: generatePlaceholder("Luxury Long dresses Outfit", "Long dresses", 109),
      category: "Long dresses",
      inStock: true
    },
    {
      id: 110,
      name: "Elegant Long dresses Design",
      designer: "Rick Owens",
      price: 199547,
      image: generatePlaceholder("Elegant Long dresses Design", "Long dresses", 110),
      category: "Long dresses",
      inStock: true
    },
    {
      id: 111,
      name: "Modern Long dresses Piece",
      designer: "Dries Van Noten",
      price: 136147,
      image: generatePlaceholder("Modern Long dresses Piece", "Long dresses", 111),
      category: "Long dresses",
      badge: "SALE",
      inStock: true
    },
    {
      id: 112,
      name: "Classic Long dresses Set",
      designer: "Ann Demeulemeester",
      price: 152029,
      image: generatePlaceholder("Classic Long dresses Set", "Long dresses", 112),
      category: "Long dresses",
      inStock: true
    },
    {
      id: 113,
      name: "Contemporary Long dresses Outfit",
      designer: "Yohji Yamamoto",
      price: 91040,
      image: generatePlaceholder("Contemporary Long dresses Outfit", "Long dresses", 113),
      category: "Long dresses",
      badge: "NEW",
      inStock: true
    },
  
    // ──────────────────────────────────────
    // Short dresses (7)
    // ──────────────────────────────────────
    {
      id: 114,
      name: "Luxury Short dresses Piece",
      designer: "Danner",
      price: 43896,
      image: generatePlaceholder("Luxury Short dresses Piece", "Short dresses", 114),
      category: "Short dresses",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 115,
      name: "Elegant Short dresses Outfit",
      designer: "Red Wing",
      price: 116295,
      image: generatePlaceholder("Elegant Short dresses Outfit", "Short dresses", 115),
      category: "Short dresses",
      inStock: true
    },
    {
      id: 116,
      name: "Modern Short dresses Design",
      designer: "Viberg",
      price: 199547,
      image: generatePlaceholder("Modern Short dresses Design", "Short dresses", 116),
      category: "Short dresses",
      inStock: true
    },
    {
      id: 117,
      name: "Vintage Short dresses Style",
      designer: "Alden",
      price: 136147,
      image: generatePlaceholder("Vintage Short dresses Style", "Short dresses", 117),
      category: "Short dresses",
      badge: "SALE",
      inStock: true
    },
    {
      id: 118,
      name: "Classic Short dresses Set",
      designer: "Tricker's",
      price: 152029,
      image: generatePlaceholder("Classic Short dresses Set", "Short dresses", 118),
      category: "Short dresses",
      inStock: true
    },
    {
      id: 119,
      name: "Contemporary Short dresses Outfit",
      designer: "Russell Moccasin",
      price: 91040,
      image: generatePlaceholder("Contemporary Short dresses Outfit", "Short dresses", 119),
      category: "Short dresses",
      badge: "NEW",
      inStock: true
    },
    {
      id: 120,
      name: "Luxury Short dresses Piece",
      designer: "Oak Street Bootmakers",
      price: 79370,
      image: generatePlaceholder("Luxury Short dresses Piece", "Short dresses", 120),
      category: "Short dresses",
      inStock: false
    },
  
    // ──────────────────────────────────────
    // Scarfs (8)
    // ──────────────────────────────────────
    {
      id: 121,
      name: "Modern Scarfs Design",
      designer: "Delvaux",
      price: 11080,
      image: generatePlaceholder("Modern Scarfs Design", "Scarfs", 121),
      category: "Scarfs",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 122,
      name: "Luxury Scarfs Outfit",
      designer: "Moynat",
      price: 116295,
      image: generatePlaceholder("Luxury Scarfs Outfit", "Scarfs", 122),
      category: "Scarfs",
      inStock: true
    },
    {
      id: 123,
      name: "Elegant Scarfs Style",
      designer: "Goyard",
      price: 199547,
      image: generatePlaceholder("Elegant Scarfs Style", "Scarfs", 123),
      category: "Scarfs",
      inStock: true
    },
    {
      id: 124,
      name: "Vintage Scarfs Piece",
      designer: "Valextra",
      price: 136147,
      image: generatePlaceholder("Vintage Scarfs Piece", "Scarfs", 124),
      category: "Scarfs",
      badge: "SALE",
      inStock: true
    },
    {
      id: 125,
      name: "Classic Scarfs Set",
      designer: "Berluti",
      price: 152029,
      image: generatePlaceholder("Classic Scarfs Set", "Scarfs", 125),
      category: "Scarfs",
      inStock: true
    },
    {
      id: 126,
      name: "Contemporary Scarfs Outfit",
      designer: "Loro Piana",
      price: 91040,
      image: generatePlaceholder("Contemporary Scarfs Outfit", "Scarfs", 126),
      category: "Scarfs",
      badge: "NEW",
      inStock: true
    },
    {
      id: 127,
      name: "Luxury Scarfs Design",
      designer: "Brunello Cucinelli",
      price: 79370,
      image: generatePlaceholder("Luxury Scarfs Design", "Scarfs", 127),
      category: "Scarfs",
      inStock: false
    },
    {
      id: 128,
      name: "Modern Scarfs Style",
      designer: "Kiton",
      price: 199547,
      image: generatePlaceholder("Modern Scarfs Style", "Scarfs", 128),
      category: "Scarfs",
      badge: "SALE",
      inStock: true
    },
  
    // ──────────────────────────────────────
    // Belt (7)
    // ──────────────────────────────────────
    {
      id: 129,
      name: "Classic Belt Outfit",
      designer: "Thomas Sabo",
      price: 6424,
      image: generatePlaceholder("Classic Belt Outfit", "Belt", 129),
      category: "Belt",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 130,
      name: "Luxury Belt Piece",
      designer: "Pandora",
      price: 116295,
      image: generatePlaceholder("Luxury Belt Piece", "Belt", 130),
      category: "Belt",
      inStock: true
    },
    {
      id: 131,
      name: "Elegant Belt Design",
      designer: "Swarovski",
      price: 199547,
      image: generatePlaceholder("Elegant Belt Design", "Belt", 131),
      category: "Belt",
      inStock: true
    },
    {
      id: 132,
      name: "Modern Belt Style",
      designer: "Tiffany & Co.",
      price: 136147,
      image: generatePlaceholder("Modern Belt Style", "Belt", 132),
      category: "Belt",
      badge: "SALE",
      inStock: true
    },
    {
      id: 133,
      name: "Vintage Belt Set",
      designer: "Cartier",
      price: 152029,
      image: generatePlaceholder("Vintage Belt Set", "Belt", 133),
      category: "Belt",
      inStock: true
    },
    {
      id: 134,
      name: "Contemporary Belt Outfit",
      designer: "Bulgari",
      price: 91040,
      image: generatePlaceholder("Contemporary Belt Outfit", "Belt", 134),
      category: "Belt",
      badge: "NEW",
      inStock: true
    },
    {
      id: 135,
      name: "Luxury Belt Piece",
      designer: "Van Cleef & Arpels",
      price: 79370,
      image: generatePlaceholder("Luxury Belt Piece", "Belt", 135),
      category: "Belt",
      inStock: false
    },
  
    // ──────────────────────────────────────
    // Shoes (7)
    // ──────────────────────────────────────
    {
      id: 136,
      name: "Classic Shoes Outfit",
      designer: "Dior",
      price: 147509,
      image: generatePlaceholder("Classic Shoes Outfit", "Shoes", 136),
      category: "Shoes",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 137,
      name: "Luxury Shoes Piece",
      designer: "Chanel",
      price: 116295,
      image: generatePlaceholder("Luxury Shoes Piece", "Shoes", 137),
      category: "Shoes",
      inStock: true
    },
    {
      id: 138,
      name: "Elegant Shoes Design",
      designer: "Gucci",
      price: 199547,
      image: generatePlaceholder("Elegant Shoes Design", "Shoes", 138),
      category: "Shoes",
      inStock: true
    },
    {
      id: 139,
      name: "Modern Shoes Style",
      designer: "Prada",
      price: 136147,
      image: generatePlaceholder("Modern Shoes Style", "Shoes", 139),
      category: "Shoes",
      badge: "SALE",
      inStock: true
    },
    {
      id: 140,
      name: "Vintage Shoes Set",
      designer: "Louis Vuitton",
      price: 152029,
      image: generatePlaceholder("Vintage Shoes Set", "Shoes", 140),
      category: "Shoes",
      inStock: true
    },
    {
      id: 141,
      name: "Contemporary Shoes Outfit",
      designer: "Hermès",
      price: 91040,
      image: generatePlaceholder("Contemporary Shoes Outfit", "Shoes", 141),
      category: "Shoes",
      badge: "NEW",
      inStock: true
    },
    {
      id: 142,
      name: "Luxury Shoes Piece",
      designer: "Fendi",
      price: 79370,
      image: generatePlaceholder("Luxury Shoes Piece", "Shoes", 142),
      category: "Shoes",
      inStock: false
    },
  
    // ──────────────────────────────────────
    // Bags (7)
    // ──────────────────────────────────────
    {
      id: 143,
      name: "Modern Bags Outfit",
      designer: "Kotn",
      price: 143670,
      image: generatePlaceholder("Modern Bags Outfit", "Bags", 143),
      category: "Bags",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 144,
      name: "Luxury Bags Piece",
      designer: "Everlane",
      price: 116295,
      image: generatePlaceholder("Luxury Bags Piece", "Bags", 144),
      category: "Bags",
      inStock: true
    },
    {
      id: 145,
      name: "Elegant Bags Design",
      designer: "Reformation",
      price: 199547,
      image: generatePlaceholder("Elegant Bags Design", "Bags", 145),
      category: "Bags",
      inStock: true
    },
    {
      id: 146,
      name: "Vintage Bags Style",
      designer: "Aritzia",
      price: 136147,
      image: generatePlaceholder("Vintage Bags Style", "Bags", 146),
      category: "Bags",
      badge: "SALE",
      inStock: true
    },
    {
      id: 147,
      name: "Classic Bags Set",
      designer: "Lululemon",
      price: 152029,
      image: generatePlaceholder("Classic Bags Set", "Bags", 147),
      category: "Bags",
      inStock: true
    },
    {
      id: 148,
      name: "Contemporary Bags Outfit",
      designer: "Patagonia",
      price: 91040,
      image: generatePlaceholder("Contemporary Bags Outfit", "Bags", 148),
      category: "Bags",
      badge: "NEW",
      inStock: true
    },
    {
      id: 149,
      name: "Luxury Bags Piece",
      designer: "The North Face",
      price: 79370,
      image: generatePlaceholder("Luxury Bags Piece", "Bags", 149),
      category: "Bags",
      inStock: false
    },
  
    // ──────────────────────────────────────
    // Jewelry (6)
    // ──────────────────────────────────────
    {
      id: 150,
      name: "Luxury Jewelry Style",
      designer: "J.Crew",
      price: 105042,
      image: generatePlaceholder("Luxury Jewelry Style", "Jewelry", 150),
      category: "Jewelry",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 151,
      name: "Elegant Jewelry Outfit",
      designer: "Madewell",
      price: 116295,
      image: generatePlaceholder("Elegant Jewelry Outfit", "Jewelry", 151),
      category: "Jewelry",
      inStock: true
    },
    {
      id: 152,
      name: "Modern Jewelry Design",
      designer: "Anthropologie",
      price: 199547,
      image: generatePlaceholder("Modern Jewelry Design", "Jewelry", 152),
      category: "Jewelry",
      inStock: true
    },
    {
      id: 153,
      name: "Vintage Jewelry Piece",
      designer: "Free People",
      price: 136147,
      image: generatePlaceholder("Vintage Jewelry Piece", "Jewelry", 153),
      category: "Jewelry",
      badge: "SALE",
      inStock: true
    },
    {
      id: 154,
      name: "Classic Jewelry Set",
      designer: "Urban Outfitters",
      price: 152029,
      image: generatePlaceholder("Classic Jewelry Set", "Jewelry", 154),
      category: "Jewelry",
      inStock: true
    },
    {
      id: 155,
      name: "Contemporary Jewelry Outfit",
      designer: "ASOS",
      price: 91040,
      image: generatePlaceholder("Contemporary Jewelry Outfit", "Jewelry", 155),
      category: "Jewelry",
      badge: "NEW",
      inStock: true
    },
  
    // ──────────────────────────────────────
    // Hair (4)
    // ──────────────────────────────────────
    {
      id: 156,
      name: "Classic Hair Design",
      designer: "Valentino",
      price: 49522,
      image: generatePlaceholder("Classic Hair Design", "Hair", 156),
      category: "Hair",
      badge: "BESTSELLER",
      inStock: true
    },
    {
      id: 157,
      name: "Luxury Hair Outfit",
      designer: "Prada",
      price: 116295,
      image: generatePlaceholder("Luxury Hair Outfit", "Hair", 157),
      category: "Hair",
      inStock: true
    },
    {
      id: 158,
      name: "Elegant Hair Style",
      designer: "Gucci",
      price: 199547,
      image: generatePlaceholder("Elegant Hair Style", "Hair", 158),
      category: "Hair",
      inStock: true
    },
    {
      id: 159,
      name: "Modern Hair Piece",
      designer: "Chanel",
      price: 136147,
      image: generatePlaceholder("Modern Hair Piece", "Hair", 159),
      category: "Hair",
      badge: "SALE",
      inStock: true
    }
  ];
  
  // ──────────────────────────────────────
  // Gender mapping by category
  // ──────────────────────────────────────
  const WOMEN_CATS = new Set([
    "Bubus","Kimono and pant sets","Kimono","Asoeke","Dresses","Long dresses",
    "Short dresses","Jumpsuits","Skirts","Skirt sets","Two piece","Tops /Blouses",
    "Hair","Jewelry","Scarfs",
  ]);
  const MEN_CATS = new Set(["Kaftan","Agbada","Jackets","Pants"]);

  export type Gender = "WOMEN" | "MEN" | "UNISEX";

  export function productGender(category: string): Gender {
    if (WOMEN_CATS.has(category)) return "WOMEN";
    if (MEN_CATS.has(category)) return "MEN";
    return "UNISEX";
  }

  // ──────────────────────────────────────
  // Helper exports
  // ──────────────────────────────────────
  export const getProductsByCategory = (cat: string): Product[] =>
    allProducts.filter(p => p.category === cat);

  export const womenProducts = allProducts.filter(p => WOMEN_CATS.has(p.category) || p.category === "Bags" || p.category === "Shoes" || p.category === "Belt");

  export const menProducts = allProducts.filter(p => MEN_CATS.has(p.category) || p.category === "Bags" || p.category === "Shoes" || p.category === "Belt" || p.category === "Scarfs");

  export const categories = [...new Set(allProducts.map(p => p.category))].sort();

  export const womenCategories = [...new Set(womenProducts.map(p => p.category))].sort();
  export const menCategories   = [...new Set(menProducts.map(p => p.category))].sort();

  export const designers = [
    "All Designers",
    ...new Set(allProducts.map(p => p.designer))
  ].sort();