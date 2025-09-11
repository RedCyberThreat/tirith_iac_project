import type { DeepSearchResponse } from "../types/scan";

interface Props {
  result: DeepSearchResponse;
}

export default function DeepSearchResult({ result }: Props) {
  return (
    <div>
      {Object.entries(result.Resources).map(([check, findings]) => (
        <div key={check} className="mb-6">
          <h3 className="font-bold">{check}</h3>
          <ul className="ml-4 list-disc">
            {findings.map((f, i) => (
              <li key={i}>
                <span
                  className={`font-semibold ${
                    f.severity === "High"
                      ? "text-red-600"
                      : f.severity === "Medium"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {f.severity ?? "Info"}
                </span>{" "}
                - {f.message}
                <br />
                <span className="text-sm text-gray-500">{f.path}</span>
                <br />
                <span className="text-sm italic">{f.rule_solution}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
