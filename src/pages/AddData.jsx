// Add Data page with three cards: Add a single order, Upload CSV, and Sample data controls.

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderForm from '../components/OrderForm.jsx';
import { downloadCsvTemplate, parseOrdersCsv } from '../utils/csv.js';
import { formatInteger } from '../utils/format.js';

export default function AddData({
  orders,
  onAddOrder,
  onImportOrders,
  onLoadSample,
  onClearAll,
}) {
  const fileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importMode, setImportMode] = useState('append');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [fileError, setFileError] = useState('');
  const [sampleNotice, setSampleNotice] = useState('');

  async function handleUploadSubmit(e) {
    e.preventDefault();
    setFileError('');
    setUploadResult(null);

    if (!selectedFile) {
      setFileError('Select a CSV file before uploading.');
      return;
    }

    setIsUploading(true);
    try {
      // Yield one frame so the loading state renders immediately for 5,000+ row files.
      await new Promise((resolve) => setTimeout(resolve, 0));

      const baseOrders = importMode === 'replace' ? [] : orders;
      const result = await parseOrdersCsv(selectedFile, baseOrders);

      if (result.importedOrders.length > 0) {
        onImportOrders(result.importedOrders, importMode);
      }

      setUploadResult({
        importedCount: result.importedOrders.length,
        skippedCount: result.skippedCount,
        errors: result.errors,
      });

      setSelectedFile(null);
      if (fileRef.current) {
        fileRef.current.value = '';
      }
    } catch {
      setFileError('Failed to process the selected CSV file.');
    } finally {
      setIsUploading(false);
    }
  }

  function handleLoadSampleClick() {
    setSampleNotice('');
    if (orders.length > 0) {
      const confirmed = window.confirm(
        'Existing orders will be replaced by the sample dataset. Continue?'
      );
      if (!confirmed) return;
    }
    const count = onLoadSample();
    setSampleNotice(`Loaded ${formatInteger(count)} sample orders.`);
  }

  function handleClearAllClick() {
    setSampleNotice('');
    const confirmed = window.confirm(
      'Delete all stored sales orders from this browser? This cannot be undone.'
    );
    if (!confirmed) return;
    onClearAll();
    setSampleNotice('All data cleared.');
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <h1 className="page-title">Add Data</h1>
        {orders.length > 0 && (
          <Link to="/" className="btn">
            View Dashboard
          </Link>
        )}
      </div>

      {/* Card 1: Add a single order */}
      <section className="card">
        <h2 className="card-title">Add a single order</h2>
        <OrderForm onSubmit={onAddOrder} submitLabel="Add Order" />
      </section>

      {/* Card 2: Upload CSV */}
      <section className="card">
        <h2 className="card-title">Upload CSV</h2>
        <p className="text-muted">
          Upload a CSV file matching the order schema or Superstore columns.{' '}
          <a
            href="#download-template"
            onClick={(e) => {
              e.preventDefault();
              downloadCsvTemplate();
            }}
          >
            Download CSV template
          </a>
        </p>

        <form onSubmit={handleUploadSubmit}>
          <div className="radio-row">
            <label className="radio-label">
              <input
                type="radio"
                name="importMode"
                value="append"
                checked={importMode === 'append'}
                onChange={() => setImportMode('append')}
                disabled={isUploading}
              />
              Add to existing data
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="importMode"
                value="replace"
                checked={importMode === 'replace'}
                onChange={() => setImportMode('replace')}
                disabled={isUploading}
              />
              Replace existing data
            </label>
          </div>

          <div className="form-field upload-field">
            <label htmlFor="csv-upload-input">CSV File</label>
            <input
              ref={fileRef}
              id="csv-upload-input"
              type="file"
              accept=".csv,text/csv"
              disabled={isUploading}
              onChange={(e) => {
                setFileError('');
                setSelectedFile(e.target.files ? e.target.files[0] : null);
              }}
            />
            {fileError && <span className="field-error">{fileError}</span>}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>

        {uploadResult && (
          <div className="upload-summary">
            <p className="msg-info no-margin">
              <strong>
                {formatInteger(uploadResult.importedCount)} orders imported,{' '}
                {formatInteger(uploadResult.skippedCount)} rows skipped
              </strong>
            </p>

            {uploadResult.errors.length > 0 && (
              <details className="error-details">
                <summary>
                  View error messages (showing first{' '}
                  {Math.min(20, uploadResult.errors.length)} of{' '}
                  {formatInteger(uploadResult.errors.length)})
                </summary>
                <ul>
                  {uploadResult.errors.slice(0, 20).map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </section>

      {/* Card 3: Sample data */}
      <section className="card">
        <h2 className="card-title">Sample data</h2>
        {orders.length === 0 ? (
          <p className="text-muted">
            No orders are currently stored in the browser. Load the 612-order
            sample dataset below, add an order above, or upload a CSV file.
          </p>
        ) : (
          <p className="text-muted">
            Currently storing {formatInteger(orders.length)} orders in
            localStorage.
          </p>
        )}
        <div className="btn-group">
          <button
            type="button"
            className="btn"
            onClick={handleLoadSampleClick}
          >
            Load sample data
          </button>
          <button
            type="button"
            className="btn"
            onClick={handleClearAllClick}
            disabled={orders.length === 0}
          >
            Clear all data
          </button>
          {sampleNotice && <span className="msg-info">{sampleNotice}</span>}
        </div>
      </section>
    </div>
  );
}
