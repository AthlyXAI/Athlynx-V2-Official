import { useState, useMemo } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ContactSalesModal } from "@/components/ContactSalesModal";

interface LocalCartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
  category: string;
  description?: string;
}

// Static products for display (will be synced to DB)
const staticProducts = [
  // ENTERPRISE HARDWARE - Supermicro Servers (ICC Partnership)
  { id: 101, sku: "SM-4U-60BAY", name: "Supermicro 4U 60-Bay Storage Server", category: "enterprise", price: 38793.44, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80", rating: 5.0, reviews: 12, description: "Intel Xeon 6521P, 128GB DDR5, 60x 30TB HDD capacity", requiresQuote: false },
  { id: 102, sku: "SM-2U-8BAY", name: "Custom Server — 2U Silver (256GB)", category: "enterprise", price: 15313.11, image: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=600&q=80", rating: 4.9, reviews: 28, description: "Supermicro 2U · Intel Xeon Silver 4514Y · 256GB DDR5", requiresQuote: false },
  { id: 103, sku: "SM-2U-HP", name: "Supermicro 2U High-Performance Server", category: "enterprise", price: 22516.88, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", rating: 5.0, reviews: 8, description: "Dual Xeon, 160GB RAM, 7.68TB NVMe per bay", requiresQuote: false },
  { id: 104, sku: "NV-CX7-VPI", name: "NVIDIA ConnectX-7 VPI Adapter", category: "enterprise", price: 1299.99, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80", rating: 4.9, reviews: 45, description: "200Gb/s NDR Infiniband & 200GbE, 2xQSFP", requiresQuote: false },
  { id: 105, sku: "SG-EXOS-30TB", name: "Seagate Exos M 3+ 30TB HDD", category: "enterprise", price: 549.99, image: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&q=80", rating: 4.8, reviews: 156, description: "Enterprise 3.5\" 7200RPM SATA drive", requiresQuote: false },
  { id: 106, sku: "MC-7500-7TB", name: "Micron 7500 PRO 7.68TB NVMe", category: "enterprise", price: 899.99, image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&q=80", rating: 4.9, reviews: 89, description: "U.3 PCIe 4.0 enterprise SSD", requiresQuote: false },
  { id: 107, sku: "INT-XEON-6521P", name: "Intel Xeon 6521P Processor", category: "enterprise", price: 2499.99, image: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&q=80", rating: 5.0, reviews: 34, description: "24C/48T, 2.60GHz, 144MB cache, LGA4710", requiresQuote: false },
  { id: 108, sku: "DDR5-32GB-ECC", name: "32GB DDR5 6400MHz ECC RAM", category: "enterprise", price: 189.99, image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&q=80", rating: 4.8, reviews: 267, description: "Registered ECC memory module", requiresQuote: false },

  // SOFTWARE & LICENSES
  { id: 201, sku: "ATH-PRO-ANN", name: "ATHLYNX Pro Subscription (Annual)", category: "software", price: 99.99, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80", rating: 4.9, reviews: 1245, description: "50 AI credits/mo, video highlights, analytics", requiresQuote: false },
  { id: 202, sku: "ATH-ELITE-ANN", name: "ATHLYNX Elite Subscription (Annual)", category: "software", price: 299.99, image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80", rating: 5.0, reviews: 567, description: "200 AI credits/mo, AI coach, scout access", requiresQuote: false },
  { id: 203, sku: "ATH-ENT-LIC", name: "ATHLYNX Enterprise License", category: "software", price: 999.99, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80", rating: 5.0, reviews: 23, description: "Unlimited credits, white-label, API access", requiresQuote: false },
  { id: 204, sku: "AI-CRED-100", name: "AI Credits Pack — 100 Credits", category: "software", price: 9.99, image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80", rating: 4.7, reviews: 2341, description: "Use for training plans, video analysis, recruiting", requiresQuote: false },
  { id: 205, sku: "AI-CRED-500", name: "AI Credits Pack — 500 Credits", category: "software", price: 39.99, image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80", rating: 4.8, reviews: 1567, description: "Includes 50 bonus credits", requiresQuote: false },
  { id: 206, sku: "AI-CRED-1K", name: "AI Credits Pack — 1,000 Credits", category: "software", price: 69.99, image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80", rating: 4.9, reviews: 892, description: "Includes 150 bonus credits", requiresQuote: false },
  { id: 207, sku: "AI-CRED-5K", name: "AI Credits Pack — 5,000 Credits", category: "software", price: 299.99, image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80", rating: 5.0, reviews: 234, description: "Includes 1,000 bonus credits", requiresQuote: false },
  { id: 208, sku: "WL-SPORT-APP", name: "White-Label Sport App License", category: "software", price: 4999.99, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80", rating: 5.0, reviews: 12, description: "Your brand, our platform - per sport", requiresQuote: true },
  { id: 209, sku: "SOFT-AI-ENT", name: "Softmor AI Enterprise Suite", category: "software", price: 9999.99, image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80", rating: 5.0, reviews: 8, description: "Full AI/ML platform license", requiresQuote: true },

  // DATA CENTER PACKAGES
  { id: 301, sku: "DC-STARTER", name: "Starter Data Center Package", category: "datacenter", price: 99999.99, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80", rating: 5.0, reviews: 5, description: "10 servers, networking, 3-year support", requiresQuote: true },
  { id: 302, sku: "DC-GROWTH", name: "Growth Data Center Package", category: "datacenter", price: 499999.99, image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80", rating: 5.0, reviews: 3, description: "50 servers, full stack, dedicated support", requiresQuote: true },
  { id: 303, sku: "DC-ENTERPRISE", name: "Enterprise Data Center Package", category: "datacenter", price: 2499999.99, image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&q=80", rating: 5.0, reviews: 2, description: "250+ servers, custom config, 24/7 support", requiresQuote: true },
  { id: 304, sku: "DC-CUSTOM", name: "Custom Data Center Solution", category: "datacenter", price: 0, image: "https://images.unsplash.com/photo-1606765962248-7ff407b51667?w=600&q=80", rating: 5.0, reviews: 15, description: "Contact sales for custom quote", requiresQuote: true },
  { id: 305, sku: "GEO-POWER", name: "Geothermal Power Integration", category: "datacenter", price: 0, image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80", rating: 5.0, reviews: 4, description: "Sustainable power solutions - contact sales", requiresQuote: true },

  // SUPPORT & MAINTENANCE
  { id: 401, sku: "SUP-3YR-PARTS", name: "3-Year Parts Warranty", category: "support", price: 2999.99, image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80", rating: 4.9, reviews: 89, description: "Extended parts coverage per server", requiresQuote: false },
  { id: 402, sku: "SUP-1YR-CRIT", name: "1-Year Critical Replacement", category: "support", price: 999.99, image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80", rating: 5.0, reviews: 67, description: "Next-day replacement service", requiresQuote: false },
  { id: 403, sku: "SUP-247-TECH", name: "24/7 Technical Support (Annual)", category: "support", price: 4999.99, image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80", rating: 4.8, reviews: 123, description: "Round-the-clock expert support", requiresQuote: false },
  { id: 404, sku: "SUP-DED-MGR", name: "Dedicated Account Manager", category: "support", price: 9999.99, image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80", rating: 5.0, reviews: 34, description: "Personal enterprise support contact", requiresQuote: true },
  { id: 405, sku: "SUP-ONSITE", name: "On-Site Service Package", category: "support", price: 14999.99, image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80", rating: 5.0, reviews: 18, description: "Technician visits included (annual)", requiresQuote: true },
  { id: 406, sku: "SUP-MONITOR", name: "Proactive Monitoring Service", category: "support", price: 1999.99, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80", rating: 4.9, reviews: 56, description: "24/7 system health monitoring", requiresQuote: false },
  { id: 407, sku: "SUP-UPDATES", name: "Software Updates & Patches", category: "support", price: 499.99, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80", rating: 4.7, reviews: 234, description: "Annual update subscription", requiresQuote: false },

  // AI COMPANIONS (FUEL BOTS) - All require quotes
  { id: 501, sku: "FB-TRAIN", name: "Fuel Bot — Training Companion", category: "fuelbots", price: 0, image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80", rating: 5.0, reviews: 0, description: "AI-powered athletic trainer - Contact for lease", requiresQuote: true },
  { id: 502, sku: "FB-MEDICAL", name: "Fuel Bot — Medical Response Unit", category: "fuelbots", price: 0, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80", rating: 5.0, reviews: 0, description: "Rapid AED delivery & injury support - Contact sales", requiresQuote: true },
  { id: 503, sku: "FB-SECURITY", name: "Fuel Bot — Stadium Security", category: "fuelbots", price: 0, image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&q=80", rating: 5.0, reviews: 0, description: "Autonomous security patrol - Contact sales", requiresQuote: true },
  { id: 504, sku: "FB-DATACENTER", name: "Fuel Bot — Data Center Operations", category: "fuelbots", price: 0, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80", rating: 5.0, reviews: 0, description: "Automated facility management - Contact sales", requiresQuote: true },
  { id: 505, sku: "FB-ENERGY", name: "Fuel Bot — Energy Sector", category: "fuelbots", price: 0, image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80", rating: 5.0, reviews: 0, description: "Geothermal & power station ops - Contact sales", requiresQuote: true },
  { id: 506, sku: "RD-HEXAPOD", name: "Hexapod Robot Dog", category: "fuelbots", price: 0, image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80", rating: 5.0, reviews: 0, description: "6-legged all-terrain companion - Contact sales", requiresQuote: true },
  { id: 507, sku: "RD-HYBRID", name: "Wheel-Leg Hybrid Robot", category: "fuelbots", price: 0, image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80", rating: 5.0, reviews: 0, description: "Speed + stability hybrid - Contact sales", requiresQuote: true },
  { id: 508, sku: "RD-MEDIUM", name: "Medium Size Robot Dog", category: "fuelbots", price: 0, image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80", rating: 5.0, reviews: 0, description: "25kg payload, 4-6hr battery - Contact sales", requiresQuote: true },

  // SPORTS EQUIPMENT
  { id: 1, sku: "BB-BAT-PRO", name: "Pro Baseball Bat", category: "baseball", price: 299.99, image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&q=80", rating: 4.8, reviews: 124, description: "Professional grade aluminum bat", requiresQuote: false },
  { id: 2, sku: "BB-GLOVE-LTH", name: "Leather Baseball Glove", category: "baseball", price: 189.99, image: "https://images.unsplash.com/photo-1529768167801-9173d94c2a42?w=600&q=80", rating: 4.9, reviews: 89, description: "Premium leather fielding glove", requiresQuote: false },
  { id: 3, sku: "BB-BALLS-12", name: "Training Baseballs (12pk)", category: "baseball", price: 49.99, image: "https://images.unsplash.com/photo-1508344928928-7165b67de128?w=600&q=80", rating: 4.7, reviews: 256, description: "Official size training balls", requiresQuote: false },
  { id: 4, sku: "FB-BALL-ELITE", name: "Elite Football", category: "football", price: 129.99, image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80", rating: 4.8, reviews: 178, description: "Official size game ball", requiresQuote: false },
  { id: 5, sku: "FB-GLOVES", name: "Football Gloves", category: "football", price: 79.99, image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&q=80", rating: 4.6, reviews: 92, description: "Sticky grip receiver gloves", requiresQuote: false },
  { id: 6, sku: "BK-BALL-PRO", name: "Pro Basketball", category: "basketball", price: 149.99, image: "https://images.unsplash.com/photo-1546519638405-a9d1b2f41960?w=600&q=80", rating: 4.9, reviews: 312, description: "Indoor/outdoor composite leather", requiresQuote: false },
  { id: 7, sku: "BK-SHOES", name: "Basketball Shoes", category: "basketball", price: 179.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", rating: 4.7, reviews: 445, description: "High-top performance shoes", requiresQuote: false },
  { id: 8, sku: "FISH-ROD-PRO", name: "Fishing Rod Pro", category: "fishing", price: 249.99, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80", rating: 4.8, reviews: 67, description: "Carbon fiber spinning rod", requiresQuote: false },
  { id: 9, sku: "FISH-TACKLE", name: "Tackle Box Complete", category: "fishing", price: 89.99, image: "https://images.unsplash.com/photo-1499242611767-cf8b9be02854?w=600&q=80", rating: 4.5, reviews: 134, description: "200+ piece tackle set", requiresQuote: false },
  { id: 10, sku: "GOLF-CLUBS", name: "Golf Club Set", category: "golf", price: 899.99, image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&q=80", rating: 4.9, reviews: 56, description: "Complete 14-piece set with bag", requiresQuote: false },
  { id: 11, sku: "GOLF-BALLS-24", name: "Golf Balls (24pk)", category: "golf", price: 39.99, image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&q=80", rating: 4.6, reviews: 289, description: "Tour-quality golf balls", requiresQuote: false },
  { id: 12, sku: "HUNT-SCOPE", name: "Hunting Rifle Scope", category: "hunting", price: 349.99, image: "https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=600&q=80", rating: 4.8, reviews: 78, description: "4-16x50mm illuminated scope", requiresQuote: false },
  { id: 13, sku: "HUNT-JACKET", name: "Camo Jacket", category: "hunting", price: 149.99, image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80", rating: 4.7, reviews: 112, description: "Waterproof hunting jacket", requiresQuote: false },
  { id: 14, sku: "FIT-DUMBBELLS", name: "Adjustable Dumbbells", category: "fitness", price: 399.99, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80", rating: 4.8, reviews: 567, description: "5-50lb adjustable set", requiresQuote: false },
  { id: 15, sku: "FIT-BENCH", name: "Weight Bench Pro", category: "fitness", price: 299.99, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80", rating: 4.7, reviews: 234, description: "Adjustable incline/decline bench", requiresQuote: false },
  { id: 16, sku: "APP-TEE", name: "ATHLYNX Performance Tee", category: "apparel", price: 34.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", rating: 4.8, reviews: 234, description: "Moisture-wicking athletic tee", requiresQuote: false },
  { id: 17, sku: "APP-HOODIE", name: "ATHLYNX Hoodie", category: "apparel", price: 69.99, image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80", rating: 4.9, reviews: 189, description: "Premium fleece hoodie", requiresQuote: false },
  { id: 18, sku: "TRAIN-LADDER", name: "Speed Ladder", category: "training", price: 24.99, image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80", rating: 4.6, reviews: 345, description: "20ft agility ladder", requiresQuote: false },
  { id: 19, sku: "TRAIN-CONES", name: "Agility Cones (20pk)", category: "training", price: 19.99, image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=80", rating: 4.7, reviews: 456, description: "High-visibility training cones", requiresQuote: false },
  { id: 20, sku: "BB-PITCH-MACH", name: "Pitching Machine", category: "baseball", price: 1299.99, image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&q=80", rating: 4.9, reviews: 34, description: "Variable speed pitching machine", requiresQuote: false },
];

// Product type from database
interface Product {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  category: string;
  price: string;
  imageUrl: string | null;
  image: string | null;
  rating: string | null;
  reviewCount: number | null;
  stockQuantity: number | null;
  requiresQuote: string;
  isActive: string;
}

export default function Store() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [localCart, setLocalCart] = useState<LocalCartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showContactSales, setShowContactSales] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutCity, setCheckoutCity] = useState("");
  const [checkoutZip, setCheckoutZip] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = [
    { id: "all", name: "All Products", icon: "🛒" },
    { id: "enterprise", name: "Enterprise Hardware", icon: "🖥️" },
    { id: "software", name: "Software & Licenses", icon: "💿" },
    { id: "datacenter", name: "Data Center", icon: "🏢" },
    { id: "support", name: "Support & Maintenance", icon: "🛠️" },
    { id: "fuelbots", name: "AI Companions", icon: "🤖" },
    { id: "baseball", name: "Baseball", icon: "⚾" },
    { id: "football", name: "Football", icon: "🏈" },
    { id: "basketball", name: "Basketball", icon: "🏀" },
    { id: "fishing", name: "Fishing", icon: "🎣" },
    { id: "golf", name: "Golf", icon: "⛳" },
    { id: "hunting", name: "Hunting", icon: "🦌" },
    { id: "fitness", name: "Fitness", icon: "💪" },
    { id: "apparel", name: "Apparel", icon: "👕" },
    { id: "training", name: "Training", icon: "🏋️" },
  ];

  // No backend store router — use static products only
  const dbProducts: null = null;
  const productsLoading = false;
  const createProductCheckout = trpc.stripe.createProductCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
    onError: (err) => {
      toast.error(err.message || 'Checkout failed. Please try again.');
      setIsProcessing(false);
    },
  });
  const createCheckout = {
    mutateAsync: async (_input: unknown) => {
      const cartDescription = localCart.map(i => `${i.qty}x ${i.name}`).join(', ');
      await createProductCheckout.mutateAsync({
        productName: `ATHLYNX Store Order (${cartCount} item${cartCount !== 1 ? 's' : ''})`,
        productDescription: cartDescription.slice(0, 200),
        priceInCents: Math.round(orderTotal * 100),
        quantity: 1,
        origin: window.location.origin,
      });
    },
    isPending: createProductCheckout.isPending,
  };

  // Use static products
  const products: Product[] = staticProducts.map(p => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        description: p.description,
        category: p.category,
        price: String(p.price),
        imageUrl: p.image,
        image: p.image,
        rating: String(p.rating),
        reviewCount: p.reviews,
        stockQuantity: 100,
        requiresQuote: p.requiresQuote ? 'yes' : 'no',
        isActive: 'yes'
      }));
  void productsLoading; // suppress unused warning
  void dbProducts; // suppress unused warning

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const addToCart = (product: Product) => {
    const price = parseFloat(product.price);
    // Check if requires quote
    if (product.requiresQuote === 'yes' || price === 0) {
      setSelectedProduct(product);
      setShowContactSales(true);
      return;
    }

    setLocalCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: price,
        qty: 1,
        image: product.imageUrl || product.image || '📦',
        category: product.category,
        description: product.description || ''
      }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (id: number, delta: number) => {
    setLocalCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          if (newQty <= 0) return null as any;
          return { ...item, qty: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id: number) => {
    setLocalCart(prev => prev.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const cartTotal = localCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = localCart.reduce((sum, item) => sum + item.qty, 0);
  const shipping = cartTotal >= 100 ? 0 : 9.99;
  const tax = cartTotal * 0.0825;
  const orderTotal = cartTotal + shipping + tax;

  const handleCheckout = async () => {
    if (!checkoutEmail || !checkoutName || !checkoutAddress || !checkoutCity || !checkoutZip) {
      toast.error("Please fill in all shipping information");
      return;
    }

    setIsProcessing(true);

    // For logged-in users, use Stripe checkout
    if (user) {
      void createCheckout.mutateAsync({
        shippingName: checkoutName,
        shippingEmail: checkoutEmail,
        shippingAddress: checkoutAddress,
        shippingCity: checkoutCity,
        shippingZip: checkoutZip,
      });
    } else {
      // For guests, show login prompt
      toast.error("Please log in to complete your purchase");
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Contact Sales";
    if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`;
    if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${price.toFixed(2)}`;
  };

  const getInquiryType = (category: string) => {
    const mapping: Record<string, string> = {
      enterprise: "enterprise_hardware",
      datacenter: "data_center",
      software: "software_license",
      fuelbots: "fuel_bots",
      support: "support_contract",
    };
    return mapping[category] || "other";
  };

  // Helper: is image a URL or an emoji/text
  const isImageUrl = (img: string | null) => img && (img.startsWith('http') || img.startsWith('/'));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Contact Sales Modal */}
      <ContactSalesModal
        isOpen={showContactSales}
        onClose={() => {
          setShowContactSales(false);
          setSelectedProduct(null);
        }}
        productName={selectedProduct?.name}
        inquiryType={selectedProduct ? getInquiryType(selectedProduct.category) : undefined}
      />

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowCart(false)} />
          <div className="relative w-full max-w-md bg-[#1a1a2e] h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Your Cart ({cartCount})</h2>
                <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>

              {localCart.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🛒</span>
                  <p className="text-gray-400">Your cart is empty</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="mt-4 px-6 py-2 bg-red-500 text-black rounded-lg font-semibold hover:bg-red-400"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {localCart.map((item) => (
                      <div key={item.id} className="flex gap-4 bg-white/5 rounded-xl p-4">
                        <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden flex items-center justify-center">
                          {isImageUrl(item.image) ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">{item.image}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">{item.name}</p>
                          <p className="text-red-400 font-bold">${item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 bg-white/10 rounded flex items-center justify-center hover:bg-white/20"
                            >
                              −
                            </button>
                            <span className="text-white text-sm">{item.qty}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 bg-white/10 rounded flex items-center justify-center hover:bg-white/20"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto text-red-400 hover:text-red-300 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mb-3">
                      <span>Tax (8.25%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold border-t border-white/10 pt-3">
                      <span>Total</span>
                      <span>${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setShowCart(false); setShowCheckout(true); }}
                    className="w-full py-4 bg-red-500 text-black rounded-xl font-bold text-lg hover:bg-red-400 transition-all"
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowCheckout(false)} />
          <div className="relative w-full max-w-lg bg-[#1a1a2e] rounded-2xl p-8 mx-4 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Checkout</h2>
              <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={checkoutName}
                  onChange={e => setCheckoutName(e.target.value)}
                  className="w-full bg-white/10 rounded-lg px-4 py-3 text-white border border-white/20 focus:border-red-500 outline-none"
                  placeholder="Chad A. Dozier"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email</label>
                <input
                  type="email"
                  value={checkoutEmail}
                  onChange={e => setCheckoutEmail(e.target.value)}
                  className="w-full bg-white/10 rounded-lg px-4 py-3 text-white border border-white/20 focus:border-red-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Street Address</label>
                <input
                  type="text"
                  value={checkoutAddress}
                  onChange={e => setCheckoutAddress(e.target.value)}
                  className="w-full bg-white/10 rounded-lg px-4 py-3 text-white border border-white/20 focus:border-red-500 outline-none"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">City</label>
                  <input
                    type="text"
                    value={checkoutCity}
                    onChange={e => setCheckoutCity(e.target.value)}
                    className="w-full bg-white/10 rounded-lg px-4 py-3 text-white border border-white/20 focus:border-red-500 outline-none"
                    placeholder="Houston"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">ZIP Code</label>
                  <input
                    type="text"
                    value={checkoutZip}
                    onChange={e => setCheckoutZip(e.target.value)}
                    className="w-full bg-white/10 rounded-lg px-4 py-3 text-white border border-white/20 focus:border-red-500 outline-none"
                    placeholder="77001"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mb-3">
                <span>Tax (8.25%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold border-t border-white/10 pt-3">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : `Pay $${orderTotal.toFixed(2)}`}
            </button>
            <p className="text-gray-500 text-xs text-center mt-2">
              🔒 Your payment is secure and encrypted
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-black text-white">ATHLYNX</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/home" className="text-gray-400 hover:text-white">Platform</Link>
            <Link href="/store" className="text-red-400 font-semibold">Store</Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link>
          </nav>
          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all"
          >
            <span>🛒</span>
            <span>${cartTotal.toFixed(2)}</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-red-600 text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Hero */}
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold mb-4">
              🛒 OFFICIAL STORE
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              DHG <span className="text-red-400">Enterprise Store</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From sports equipment to enterprise data center solutions. Hardware, software, AI companions, and everything in between.
            </p>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-red-500 text-white font-semibold"
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {filteredProducts.map((product: Product) => {
              const imgSrc = product.imageUrl || product.image;
              const isUrl = isImageUrl(imgSrc);
              return (
                <div
                  key={product.id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-red-500/50 transition-all group cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a] overflow-hidden relative">
                    {isUrl ? (
                      <img
                        src={imgSrc!}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`${isUrl ? 'hidden' : ''} absolute inset-0 flex items-center justify-center text-6xl`}>
                      {imgSrc || '📦'}
                    </div>
                    {/* Category badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full font-medium capitalize">
                        {product.category}
                      </span>
                    </div>
                    {product.requiresQuote === 'yes' && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 bg-blue-600/80 text-white text-xs rounded-full font-medium">
                          Quote
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-white font-semibold text-sm mb-1 line-clamp-2">{product.name}</p>
                    {product.description && (
                      <p className="text-gray-500 text-xs mb-2 line-clamp-2">{product.description}</p>
                    )}
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-red-400 text-xs">★</span>
                      <span className="text-gray-400 text-xs">{product.rating} ({product.reviewCount || 0})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${parseFloat(product.price) === 0 ? 'text-blue-400 text-xs' : 'text-white text-base'}`}>
                        {formatPrice(parseFloat(product.price))}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                          product.requiresQuote === 'yes' || parseFloat(product.price) === 0
                            ? "bg-blue-600/30 text-blue-400 hover:bg-blue-600/50 border border-blue-500/30"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        {product.requiresQuote === 'yes' || parseFloat(product.price) === 0 ? "Get Quote" : "Add +"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enterprise CTA */}
          <div className="bg-gradient-to-r from-blue-900/40 to-red-900/20 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-8 mb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Need Enterprise Solutions?</h3>
                <p className="text-gray-400">
                  Data centers, AI companions, custom hardware configurations. Our team is ready to help.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setShowContactSales(true);
                }}
                className="px-8 py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all whitespace-nowrap"
              >
                Contact Sales Team
              </button>
            </div>
          </div>

          {/* Featured Partners */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-10">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Technology Partners</h3>
            <div className="flex justify-center gap-8 flex-wrap">
              {["Supermicro", "NVIDIA", "Intel", "Seagate", "Micron", "ICC"].map((brand) => (
                <div key={brand} className="text-gray-500 font-semibold text-lg hover:text-white transition-all cursor-pointer">
                  {brand}
                </div>
              ))}
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link href="/" className="text-blue-400 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
