// tirith-iac-security-scanner/src/api/scan.ts

import api from "./axiosInstance";
import type { QuickScanResponse, DeepSearchResponse } from "../types/scan";

// Call /api/quickscan
export async function quickScan(data: object): Promise<QuickScanResponse> {
  const res = await api.post<QuickScanResponse>("/api/quickscan", data);
  return res.data;
}

// Call /api/deepsearch
export async function deepSearch(data: string): Promise<DeepSearchResponse> {
  const res = await api.post<DeepSearchResponse>("/api/deepsearch", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
}
