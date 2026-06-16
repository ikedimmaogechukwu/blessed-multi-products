import { Product, StoreSettings, Coupon } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-rice-royal",
    name: "Royal Stallion Long Grain Rice (50kg)",
    description: "Premium long-grain parboiled rice imported for outstanding quality. Naturally source, stones-free, and easy to cook. Perfect staple for family dinners, banquets, and everyday meals.",
    category: "Food Items",
    subcategory: "Rice",
    price: 68500,
    stockQuantity: 45,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: true,
    isBestSeller: true,
    reviews: [
      { id: "rev1", reviewerName: "Amara K.", reviewerEmail: "amara@example.com", rating: 5, content: "Excellent quality, swells very well and doesn't stick. Blessed Multi-Products delivered it so fast!", date: "2026-05-15" },
      { id: "rev2", reviewerName: "Tunde O.", reviewerEmail: "tunde@example.com", rating: 4, content: "Clean rice, no stones at all. Will buy again.", date: "2026-06-01" }
    ],
    brand: "Royal Stallion"
  },
  {
    id: "prod-beans-brown",
    name: "Oloyin Sweet Honey Beans (Oloyin)",
    description: "Premium sweet brown honey beans sourced directly from top farms. Cleaned, handpicked, and highly nutritious. Exceptionally sweet taste, boils quickly.",
    category: "Food Items",
    subcategory: "Beans",
    price: 32000,
    stockQuantity: 30,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: true,
    isBestSeller: false,
    reviews: [
      { id: "rev3", reviewerName: "Musa A.", reviewerEmail: "musa@example.com", rating: 5, content: "The sweetness is natural, cooks really fast.", date: "2026-05-20" }
    ],
    brand: "Local Farms"
  },
  {
    id: "prod-garri-white",
    name: "Premium Ijebu White Garri (Bag)",
    description: "Authentic white Ijebu Garri, sour and crunchy as it should be. Highly filtered, sand-free, and ideal for drinking or preparing Eba.",
    category: "Food Items",
    subcategory: "Garri",
    price: 18500,
    stockQuantity: 60,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: false,
    isBestSeller: true,
    reviews: [
      { id: "rev4", reviewerName: "Chioma E.", reviewerEmail: "chioma@example.com", rating: 5, content: "Very crunchy, slaps perfectly with cold water, sugar and groundnuts. Pure Ijebu quality!", date: "2026-06-03" }
    ],
    brand: "Ijebu Premium"
  },
  {
    id: "prod-oil-veg",
    name: "Kings Vegetable Oil (5 Litre)",
    description: "Devon King's Pure Vegetable Oil. Double refined, cholesterol-free, and vitamin-A fortified. Keeps your family healthy and raw dishes tasty.",
    category: "Food Items",
    subcategory: "Vegetable Oil",
    price: 14200,
    stockQuantity: 50,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: true,
    isBestSeller: true,
    reviews: [],
    brand: "Kings"
  },
  {
    id: "prod-noodles-indomie",
    name: "Indomie Instant Noodles Onion Chicken (Carton)",
    description: "One carton of Indomie Onion Chicken flavor noodles (40 packs of 120g). Includes chili powder, seasoning oil, and delicious Onion Chicken aromatic powder.",
    category: "Food Items",
    subcategory: "Noodles",
    price: 12500,
    stockQuantity: 100,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: false,
    isBestSeller: true,
    reviews: [
      { id: "rev5", reviewerName: "Abiodun Y.", reviewerEmail: "abiodun@example.com", rating: 5, content: "Packaged perfectly, fast delivery. Standard Indomie taste.", date: "2026-06-10" }
    ],
    brand: "Indomie"
  },
  {
    id: "prod-bev-milo",
    name: "Nestle Milo Beverage Tin (900g)",
    description: "Nestle Milo chocolate malt food beverage. Fortified with Activ-Go nutrients, vitamins, and minerals to give kids and adults the customized energy boost they need.",
    category: "Food Items",
    subcategory: "Beverages",
    price: 8800,
    stockQuantity: 40,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: false,
    isBestSeller: false,
    reviews: [],
    brand: "Nestle"
  },
  {
    id: "prod-spice-curry",
    name: "Ducros Curry Powder + Thyme Bundle",
    description: "The classic culinary seasoning combo. Includes Ducros Curry Powder 25g and Ducros Thyme 25g. High aroma, distinct spicy Nigerian curry flavouring.",
    category: "Food Items",
    subcategory: "Spices",
    price: 3500,
    stockQuantity: 120,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: false,
    isBestSeller: false,
    reviews: [],
    brand: "Ducros"
  },
  {
    id: "prod-phone-iphone15",
    name: "Apple iPhone 15 Pro Max (256GB)",
    description: "Apple iPhone 15 Pro Max inside beautiful Titanium finish. Boasts a 6.7-inch Super Retina XDR display, A17 Pro Chip, 5x telephoto camera, and durable modern USB-C port.",
    category: "Phones",
    subcategory: "Apple iPhone",
    price: 1850000,
    stockQuantity: 8,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1565849906461-0cf23dd817fa?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: true,
    isBestSeller: true,
    reviews: [
      { id: "rev6", reviewerName: "Emeka O.", reviewerEmail: "emeka@example.com", rating: 5, content: "Genuine standard Apple, brand new sealed. Excellent packaging from Blessed Multi-Products.", date: "2026-05-30" }
    ],
    brand: "Apple"
  },
  {
    id: "prod-phone-s24",
    name: "Samsung Galaxy S24 Ultra (512GB)",
    description: "The ultimate Samsung Galaxy experience. Loaded with advanced Galaxy AI, a built-in S Pen stylus, customized 200MP Quad Telephoto Camera, SnapDragon 8 Gen 3 for Galaxy, and durable titanium body.",
    category: "Phones",
    subcategory: "Samsung",
    price: 1650000,
    stockQuantity: 10,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583573636246-18cb2246697f?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: true,
    isBestSeller: true,
    reviews: [],
    brand: "Samsung"
  },
  {
    id: "prod-phone-redmi13",
    name: "Xiaomi Redmi Note 13 Pro (8GB/256GB)",
    description: "Equipped with an ultra-clear 200MP camera with OIS optical stabilization, beautiful 1.5K 120Hz AMOLED display, 67W turbo fast charger included, and long-lasting 5000mAh battery.",
    category: "Phones",
    subcategory: "Xiaomi",
    price: 410000,
    stockQuantity: 15,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: false,
    isBestSeller: false,
    reviews: [],
    brand: "Xiaomi"
  },
  {
    id: "prod-phone-camon30",
    name: "Tecno Camon 30 Premier 5G",
    description: "Tecno flagship camera phone with custom Sony main sensor and advanced polaroid camera features. Modern tech structure, fast refresh rates, and large 512GB space.",
    category: "Phones",
    subcategory: "Tecno",
    price: 520000,
    stockQuantity: 12,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: false,
    isBestSeller: false,
    reviews: [],
    brand: "Tecno"
  },
  {
    id: "prod-phone-note40",
    name: "Infinix Note 40 Pro 5G (8GB/256GB)",
    description: "Introducing revolutionary 100W multi-speed fast charge and magnetic charging integration. Premium 3D curved AMOLED screen, outstanding 108MP camera, dual speakers tuned by JBL.",
    category: "Phones",
    subcategory: "Infinix",
    price: 395000,
    stockQuantity: 20,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: false,
    isBestSeller: false,
    reviews: [],
    brand: "Infinix"
  },
  {
    id: "prod-lap-macbookpro",
    name: "Apple MacBook Pro 14 M3 Chip",
    description: "Supercharged by the innovative M3 chip with unified 8GB RAM and 512GB lightning-fast SSD. Breathtaking liquid retina XDR screen, studio mics, and up to 22 hours of rich battery life inside space gray finish.",
    category: "Laptops",
    subcategory: "Apple MacBook",
    price: 2450000,
    stockQuantity: 6,
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1515248137880-45e105b710e0?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: true,
    isBestSeller: true,
    reviews: [
      { id: "rev7", reviewerName: "Bisi A.", reviewerEmail: "bisi@example.com", rating: 5, content: "Extremely fast, compiling apps in seconds. The display is gorgeous.", date: "2026-06-08" }
    ],
    brand: "Apple"
  },
  {
    id: "prod-lap-hp-pavilion",
    name: "HP Pavilion 15 Core i5 (16GB/512GB)",
    description: "Perfect versatile laptop for professionals and students. Intel Core i5 processor, generous 16GB DDR4 RAM, high speed PCIe SSD, narrow border backlit screen, Windows 11.",
    category: "Laptops",
    subcategory: "HP",
    price: 790000,
    stockQuantity: 14,
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: false,
    isBestSeller: true,
    reviews: [],
    brand: "HP"
  },
  {
    id: "prod-lap-dell-latitude",
    name: "Dell Latitude 5440 Enterprise Core i7",
    description: "Premium business-class hardware. Intel Core i7 13th Gen, 16GB RAM, 512GB SSD, intel Iris Xe graphics, full array security features, carbon neutral design, rugged durability.",
    category: "Laptops",
    subcategory: "Dell",
    price: 1150000,
    stockQuantity: 11,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: false,
    isBestSeller: false,
    reviews: [],
    brand: "Dell"
  },
  {
    id: "prod-lap-lenovo-yoga",
    name: "Lenovo Yoga Book 9i Dual Screen Screen Intel Core Ultra 7",
    description: "Futuristic dual-screen 2-in-1 convertible. Double 13.3-inch OLED touchscreen displays, Intel Evo Core Ultra 7 tech, bundled bluetooth keyboard and active stylus, ultimate multitask machine.",
    category: "Laptops",
    subcategory: "Lenovo",
    price: 2850000,
    stockQuantity: 4,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: true,
    isBestSeller: false,
    reviews: [],
    brand: "Lenovo"
  },
  {
    id: "prod-lap-asus-zen",
    name: "ASUS Zenbook 14 OLED",
    description: "Incredibly thin and lightweight. Intel Core Ultra 5, 16GB RAM, 1TB SSD storage, spectacular 14-inch OLED display, cinema-grade color accuracy, premium sleek ponder blue aluminum frame.",
    category: "Laptops",
    subcategory: "ASUS",
    price: 1250000,
    stockQuantity: 8,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80"
    ],
    isFeatured: false,
    isBestSeller: false,
    reviews: [],
    brand: "ASUS"
  }
];

export const INITIAL_TESTIMONIALS = [
  {
    id: "t1",
    name: "Dr. Okey Nwachukwu",
    role: "Lagos Resident",
    content: "Blessed Multi-Products is my absolute go-to for original electronics and quality food stuff. Their long-grain rice is exceptionally clean, and I split a secure Dell laptop for my daughter that works perfectly.",
    rating: 5,
    createdAt: "2026-05-10"
  },
  {
    id: "t2",
    name: "Mrs. Funmilayo Alao",
    role: "Catering Business Owner",
    content: "I buy bags of Ijebu Garri and vegetable oil in bulk from them. The delivery is extremely rapid, and their customer service on WhatsApp is so humble and quick. Quality is truly guaranteed!",
    rating: 5,
    createdAt: "2026-05-24"
  },
  {
    id: "t3",
    name: "Chinedu Okafor",
    role: "Software Engineer",
    content: "Bought an iPhone 15 Pro Max here. It was completely sealed, brand new, and cheaper than standard retail shops. Highly trust Blessed Multi-Products!",
    rating: 5,
    createdAt: "2026-06-02"
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  whatsappNumber: "09053656282",
  whatsappLink: "https://wa.me/2349053656282",
  emailAddress: "ogechukwublessing009@gmail.com",
  businessAddress: "Blessed Multi-Products plaza, Shop 22, General Merchandise Market, Lagos State, Nigeria",
  businessHours: "Monday - Saturday: 8:00 AM - 6:00 PM (Sunday: Closed)",
  promoTitle: "Quality You Can Trust",
  promoSubtitle: "Blessed Multi-Products offers premium foods, the latest smartphones, computers, and general store merchandise at unbeatable prices.",
  bannerImages: [
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
  ]
};

export const INITIAL_COUPONS: Coupon[] = [
  { code: "BLESSED10", discountType: "percentage", value: 10, minPurchase: 10000, active: true },
  { code: "QUALITY5000", discountType: "fixed", value: 5000, minPurchase: 50000, active: true },
  { code: "WELCOMEGIFT", discountType: "percentage", value: 5, minPurchase: 2000, active: true }
];
