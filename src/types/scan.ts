// QuickScan type
export type QuickScanResponse = Record<string, Record<string, string>[]>;

// DeepSearch type
export interface DeepFinding {
  severity: "Low" | "Medium" | "High" | null;
  message: string;
  path: string;
  rule_solution: string;
}

export interface DeepSearchResponse {
  Resources: Record<string, DeepFinding[]>;
}
