// Deterministic sample dataset generator (~612 orders across 2023-2025).
// Uses a seeded PRNG (Mulberry32) so getSampleData() returns identical records every run.

export const SEGMENTS = ['Consumer', 'Corporate', 'Home Office'];

export const REGIONS = ['North', 'South', 'East', 'West', 'Central'];

export const CATEGORIES = ['Furniture', 'Technology', 'Office Supplies'];

export const SHIP_MODES = ['Standard', 'Second Class', 'First Class', 'Same Day'];

export const SUB_CATEGORIES = {
  Furniture: ['Chairs', 'Tables', 'Bookcases', 'Furnishings'],
  Technology: ['Phones', 'Laptops', 'Accessories', 'Printers'],
  'Office Supplies': ['Paper', 'Binders', 'Storage', 'Stationery', 'Labels'],
};

// 50 realistic office and commercial products with base price (INR) and cost ratio.
const PRODUCT_CATALOG = [
  // Technology (16 products) - strong margins (costRatio 0.60 - 0.70)
  { category: 'Technology', subCategory: 'Phones', productName: 'Samsung Galaxy A54 Enterprise', basePrice: 31500, costRatio: 0.64 },
  { category: 'Technology', subCategory: 'Phones', productName: 'OnePlus Nord CE 4 5G', basePrice: 24500, costRatio: 0.66 },
  { category: 'Technology', subCategory: 'Phones', productName: 'Motorola Edge 50 Pro', basePrice: 29000, costRatio: 0.65 },
  { category: 'Technology', subCategory: 'Phones', productName: 'Vivo V30 Business Edition', basePrice: 27200, costRatio: 0.67 },
  { category: 'Technology', subCategory: 'Laptops', productName: 'Lenovo ThinkPad E14 Gen 5', basePrice: 64000, costRatio: 0.62 },
  { category: 'Technology', subCategory: 'Laptops', productName: 'HP ProBook 450 G10', basePrice: 68500, costRatio: 0.61 },
  { category: 'Technology', subCategory: 'Laptops', productName: 'Dell Latitude 3440', basePrice: 59000, costRatio: 0.63 },
  { category: 'Technology', subCategory: 'Laptops', productName: 'ASUS ExpertBook B1402', basePrice: 52500, costRatio: 0.65 },
  { category: 'Technology', subCategory: 'Accessories', productName: 'Logitech MX Master 3S Mouse', basePrice: 8200, costRatio: 0.60 },
  { category: 'Technology', subCategory: 'Accessories', productName: 'Dell USB-C Docking Station', basePrice: 14500, costRatio: 0.62 },
  { category: 'Technology', subCategory: 'Accessories', productName: 'Seagate Expansion 2TB HDD', basePrice: 6400, costRatio: 0.68 },
  { category: 'Technology', subCategory: 'Accessories', productName: 'APC Back-UPS 1100VA', basePrice: 7200, costRatio: 0.66 },
  { category: 'Technology', subCategory: 'Printers', productName: 'HP LaserJet Pro M404dn', basePrice: 24200, costRatio: 0.65 },
  { category: 'Technology', subCategory: 'Printers', productName: 'Canon imageCLASS MF244dw', basePrice: 21500, costRatio: 0.67 },
  { category: 'Technology', subCategory: 'Printers', productName: 'Brother DCP-L2541DW Duplex', basePrice: 19800, costRatio: 0.66 },
  { category: 'Technology', subCategory: 'Printers', productName: 'Epson EcoTank L3250 Wi-Fi', basePrice: 15400, costRatio: 0.69 },

  // Furniture (16 products) - tight margins (costRatio 0.80 - 0.89)
  { category: 'Furniture', subCategory: 'Chairs', productName: 'Featherlite Astro High Back Chair', basePrice: 11800, costRatio: 0.82 },
  { category: 'Furniture', subCategory: 'Chairs', productName: 'Godrej Interio Motion Task Chair', basePrice: 9500, costRatio: 0.84 },
  { category: 'Furniture', subCategory: 'Chairs', productName: 'Nilkamal Visitor Mesh Chair', basePrice: 4300, costRatio: 0.85 },
  { category: 'Furniture', subCategory: 'Chairs', productName: 'GreenSoul Jupiter Ergonomic Chair', basePrice: 13600, costRatio: 0.81 },
  { category: 'Furniture', subCategory: 'Tables', productName: 'Godrej 8-Seater Conference Table', basePrice: 36000, costRatio: 0.86 },
  { category: 'Furniture', subCategory: 'Tables', productName: 'Featherlite Modular Workstation', basePrice: 18500, costRatio: 0.84 },
  { category: 'Furniture', subCategory: 'Tables', productName: 'Nilkamal Compact Office Desk', basePrice: 5800, costRatio: 0.87 },
  { category: 'Furniture', subCategory: 'Tables', productName: 'Durian Solid Wood Executive Table', basePrice: 28400, costRatio: 0.85 },
  { category: 'Furniture', subCategory: 'Bookcases', productName: 'Godrej Steel 4-Shelf Bookcase', basePrice: 14200, costRatio: 0.84 },
  { category: 'Furniture', subCategory: 'Bookcases', productName: 'Nilkamal Open Display Bookrack', basePrice: 6900, costRatio: 0.86 },
  { category: 'Furniture', subCategory: 'Bookcases', productName: 'Hometown Engineered Wood Shelf', basePrice: 8800, costRatio: 0.85 },
  { category: 'Furniture', subCategory: 'Bookcases', productName: 'Durian Glass Door Library Unit', basePrice: 19600, costRatio: 0.88 },
  { category: 'Furniture', subCategory: 'Furnishings', productName: 'Magnetic Whiteboard 4x3 Feet', basePrice: 3400, costRatio: 0.80 },
  { category: 'Furniture', subCategory: 'Furnishings', productName: 'Felt Pinup Notice Board 3x2', basePrice: 1950, costRatio: 0.82 },
  { category: 'Furniture', subCategory: 'Furnishings', productName: 'Wipro LED Architect Desk Lamp', basePrice: 1750, costRatio: 0.81 },
  { category: 'Furniture', subCategory: 'Furnishings', productName: 'Ergonomic Anti-Fatigue Floor Mat', basePrice: 2600, costRatio: 0.83 },

  // Office Supplies (18 products) - steady small orders (costRatio 0.67 - 0.75)
  { category: 'Office Supplies', subCategory: 'Paper', productName: 'JK Copier A4 75GSM 5-Ream Box', basePrice: 1550, costRatio: 0.72 },
  { category: 'Office Supplies', subCategory: 'Paper', productName: 'TNPL Platinum A4 80GSM 5-Ream', basePrice: 1640, costRatio: 0.71 },
  { category: 'Office Supplies', subCategory: 'Paper', productName: 'BILT Matrix A3 Copier Ream', basePrice: 720, costRatio: 0.73 },
  { category: 'Office Supplies', subCategory: 'Paper', productName: 'Oddy POS Thermal Roll Pack of 20', basePrice: 780, costRatio: 0.70 },
  { category: 'Office Supplies', subCategory: 'Binders', productName: 'Solo Lever Arch File Pack of 10', basePrice: 1180, costRatio: 0.69 },
  { category: 'Office Supplies', subCategory: 'Binders', productName: 'Kangaro Ring Binder Set of 12', basePrice: 1320, costRatio: 0.68 },
  { category: 'Office Supplies', subCategory: 'Binders', productName: 'Cobra Spring Folder Pack of 25', basePrice: 860, costRatio: 0.71 },
  { category: 'Office Supplies', subCategory: 'Binders', productName: 'Worldone Sheet Protector Box', basePrice: 540, costRatio: 0.70 },
  { category: 'Office Supplies', subCategory: 'Storage', productName: 'Godrej Locking Steel Cash Box', basePrice: 1920, costRatio: 0.72 },
  { category: 'Office Supplies', subCategory: 'Storage', productName: 'Cello Desktop Document Tray Set', basePrice: 740, costRatio: 0.70 },
  { category: 'Office Supplies', subCategory: 'Storage', productName: 'Nilkamal Archive Storage Crate', basePrice: 980, costRatio: 0.73 },
  { category: 'Office Supplies', subCategory: 'Storage', productName: 'Solo Expanding Document Case', basePrice: 660, costRatio: 0.69 },
  { category: 'Office Supplies', subCategory: 'Stationery', productName: 'Camlin Whiteboard Marker Box of 50', basePrice: 1120, costRatio: 0.68 },
  { category: 'Office Supplies', subCategory: 'Stationery', productName: 'Kangaro Heavy Duty Stapler HD-23S', basePrice: 1450, costRatio: 0.67 },
  { category: 'Office Supplies', subCategory: 'Stationery', productName: 'Parker Vector Roller Pen Pack of 3', basePrice: 960, costRatio: 0.70 },
  { category: 'Office Supplies', subCategory: 'Labels', productName: 'Avery Address Labels 100 Sheets', basePrice: 920, costRatio: 0.68 },
  { category: 'Office Supplies', subCategory: 'Labels', productName: 'Oddy Barcode Sticker Roll Pack', basePrice: 1260, costRatio: 0.69 },
  { category: 'Office Supplies', subCategory: 'Labels', productName: 'Desmat Shipping Labels 500 Sheets', basePrice: 1680, costRatio: 0.71 },
];

const FIRST_NAMES = [
  'Aarav', 'Aditi', 'Akash', 'Ananya', 'Arjun', 'Bhavna', 'Chetan', 'Deepak',
  'Divya', 'Gaurav', 'Harsh', 'Ishaan', 'Kartik', 'Kavita', 'Manish', 'Meera',
  'Neha', 'Nikhil', 'Pooja', 'Pranav', 'Priya', 'Rahul', 'Rohan', 'Sakshi',
  'Sanjay', 'Shreya', 'Siddharth', 'Sneha', 'Tanvi', 'Vikram',
];

const LAST_NAMES = [
  'Agarwal', 'Bansal', 'Chatterjee', 'Deshmukh', 'Gupta', 'Iyer', 'Joshi',
  'Kapoor', 'Kulkarni', 'Malhotra', 'Mehta', 'Mishra', 'Nair', 'Patel',
  'Rao', 'Reddy', 'Sen', 'Sharma', 'Verma', 'Yadav',
];

// Mulberry32 deterministic PRNG.
function createRng(seed) {
  let state = seed >>> 0;
  return function nextRandom() {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWeighted(rng, items, weights) {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let threshold = rng() * total;
  for (let i = 0; i < items.length; i += 1) {
    threshold -= weights[i];
    if (threshold <= 0) return items[i];
  }
  return items[items.length - 1];
}

function buildCustomers(rng) {
  const allNames = [];
  for (const first of FIRST_NAMES) {
    for (const last of LAST_NAMES) {
      allNames.push(`${first} ${last}`);
    }
  }
  // Fisher-Yates shuffle with seeded RNG, then take 150 distinct customers.
  for (let i = allNames.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = allNames[i];
    allNames[i] = allNames[j];
    allNames[j] = tmp;
  }
  return allNames.slice(0, 150).map((name) => ({
    customerName: name,
    segment: pickWeighted(rng, SEGMENTS, [52, 30, 18]),
    region: pickWeighted(rng, REGIONS, [24, 23, 16, 23, 14]),
  }));
}

let cachedSampleData = null;

// Generate and return 612 deterministic sample orders spanning 2023-2025.
export function getSampleData() {
  if (cachedSampleData) {
    return cachedSampleData.map((row) => ({ ...row }));
  }

  const rng = createRng(20261102);
  const customers = buildCustomers(rng);

  const techProducts = PRODUCT_CATALOG.filter((p) => p.category === 'Technology');
  const furnProducts = PRODUCT_CATALOG.filter((p) => p.category === 'Furniture');
  const officeProducts = PRODUCT_CATALOG.filter((p) => p.category === 'Office Supplies');

  const years = [2023, 2024, 2025];
  const yearWeights = [30, 34, 36];
  // Higher order volume in October, November, and December.
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const monthWeights = [7, 6.5, 8, 7, 7.5, 7.5, 7, 7.5, 8.5, 13.5, 15.5, 14.5];
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const rawOrders = [];
  const totalCount = 612;

  for (let i = 0; i < totalCount; i += 1) {
    const customer = customers[Math.floor(rng() * customers.length)];
    const year = pickWeighted(rng, years, yearWeights);
    const month = pickWeighted(rng, months, monthWeights);
    const maxDay = month === 2 && year === 2024 ? 29 : daysInMonth[month - 1];
    const day = 1 + Math.floor(rng() * maxDay);
    const orderDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const category = pickWeighted(rng, CATEGORIES, [26, 30, 44]);
    let product;
    let discount;
    let quantity;

    if (category === 'Technology') {
      product = techProducts[Math.floor(rng() * techProducts.length)];
      discount = pickWeighted(
        rng,
        [0, 0.05, 0.1, 0.15, 0.2, 0.35, 0.45],
        [34, 24, 18, 10, 5, 6, 3]
      );
      quantity = pickWeighted(rng, [1, 2, 3, 4, 5], [32, 30, 20, 12, 6]);
    } else if (category === 'Furniture') {
      product = furnProducts[Math.floor(rng() * furnProducts.length)];
      discount = pickWeighted(
        rng,
        [0, 0.05, 0.1, 0.15, 0.2, 0.35, 0.4, 0.5],
        [24, 18, 16, 12, 10, 9, 7, 4]
      );
      quantity = pickWeighted(rng, [1, 2, 3, 4, 6], [30, 30, 20, 12, 8]);
    } else {
      product = officeProducts[Math.floor(rng() * officeProducts.length)];
      discount = pickWeighted(
        rng,
        [0, 0.05, 0.1, 0.15, 0.2, 0.35, 0.5, 0.6],
        [38, 22, 16, 8, 6, 4, 4, 2]
      );
      quantity = pickWeighted(rng, [1, 2, 3, 4, 5, 8], [22, 26, 22, 14, 10, 6]);
    }

    // Seasonal Q4 corporate boost
    if (month >= 10 && customer.segment === 'Corporate' && rng() < 0.35) {
      quantity += 1;
    }

    const shipMode = pickWeighted(rng, SHIP_MODES, [54, 22, 16, 8]);

    // List total and cost with minor per-order operational variance (+/- 4%)
    const listTotal = product.basePrice * quantity;
    const costNoise = 0.96 + rng() * 0.08;
    const costTotal = listTotal * product.costRatio * costNoise;

    const sales = Math.max(50, Math.round(listTotal * (1 - discount)));
    const profit = Math.round(sales - costTotal);

    rawOrders.push({
      orderDate,
      customerName: customer.customerName,
      segment: customer.segment,
      region: customer.region,
      category: product.category,
      subCategory: product.subCategory,
      productName: product.productName,
      quantity,
      sales,
      discount,
      profit,
      shipMode,
    });
  }

  // Sort chronologically and assign stable sequential IDs.
  rawOrders.sort((a, b) => a.orderDate.localeCompare(b.orderDate));
  cachedSampleData = rawOrders.map((order, index) => ({
    id: `ORD-${String(1001 + index)}`,
    ...order,
  }));

  return cachedSampleData.map((row) => ({ ...row }));
}
