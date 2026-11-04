# Sales Management & Profitability Analysis Dashboard

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?logo=chartdotjs&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.18-CA4245?logo=reactrouter&logoColor=white)
![PapaParse](https://img.shields.io/badge/PapaParse-5.5-2E7D32)
![Currency](https://img.shields.io/badge/Currency-INR_(₹)-0F766E)

A modern, browser-based **Sales Performance and Profitability Analysis Application** built with React and Vite. Designed for Indian commercial and retail workflows (`en-IN` / `₹`), this application enables users to record individual orders, bulk-import CSV datasets (including standard Superstore files), dynamically filter performance across multiple dimensions, and inspect real-time KPIs, interactive charts, and automated business insights—entirely client-side with zero backend setup required.

---

## Table of Contents

1. [Overview & Problem Statement](#overview--problem-statement)
2. [Key Features](#key-features)
3. [Application Pages & User Workflow](#application-pages--user-workflow)
4. [KPI Metrics & Analytics Engine](#kpi-metrics--analytics-engine)
5. [Interactive Visualizations](#interactive-visualizations)
6. [Data Schema & Validation Rules](#data-schema--validation-rules)
7. [CSV Import & Export Specification](#csv-import--export-specification)
8. [Project Architecture & Folder Structure](#project-architecture--folder-structure)
9. [Tech Stack](#tech-stack)
10. [Getting Started (Run Locally)](#getting-started-run-locally)
11. [Deployment Guide](#deployment-guide)
12. [Key Business Findings & Recommendations](#key-business-findings--recommendations)
13. [Limitations & Future Scope](#limitations--future-scope)
14. [Author](#author)

---

## Overview & Problem Statement

Many small and medium businesses track daily sales orders across disconnected spreadsheets without strict input validation, unified formatting, or real-time profitability summaries. As transaction volume grows, teams struggle to:
- Spot monthly and seasonal revenue trends quickly
- Compare regional and category-level profitability
- Identify when aggressive promotional discounts erode margins and cause net losses

**Sales Dashboard** solves this by providing an all-in-one workspace where users can capture validated order records, import/export spreadsheets, filter performance by **Year, Region, Category, and Segment**, and immediately view executive KPIs, six interactive charts, and plain-English profitability recommendations in Indian Rupees (`₹`).

---

## Key Features

- **Executive KPI Cards:** Real-time calculation of **Total Sales**, **Total Profit**, **Profit Margin (%)**, **Total Orders**, **Average Order Value (₹)**, and **Unique Customers**, formatted using Indian number grouping (`en-IN`, e.g., `₹12,45,800`).
- **Multi-Dimensional Filtering:** Slice the entire dashboard simultaneously by **Year**, **Region**, **Category**, and **Customer Segment** with one-click filter reset.
- **6 Interactive Chart.js Visualizations:** Responsive charts covering monthly revenue/profit trends, category comparison, regional distribution, segment breakdown, top 10 products, and discount-vs-margin correlation.
- **Automated Key Insights Engine:** Automatically synthesizes **5 data-driven findings** and **1 actionable recommendation** whenever the active filter matches at least 10 orders.
- **Smart Order Entry Form:** Dynamic sub-category cascading based on selected category, with strict field-level validation for dates, quantities, discounts (`0%–80%`), and profit/loss figures.
- **High-Speed CSV Import & Export:** Supports `5,000+` row imports in $O(N)$ time via PapaParse, Append or Replace modes, automatic ID generation, row-level validation reporting, downloadable CSV template, and full Superstore column compatibility.
- **Full CRUD Order Management:** Search orders by customer or product name, sort any column ascending/descending, paginate at 20 records per page, edit orders via an accessible modal (`Escape` to close), and delete with confirmation.
- **Resilient Local Persistence & Deterministic Sample Data:** Automatically saves changes to browser `localStorage` with schema validation and corrupted-state recovery. Includes a seeded (`Mulberry32`) **612-order realistic Indian B2B/B2C dataset** spanning `2023–2025` across 50 commercial products.

---

## Application Pages & User Workflow

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | **Dashboard** | Displays multi-select filters, 6 KPI summary cards, automated Key Insights & Recommendation panel, and 6 interactive charts. |
| `/add` | **Add Data** | Contains the manual order entry form, CSV upload tool (Append / Replace modes), downloadable CSV template, sample dataset loader (`612` orders), and a Clear All action. |
| `/orders` | **Orders** | Searchable, sortable, paginated (`20`/page) order table with inline modal editing, record deletion, and one-click CSV export. |
| `/about` | **About** | Structured project documentation covering problem statement, dataset schema, methodology, findings, and recommendations. |

---

## KPI Metrics & Analytics Engine

All analytics functions reside in [`src/utils/calculations.js`](./src/utils/calculations.js) as pure functions with zero division-by-zero or `NaN` edge cases:

| Metric | Formula / Logic | Format |
| :--- | :--- | :--- |
| **Total Sales** | $\sum \text{sales}$ | `₹` (`en-IN`) |
| **Total Profit** | $\sum \text{profit}$ | `₹` (`en-IN`, supports negative losses) |
| **Profit Margin (%)** | $\left(\frac{\text{Total Profit}}{\text{Total Sales}}\right) \times 100$ *(returns `0%` if sales $= 0$)* | `0.0%` |
| **Orders** | $\text{Count of filtered orders}$ | Integer (`en-IN`) |
| **Avg Order Value** | $\frac{\text{Total Sales}}{\text{Total Orders}}$ *(returns `₹0` if orders $= 0$)* | `₹` (`en-IN`) |
| **Customers** | $\text{Distinct count of } \texttt{customerName}$ | Integer (`en-IN`) |

### Automated Insights Logic (`generateKeyInsights`)
When $\ge 10$ orders match the active filter, the engine computes:
1. **Top Category by Profit:** Identifies the highest-profit category and its margin percentage.
2. **Regional Leaders & Laggards:** Compares the highest-revenue region against the lowest-revenue region.
3. **Peak Revenue Month:** Pinpoints the exact `MMM YYYY` month with the highest total sales.
4. **High-Discount Impact (`> 30%`):** Compares average profit margin on orders discounted above `30%` against the overall dataset margin.
5. **Worst-Performing Product:** Flags the product with the largest net loss (or smallest profit).
6. **Dynamic Recommendation:** Prescribes targeted discount caps (`25%–30%`), unit-pricing reviews, or Q4 inventory expansion based on live metrics.

---

## Interactive Visualizations

1. **Monthly Sales & Profit Trend (`MonthlyTrendChart.jsx`):** Chronological line/bar trend comparing monthly revenue and net profit (`YYYY-MM`).
2. **Sales & Profit by Category (`CategoryBarChart.jsx`):** Grouped bar chart comparing **Technology**, **Furniture**, and **Office Supplies**.
3. **Sales by Region (`RegionBarChart.jsx`):** Regional performance across **North**, **South**, **East**, **West**, and **Central**.
4. **Sales by Customer Segment (`SegmentDoughnutChart.jsx`):** Revenue share across **Consumer**, **Corporate**, and **Home Office** segments.
5. **Top 10 Products by Sales (`TopProductsChart.jsx`):** Horizontal ranking of the top 10 revenue-generating products.
6. **Discount vs. Profit Margin (`DiscountMarginScatter.jsx`):** Scatter plot (`x = Discount %`, `y = Profit Margin %`) illustrating how discounts above `30%` drive negative margins.

---

## Data Schema & Validation Rules

Each order record consists of **13 fields** validated on form entry, CSV import, and `localStorage` hydration:

| Field | Type | Validation / Allowed Values |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (e.g., `ORD-1001`). Auto-generated if omitted on CSV import. |
| `orderDate` | `string` | Valid calendar date (`YYYY-MM-DD`), must not be in the future. |
| `customerName` | `string` | Non-empty buyer full name. |
| `segment` | `string` | `Consumer` \| `Corporate` \| `Home Office` |
| `region` | `string` | `North` \| `South` \| `East` \| `West` \| `Central` |
| `category` | `string` | `Furniture` \| `Technology` \| `Office Supplies` |
| `subCategory` | `string` | **Furniture:** `Chairs`, `Tables`, `Bookcases`, `Furnishings`<br>**Technology:** `Phones`, `Laptops`, `Accessories`, `Printers`<br>**Office Supplies:** `Paper`, `Binders`, `Storage`, `Stationery`, `Labels` |
| `productName` | `string` | Non-empty item name. |
| `quantity` | `integer` | Whole number $\ge 1$. |
| `sales` | `number` | Positive revenue amount in `₹` ($> 0$). |
| `discount` | `number` | Stored as decimal fraction `0` to `0.8` (`0%` to `80%`). |
| `profit` | `number` | Net profit or loss in `₹` (can be positive, zero, or negative). |
| `shipMode` | `string` | `Standard` \| `Second Class` \| `First Class` \| `Same Day` |

---

## CSV Import & Export Specification

Uploaded CSV files must contain a header row. The parser in [`src/utils/csv.js`](./src/utils/csv.js) accepts both canonical field names and standard **Superstore CSV headers** (case-insensitive, ignoring spaces/hyphens):

- **Accepted Header Aliases:**
  - `id` / `Order ID` *(optional — auto-allocated if blank)*
  - `orderDate` / `Order Date` / `Date` *(supports `YYYY-MM-DD`, `DD-MM-YYYY`, and `M/D/YYYY`)*
  - `customerName` / `Customer Name` / `Customer`
  - `segment` / `Segment`
  - `region` / `Region` *(normalizes `Center` → `Central`)*
  - `category` / `Category`
  - `subCategory` / `Sub-Category`
  - `productName` / `Product Name` / `Product`
  - `quantity` / `Quantity` / `Qty`
  - `sales` / `Sales` / `Revenue` *(automatically strips `₹`, `$`, and `,`)*
  - `discount` / `Discount` *(accepts decimal `0.15` or percentage `15%`)*
  - `profit` / `Profit` *(automatically strips `₹`, `$`, and `,`)*
  - `shipMode` / `Ship Mode` *(normalizes `Standard Class` → `Standard`)*

### Sample CSV Rows

| id | orderDate | customerName | segment | region | category | subCategory | productName | quantity | sales | discount | profit | shipMode |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| ORD-2001 | 2025-10-14 | Aarav Sharma | Corporate | North | Technology | Laptops | Lenovo ThinkPad E14 Gen 5 | 2 | 115200 | 0.1 | 35600 | Standard |
| ORD-2002 | 2025-11-05 | Priya Deshmukh | Consumer | West | Furniture | Chairs | Featherlite Astro High Back Chair | 3 | 21240 | 0.4 | -7780 | Second Class |

---

## Project Architecture & Folder Structure

```text
Sales_management_project/
├── public/
│   ├── _redirects                 # Netlify SPA routing fallback
│   └── favicon.svg                # Application icon
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── CategoryBarChart.jsx
│   │   │   ├── DiscountMarginScatter.jsx
│   │   │   ├── MonthlyTrendChart.jsx
│   │   │   ├── RegionBarChart.jsx
│   │   │   ├── SegmentDoughnutChart.jsx
│   │   │   ├── TopProductsChart.jsx
│   │   │   └── chartTheme.js      # Shared Chart.js palette and formatting
│   │   ├── Filters.jsx            # Year, Region, Category, Segment filter bar
│   │   ├── KeyInsights.jsx        # Automated insights & recommendation card
│   │   ├── KpiCard.jsx            # Executive metric card component
│   │   ├── Layout.jsx             # Top navigation bar & storage warning banner
│   │   ├── OrderForm.jsx          # Reusable form for adding & editing orders
│   │   └── OrdersTable.jsx        # Search, sort, pagination, and edit/delete modal
│   ├── data/
│   │   └── sampleData.js          # Seeded 612-order generator (2023–2025, 50 products)
│   ├── pages/
│   │   ├── About.jsx              # Project report & methodology page
│   │   ├── AddData.jsx            # Manual order entry & CSV import workspace
│   │   ├── Dashboard.jsx          # Main KPI & visualization view
│   │   └── Orders.jsx             # Order management & CSV export page
│   ├── styles/
│   │   └── global.css             # Custom CSS variables & responsive layout rules
│   ├── utils/
│   │   ├── calculations.js        # Pure KPI, aggregation, and insight algorithms
│   │   ├── csv.js                 # PapaParse CSV import, template, and export
│   │   ├── format.js              # Indian Rupee (en-IN), percentage, and date helpers
│   │   ├── storage.js             # Safe localStorage read/write & ID generator
│   │   └── validate.js            # Form, CSV row, and storage schema validators
│   ├── App.jsx                    # Root router & state management
│   └── main.jsx                   # React DOM entry point
├── index.html
├── package.json
├── vercel.json                    # Vercel SPA rewrite configuration
└── vite.config.js
```

---

## Tech Stack

- **Frontend Framework:** React 19 (`react`, `react-dom`)
- **Build Tool & Dev Server:** Vite 6 (`@vitejs/plugin-react`)
- **Client-Side Routing:** React Router v7 (`react-router-dom`)
- **Data Visualization:** Chart.js 4 + `react-chartjs-2`
- **CSV Parsing & Serialization:** PapaParse 5
- **Styling:** Custom CSS with CSS Custom Properties (zero external UI library overhead)
- **Persistence:** Browser `localStorage` with schema validation

---

## Getting Started (Run Locally)

### Prerequisites
- **Node.js** `v18+` and **npm** installed on your system.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Deepeshyadav061205/Sales_management_project.git
   cd Sales_management_project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

---

## Deployment Guide

### Deploy on Vercel
1. Push the repository to GitHub (`Deepeshyadav061205/Sales_management_project`).
2. Import the project in [Vercel](https://vercel.com/).
3. Use default Vite settings (**Build Command:** `npm run build`, **Output Directory:** `dist`).
4. Click **Deploy**. The included [`vercel.json`](./vercel.json) automatically rewrites client-side routes (`/add`, `/orders`, `/about`) to `/index.html`.

### Deploy on Netlify
1. Connect the GitHub repository in [Netlify](https://www.netlify.com/) (or run `npm run build` and upload the `dist/` directory).
2. Set **Build Command** to `npm run build` and **Publish Directory** to `dist`.
3. The included [`public/_redirects`](./public/_redirects) file ensures all routes resolve cleanly on page refresh.

---

## Key Business Findings & Recommendations

Analysis of the built-in `612`-order dataset (`2023–2025`) highlights several core patterns:
1. **Category Profitability:** **Technology** drives the highest total profit with average margins above **28%**, whereas **Furniture** generates steady revenue but thin net margins (**2%–3%**) due to higher product cost ratios and shipping overhead.
2. **Seasonal Demand:** Monthly sales rise sharply during **October–December (Q4)** across all regions.
3. **Discount Thresholds:** Orders discounted above **30%** consistently result in negative profit margins, particularly on Furniture items such as tables, chairs, and bookcases.
4. **Actionable Recommendation:** Cap standard promotional discounts at **25%–30%**, require manager approval for deeper markdowns on Furniture, and stock fast-moving Technology inventory ahead of Q4 peak demand.

---

## Limitations & Future Scope

### Current Limitations
- **Local Browser Storage:** Data is saved in `localStorage` (~5 MB limit) and does not sync across separate devices or browsers.
- **Single-User Mode:** No backend authentication or role-based access control.

### Future Enhancements
- Backend API integration (Node.js / PostgreSQL or Supabase) for multi-user cloud sync.
- Role-based authentication for sales reps and regional managers.
- Monthly revenue targets, time-series demand forecasting, and one-click PDF executive report export.

---

## Author

- **Deepesh Yadav** ([@Deepeshyadav061205](https://github.com/Deepeshyadav061205))
- **Repository:** [Sales_management_project](https://github.com/Deepeshyadav061205/Sales_management_project)
