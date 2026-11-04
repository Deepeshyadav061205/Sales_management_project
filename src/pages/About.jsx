// About page written as a clean student project report using real headings and short paragraphs only.

export default function About() {
  return (
    <div className="page-stack">
      <div className="page-header">
        <h1 className="page-title">About</h1>
      </div>

      <article className="card report-doc">
        {/* === EDIT STUDENT AND INTERNSHIP DETAILS BELOW === */}
        <div className="report-meta">
          <p>Prepared by: [Name]</p>
          <p>Internship: Business and Data Analytics, Ybi Foundation</p>
        </div>
        {/* ================================================= */}

        <section className="report-section">
          <h2>Project Title</h2>
          <p>
            Sales Dashboard: A Browser-Based Sales Performance and Profitability
            Analysis Application.
          </p>
        </section>

        <section className="report-section">
          <h2>Problem Statement</h2>
          <p>
            Many small businesses record daily sales orders in separate spreadsheet
            files without consistent validation or summary charts. As the number of
            orders grows, it becomes slow to check monthly sales trends, compare
            regional performance, or notice when steep discounts lead to losses.
          </p>
        </section>

        <section className="report-section">
          <h2>Objective</h2>
          <p>
            The objective of this project is to provide a simple web dashboard where
            a user can enter or upload sales orders, filter records by year, region,
            category, and customer segment, and review key performance indicators
            and charts in Indian Rupees (₹).
          </p>
        </section>

        <section className="report-section">
          <h2>Dataset Description</h2>
          <p>
            Each record in the dataset represents one sales order with thirteen
            fields. The <strong>id</strong> field is a unique string identifier for
            the order (such as ORD-1001), and <strong>orderDate</strong> stores the
            purchase date in YYYY-MM-DD format.
          </p>
          <p>
            Customer and location details are stored in <strong>customerName</strong>{' '}
            (the buyer&apos;s full name), <strong>segment</strong> (Consumer,
            Corporate, or Home Office), <strong>region</strong> (North, South, East,
            West, or Central), and <strong>shipMode</strong> (Standard, Second
            Class, First Class, or Same Day).
          </p>
          <p>
            Product details are captured in <strong>category</strong> (Furniture,
            Technology, or Office Supplies), <strong>subCategory</strong> (the
            specific group inside that category, such as Laptops, Chairs, or Paper),
            and <strong>productName</strong> (the exact item sold).
          </p>
          <p>
            Order figures are stored in <strong>quantity</strong> (whole number of
            units sold, at least 1), <strong>sales</strong> (total order revenue in
            Indian Rupees after discount), <strong>discount</strong> (a fraction from
            0 to 0.8, where 0.2 means a 20% discount), and <strong>profit</strong>{' '}
            (net profit or loss in Indian Rupees, which can be negative).
          </p>
        </section>

        <section className="report-section">
          <h2>How to Use This App</h2>
          <p>
            <strong>Step 1:</strong> Go to the Add Data page to enter a single order
            using the form, upload a CSV file using the downloadable template, or
            load the built-in 612-order sample dataset.
          </p>
          <p>
            <strong>Step 2:</strong> Open the Dashboard page and select any Year,
            Region, Category, or Segment filter to inspect the six KPI cards, six
            charts, and automatically generated Key Insights.
          </p>
          <p>
            <strong>Step 3:</strong> Visit the Orders page to search by customer or
            product, sort any column, edit or delete individual records, and export
            the order table as a CSV file.
          </p>
        </section>

        <section className="report-section">
          <h2>Tools and Technologies</h2>
          <p>
            This project is built with React and Vite using plain JavaScript. Page
            navigation is handled with React Router, charts are rendered using
            Chart.js and react-chartjs-2, and CSV parsing and export are implemented
            with PapaParse.
          </p>
          <p>
            All styling is written in plain CSS without external UI frameworks, and
            all order records are saved locally in the browser using localStorage.
          </p>
        </section>

        <section className="report-section">
          <h2>Key Calculations</h2>
          <p>
            <strong>Profit Margin (%):</strong> Calculated as (Total Profit / Total
            Sales) * 100. This measures how many rupees of profit are earned for
            every 100 rupees of sales.
          </p>
          <p>
            <strong>Average Order Value (₹):</strong> Calculated as Total Sales /
            Total Orders. When there are zero matching orders or zero sales, both
            calculations return 0 to avoid division by zero.
          </p>
        </section>

        <section className="report-section">
          <h2>Sample Findings</h2>
          <p>
            Analysis of the 2023 to 2025 sample dataset shows that Technology
            produces the highest total profit and an average profit margin above
            28%. Furniture generates steady revenue but has a low overall margin
            near 2% to 3%, while Office Supplies provides frequent, smaller orders.
          </p>
          <p>
            Monthly sales increase clearly from October to December each year. In
            addition, orders given a discount above 30% almost always result in a
            negative profit margin.
          </p>
        </section>

        <section className="report-section">
          <h2>Recommendations</h2>
          <p>
            Sales teams should cap regular promotional discounts at 25% to 30% so
            that orders do not turn into losses. Deeper discounts should require
            review before approval, particularly on low-margin Furniture items such
            as bookcases and tables.
          </p>
          <p>
            Inventory and supplier orders for fast-moving Technology products should
            be planned ahead of the October to December peak season to capture
            fourth-quarter demand without heavy discounting.
          </p>
        </section>

        <section className="report-section">
          <h2>Limitations</h2>
          <p>
            All data stays inside the user&apos;s browser in localStorage, which
            means orders are not shared across devices and clearing browser storage
            deletes the saved data. The app has no user login or multi-user
            permissions, and browser-based storage and rendering are not designed
            for very large datasets.
          </p>
        </section>

        <section className="report-section">
          <h2>Future Scope</h2>
          <p>
            In future versions, the application can be connected to a backend server
            and database with user login so teams can share live sales data safely.
            Additional features could include monthly sales targets, basic demand
            forecasting, and downloadable PDF summary reports.
          </p>
        </section>
      </article>
    </div>
  );
}
