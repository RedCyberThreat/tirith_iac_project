import type { QuickScanResponse } from "../types/scan";

interface Props {
  result: QuickScanResponse;
}

export default function QuickScanResult({ result }: Props) {
  return (
    <div>
      {Object.entries(result).map(([resource, findings]) => (
        <div key={resource} className="mb-4">
          <h3 className="font-bold">{resource}</h3>
          <ul className="ml-4 list-disc">
            {findings.map((f, i) => (
              <li key={i}>
                {Object.entries(f).map(([prop, sev]) => (
                  <span key={prop}>
                    {prop}: <strong>{sev}</strong>{" "}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
