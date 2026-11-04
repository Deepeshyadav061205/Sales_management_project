# Sales Dashboard

Sales Dashboard is a front-end web application for recording, importing, and analyzing sales orders in Indian Rupees (`₹`). Users can enter individual orders manually, upload CSV datasets (including Superstore-formatted files), filter performance across years, regions, categories, and customer segments, and inspect key performance indicators, charts, and automated profitability insights entirely inside the browser.

## Features

- **Dashboard KPIs:** Displays Total Sales, Total Profit, Profit Margin, Orders, Average Order Value, and Customers formatted in Indian Rupees (`en-IN`), updating dynamically with Year, Region, Category, and Segment filters.
- **Interactive Charts:** Six Chart.js visualizations covering Monthly Sales and Profit, Sales and Profit by Category, Sales by Region, Sales by Segment, Top 10 Products by Sales, and Discount vs Profit Margin.
- **Automated Key Insights:** Generates plain-English findings and a recommendation from the active filtered dataset whenever at least 10 orders match.
- **Order Entry and Validation:** Form with category-dependent sub-categories and field-level validation for dates, whole-number quantities, positive sales, discount range (`0%` to `80%`), and profit/loss amounts.
- **CSV Import and Export:** Supports appending or replacing data via CSV upload, downloadable CSV template, row-level error reporting, Superstore column compatibility, fast `5,000+` row imports, and full table CSV export.
- **Order Management:** Search by customer or product, sort any column ascending or descending, browse 20 rows per page, edit orders in an accessible modal (`Escape` to close), and delete with confirmation.
- **Local Persistence:** Automatically persists records in browser `localStorage` with recovery handling for corrupted storage entries and built-in `612`-order deterministic sample data (`2023` to `2025`).

## Screenshots

- **Dashboard View:** `![Dashboard Screenshot](./screenshots/dashboard.png)` *(Add screenshot of `/` showing filters, KPI cards, and charts)*
- **Add Data View:** `![Add Data Screenshot](./screenshots/add-data.png)` *(Add screenshot of `/add` showing order form and CSV upload)*
- **Orders Table View:** `![Orders Screenshot](./screenshots/orders.png)` *(Add screenshot of `/orders` showing search, sorting, and pagination)*

## Tech Stack

- **Framework:** React 19 + Vite 6 (JavaScript)
- **Routing:** React Router (`react-router-dom`)
- **Charts:** Chart.js + `react-chartjs-2`
- **CSV Processing:** PapaParse
- **Styling:** Plain CSS with CSS custom properties (no Tailwind, no UI component library)
- **Storage:** Browser `localStorage` (no backend)

## How to Run Locally

1. Ensure Node.js (v18 or newer) and npm are installed.
2. Open a terminal in the project folder and install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.
5. To create a production build and preview it locally:
   ```bash
   npm run build
   npm run preview
   ```

## CSV Format

Uploaded CSV files must include a header row. Both the canonical column names below and standard Superstore column headers (`Order ID`, `Order Date`, `Customer Name`, `Segment`, `Region`, `Category`, `Sub-Category`, `Product Name`, `Quantity`, `Sales`, `Discount`, `Profit`, `Ship Mode`) are accepted.

- `orderDate` accepts `YYYY-MM-DD`, `DD-MM-YYYY`, or `M/D/YYYY` (must not be in the future).
- `discount` is a fraction from `0` to `0.8` (for example, `0.15` for `15%`).
- `shipMode` accepts `Standard` (or `Standard Class`), `Second Class`, `First Class`, or `Same Day`.

### Sample CSV Table

| id | orderDate | customerName | segment | region | category | subCategory | productName | quantity | sales | discount | profit | shipMode |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ORD-2001 | 2025-10-14 | Aarav Sharma | Corporate | North | Technology | Laptops | Lenovo ThinkPad E14 Gen 5 | 2 | 115200 | 0.1 | 35600 | Standard |
| ORD-2002 | 2025-11-05 | Priya Deshmukh | Consumer | West | Furniture | Chairs | Featherlite Astro High Back Chair | 3 | 21240 | 0.4 | -7780 | Second Class |

## How to Deploy

### Deploy to Vercel

1. Push this project folder to a GitHub, GitLab, or Bitbucket repository.
2. Import the repository in [Vercel](https://vercel.com/).
3. Keep the default Vite settings (**Build Command:** `npm run build`, **Output Directory:** `dist`).
4. Deploy. The included `vercel.json` file rewrites all routes (`/add`, `/orders`, `/about`) to `/index.html` so direct links and page refreshes work properly.

### Deploy to Netlify

1. Push the repository to Git or run `npm run build` locally.
2. In [Netlify](https://www.netlify.com/), connect the repository with **Build Command** `npm run build` and **Publish Directory** `dist` (or drag-and-drop the `dist` folder).
3. The included `public/_redirects` file (`/* /index.html 200`) is copied into `dist/` automatically so client-side routes work on refresh.

## Limitations

- All data is stored locally in the user's browser via `localStorage`; orders do not sync across devices or browsers, and clearing site storage removes saved records.
- There is no user login, authentication, or role-based access control.
- Client-side `localStorage` (~5 MB) and in-memory filtering are suitable for several thousand orders rather than large enterprise databases.

## Author

- **Prepared by:** [Name]
- **Internship:** Business and Data Analytics, Ybi Foundation
