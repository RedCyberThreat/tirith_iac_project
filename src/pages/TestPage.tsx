import { useState } from "react";
import { quickScan, deepSearch } from "../api/scan";
import QuickScanResult from "../components/QuickScanResult";
import DeepSearchResult from "../components/DeepSearchResult";
import type { QuickScanResponse, DeepSearchResponse } from "../types/scan";

// Import the JSON files directly. Vite will handle the rest.
import template1 from "../../cloudFormation_template.json";
import template3 from "../../cloudFormation_template_3.json";

export default function TestPage() {
  const [quickResult, setQuickResult] = useState<QuickScanResponse | null>(
    null
  );
  const [deepResult, setDeepResult] = useState<DeepSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuickScan = async () => {
    setIsLoading(true);
    setError(null);
    setQuickResult(null); // Clear previous results
    try {
      // Pass the imported JSON object directly to the API function
      const result = await quickScan(template1);
      setQuickResult(result);
      console.log(result);
    } catch (err) {
      console.error(err); // Log the actual error for debugging
      setError("Failed to run Quick Scan. Is the backend server running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeepSearch = async () => {
    setIsLoading(true);
    setError(null);
    setDeepResult(null); // Clear previous results
    try {
      // Pass the imported JSON object directly to the API function
      const result = await deepSearch(template3);
      setDeepResult(result);
      console.log(result);
    } catch (err) {
      console.error(err); // Log the actual error for debugging
      setError("Failed to run Deep Search. Is the backend server running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Threat Scanner Test Page</h2>

      <div className="flex gap-2">
        <button
          onClick={handleQuickScan}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 rounded disabled:bg-gray-500"
        >
          {isLoading ? "Scanning..." : "Run Quick Scan (template 1)"}
        </button>
        <button
          onClick={handleDeepSearch}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 rounded disabled:bg-gray-500"
        >
          {isLoading ? "Scanning..." : "Run Deep Search (template 2)"}
        </button>
      </div>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      {quickResult && (
        <div className="mt-6">
          <h3 className="text-lg font-bold">Quick Scan Results</h3>
          <QuickScanResult result={quickResult} />
        </div>
      )}

      {deepResult && (
        <div className="mt-6">
          <h3 className="text-lg font-bold">Deep Search Results</h3>
          <DeepSearchResult result={deepResult} />
        </div>
      )}
    </div>
  );
}
