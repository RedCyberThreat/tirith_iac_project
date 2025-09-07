import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import type {
  QuickScanResponse,
  DeepSearchResponse,
  DeepFinding,
} from "../types/scan";
import { quickScan, deepSearch } from "../api/scan";
import "../App.css";

type ProcessedQuickResult = {
  resource: string;
  rule: string;
  severity: string;
};

type ProcessedDeepResult = {
  rule: string;
  description: string;
  line: string;
  recommendation: string;
  severity: string | null;
};

type ProcessedResult = ProcessedQuickResult | ProcessedDeepResult;

// Define the Header component LandingPage-like
const HeaderComponent = () => (
  <header className="bg-[#2d110f] p-4 font-rajdhani">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center justify-center w-12 h-12 gap-1 rounded-full bg-sky-500 ">
          <span className="block w-8 h-1.5 bg-red-800 rounded-full"></span>
          <span className="block w-8 h-1.5 bg-red-800 rounded-full"></span>
          <span className="block w-8 h-1.5 bg-red-800 rounded-full"></span>
        </div>
        <h1 className="text-4xl text-sky-400 font-bold">IaC - Tirith</h1>
      </div>
      <nav className="flex gap-4 text-sky-400">
        <a href="#features" className="hover:text-sky-300">Features</a>
        <a href="#about" className="hover:text-sky-300">About</a>
        <a href="#cta" className="hover:text-sky-300">Get Started</a>
      </nav>
    </div>
  </header>
);

// Define the Footer component LandingPage-like
const FooterComponent = ({ className }: { className?: string }) => (
  <footer className={`bg-[#2d110f] text-center text-sky-400 p-4 ${className}`}>
    <p>&copy; 2025 IaC - Tirith. All rights reserved.</p>
  </footer>
);

// Define the SectionContainer as for the LandingPage
const SectionContainerComponent = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div className="border-2 border-[#652821] p-2 rounded-lg bg-[#361519] bg-opacity-50 shadow-lg my-8">
    {title && <h2 className="text-3xl font-bold text-sky-400 font-rajdhani text-center mb-4">{title}</h2>}
    {children}
  </div>
);

// Define the JaggedBox component as for the LandingPage
const JaggedBoxComponent = ({ children, className, type, innerClassName, ...props }: { children: React.ReactNode; className?: string; type?: string; innerClassName?: string; [key: string]: any }) => {
  const baseClasses = "border-2 border-[#652821] bg-[#361519] p-4";
  const lighterBg = type === 'lighter' ? 'bg-[#4a1c23]' : '';
  const combinedClasses = `${baseClasses} ${lighterBg} ${className} ${innerClassName}`;
  return <div className={combinedClasses} {...props}>{children}</div>;
};

// New/updated VulnerabilityItem component to handle both scan types
const VulnerabilityItem = ({
  scanType,
  ...props
}: {
  scanType: "quick" | "deep";
} & (ProcessedQuickResult | ProcessedDeepResult)) => {
  const getSeverityColor = (severity: string | null) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-sky-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="flex font-rajdhani text-stone-200 mb-2 gap-4 text-center">
      {scanType === "quick" ? (
        <JaggedBoxComponent className="flex w-full">
          <div className="w-[30%] text-2xl md:text-3xl text-sky-400 p-2 leading-none font-light text-center bg-[#361519]">
            {(props as ProcessedQuickResult).rule}
          </div>
          <div className="w-[40%] text-2xl md:text-3xl text-sky-400 p-2 leading-none font-light text-center bg-[#361519]">
            {(props as ProcessedQuickResult).resource}
          </div>
          <div
            className={`w-[30%] text-2xl md:text-3xl p-2 leading-none font-light text-center bg-[#361519] ${getSeverityColor(
              (props as ProcessedQuickResult).severity
            )}`}
          >
            {(props as ProcessedQuickResult).severity}
          </div>
        </JaggedBoxComponent>
      ) : (
        <JaggedBoxComponent className="flex w-full">
          <div className="w-[20%] text-2xl md:text-3xl text-sky-400 p-2 leading-none font-light text-center bg-[#361519]">
            {(props as ProcessedDeepResult).rule}
          </div>
          <div className="w-[25%] text-2xl md:text-3xl text-sky-400 p-2 leading-none font-light text-center bg-[#361519]">
            {(props as ProcessedDeepResult).description}
          </div>
          <div className="w-[15%] text-2xl md:text-3xl text-sky-400 p-2 leading-none font-light text-center bg-[#361519]">
            {(props as ProcessedDeepResult).line}
          </div>
          <div
            className={`w-[15%] text-2xl md:text-3xl p-2 leading-none font-light text-center bg-[#361519] ${getSeverityColor(
              (props as ProcessedDeepResult).severity
            )}`}
          >
            {(props as ProcessedDeepResult).severity}
          </div>
          <div className="w-[25%] text-2xl md:text-3xl text-sky-400 p-2 leading-none font-light text-center bg-[#361519]">
            {(props as ProcessedDeepResult).recommendation}
          </div>
        </JaggedBoxComponent>
      )}
    </div>
  );
};

function ReportPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [scanType, setScanType] = useState<"quick" | "deep">("deep");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<string | null>(null);
  const [totalRules, setTotalRules] = useState(0);
  const [totalIssues, setTotalIssues] = useState(0);
  const [summaryMessage, setSummaryMessage] = useState("");
  const [processedResults, setProcessedResults] = useState<ProcessedResult[]>(
    []
  );
  const [scanResult, setScanResult] = useState<
    QuickScanResponse | DeepSearchResponse | null
  >(null);

  const countTotalIssues = (
    scanResult: QuickScanResponse | DeepSearchResponse,
    type: "quick" | "deep"
  ) => {
    let count = 0;
    if (type === "quick") {
      const quickScanResult = scanResult as QuickScanResponse;
      Object.values(quickScanResult).forEach((findingsArray) => {
        findingsArray.forEach((finding) => {
          count += Object.keys(finding).length;
        });
      });
    } else {
      const deepSearchResult = scanResult as DeepSearchResponse;
      if (deepSearchResult.Resources) {
        Object.values(deepSearchResult.Resources).forEach((findingsArray) => {
          count += findingsArray.length;
        });
      }
    }
    return count;
  };

  const generateSummary = (
    scanResult: QuickScanResponse | DeepSearchResponse,
    type: "quick" | "deep",
    rulesCount: number
  ) => {
    const severityCounts = { High: 0, Medium: 0, Low: 0, Unclassified: 0 };

    if (type === "quick") {
      const quickScanResult = scanResult as QuickScanResponse;
      Object.values(quickScanResult).forEach((findings) => {
        findings.forEach((finding) => {
          Object.values(finding).forEach((severity) => {
            if (severity === "High") severityCounts.High++;
            else if (severity === "Medium") severityCounts.Medium++;
            else if (severity === "Low") severityCounts.Low++;
            else severityCounts.Unclassified++;
          });
        });
      });
    } else {
      const deepSearchResult = scanResult as DeepSearchResponse;
      if (deepSearchResult.Resources) {
        Object.values(deepSearchResult.Resources).forEach((findings) => {
          findings.forEach((finding) => {
            if (finding.severity === "High") severityCounts.High++;
            else if (finding.severity === "Medium") severityCounts.Medium++;
            else if (finding.severity === "Low") severityCounts.Low++;
            else severityCounts.Unclassified++;
          });
        });
      }
    }

    const issuesCount =
      severityCounts.High +
      severityCounts.Medium +
      severityCounts.Low +
      severityCounts.Unclassified;
    const issueRatio = rulesCount > 0 ? issuesCount / rulesCount : 0;

    let level = "Safe";
    if (severityCounts.High > 0 || issueRatio > 0.5) {
      level = "Unsecure";
    } else if (severityCounts.Medium > 0 || issueRatio > 0.2) {
      level = "Discrete";
    }

    return `Your CloudFormation template is considered ${level}. You have ${severityCounts.Low} low issues, ${severityCounts.Medium} medium issues, ${severityCounts.High} high issues, and ${severityCounts.Unclassified} unclassified issues.`;
  };

  const handleFileAnalysis = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileContent = event.target?.result;
        if (typeof fileContent !== "string") {
          setError("Failed to read file content.");
          return;
        }
        const jsonData = JSON.parse(fileContent);

        setIsLoading(true);
        setError(null);
        setTotalIssues(0);
        setSummaryMessage("");
        setProcessedResults([]);
        setAnalysisStatus(
          `Running ${scanType === "quick" ? "Quick Scan" : "Deep Search"}...`
        );

        let result;
        let rulesCount = 0;
        if (scanType === "quick") {
          console.log("Making a quick scan API call with POST method...");
          result = await quickScan(jsonData);
          // Correctly count the number of individual rule findings
          Object.values(result).forEach((resourceFindings) => {
            resourceFindings.forEach((finding) => {
              rulesCount += Object.keys(finding).length;
            });
          });
          setScanResult(result);
          const processed: ProcessedQuickResult[] = [];
          const quickScanResult = result as QuickScanResponse;
          for (const resource in quickScanResult) {
            quickScanResult[resource].forEach((finding) => {
              for (const rule in finding) {
                processed.push({
                  resource,
                  rule,
                  severity: finding[rule],
                });
              }
            });
          }
          setProcessedResults(processed);
        } else {
          console.log("Making a deep scan API call with POST method...");
          result = await deepSearch(fileContent);
          if (jsonData && jsonData.Resources) {
              rulesCount = Object.keys(jsonData.Resources).length;
          }
          setScanResult(result);
          const processed: ProcessedDeepResult[] = [];
          const deepScanResult = result as DeepSearchResponse;

          if (deepScanResult && deepScanResult.Resources) {
            for (const [rule, findings] of Object.entries(
              deepScanResult.Resources
            )) {
              if (Array.isArray(findings)) {
                findings.forEach((finding: DeepFinding) => {
                  let line = "N/A";
                  if (finding.path && finding.path !== "not found") {
                    line = finding.path.replace(":", " | ");
                  }
                  processed.push({
                    rule: rule,
                    description: finding.message,
                    line: line,
                    recommendation: finding.rule_solution,
                    severity: finding.severity,
                  });
                });
              }
            }
          }
          setProcessedResults(processed);
        }
        setTotalRules(rulesCount);
        const issuesCount = countTotalIssues(result, scanType);
        setTotalIssues(issuesCount);

        const summary = generateSummary(result, scanType, rulesCount);
        setSummaryMessage(summary);

        setAnalysisStatus("Analysis Complete.");
      } catch (err) {
        console.error(err);
        setError(
          "An error occurred during analysis. Check the console and ensure the backend is running."
        );
        setAnalysisStatus("Analysis Failed.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
    };
    reader.readAsText(file);
  };

  const handleFileSelected = (file: File | null) => {
    if (file && file.type === "application/json") {
      setUploadedFile(file);
      handleFileAnalysis(file);
    } else {
      alert("Please select a valid JSON file.");
    }
  };

  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setUploadedFile(null);
    setError(null);
    setAnalysisStatus(null);
    setTotalRules(0);
    setTotalIssues(0);
    setSummaryMessage("");
    setProcessedResults([]);
    setScanResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelected(files[0]);
    }
  };

  const handleClick = () => {
    if (!uploadedFile) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelected(files[0]);
    }
  };

  const truncateFileName = (name: string, maxLength: number = 25) => {
    if (name.length <= maxLength) return name;
    const start = name.substring(0, 8);
    const end = name.substring(name.length - 10);
    return `${start}...${end}`;
  };

  return (
    <div className="bg-[#1a0a09] text-stone-200 min-h-screen flex flex-col">
      <HeaderComponent />
      <main className="container mx-auto px-4 flex-grow">
        <div className="m-4">
          <Link to="/" className="text-sky-400 hover:underline">
            &larr; Back to Landing Page
          </Link>
        </div>
        <SectionContainerComponent title="Upload File">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center md:items-start">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/json"
              className="hidden"
            />
            <JaggedBoxComponent
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
              className={`w-full md:w-[600px] h-[200px] cursor-pointer relative ${
                isDragOver ? "bg-[#4a1c23]" : ""
              }`}
            >
              <div className="relative flex flex-col h-full text-center justify-center items-center">
                {uploadedFile && (
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-4 right-4 text-sky-400 hover:text-[#e47c7c] transition-colors"
                    aria-label="Remove file"
                  >
                    <FaTimes size={24} />
                  </button>
                )}
                <p className="p-4 font-orbitron text-4xl font-bold uppercase text-[#e47c7c]">
                  {uploadedFile
                    ? truncateFileName(uploadedFile.name)
                    : "drop the file."}
                </p>
                {analysisStatus && (
                  <p className="mt-2 text-sm text-sky-400 font-orbitron font-bold tracking-wider">
                    {analysisStatus}
                  </p>
                )}
              </div>
            </JaggedBoxComponent>

            <div className="flex flex-col w-full md:w-[250px] gap-1.5">
              <JaggedBoxComponent className="text-center h-1/3 flex items-center justify-center">
                <p className="p-4 font-orbitron font-bold text-sky-400 truncate">
                  {uploadedFile ? uploadedFile.name : "No file selected"}
                </p>
              </JaggedBoxComponent>
              <JaggedBoxComponent className="text-center h-1/3 flex items-center justify-center">
                <p className="p-4 font-orbitron font-bold text-sky-400">
                  {uploadedFile
                    ? `${(uploadedFile.size / 1024).toFixed(2)} KB`
                    : "File Size"}
                </p>
              </JaggedBoxComponent>
              <div className="flex-grow flex items-end">
                <div className="flex w-full gap-1.5">
                  <div onClick={() => setScanType("quick")} className="cursor-pointer w-1/2">
                    <JaggedBoxComponent
                      className="text-center h-full"
                      innerClassName={
                        scanType === "quick" ? "bg-sky-400" : "bg-[#361519]"
                      }
                    >
                      <p
                        className={`p-4 font-orbitron font-bold ${
                          scanType === "quick" ? "text-[#361519]" : "text-sky-400"
                        }`}
                      >
                        Quick
                      </p>
                    </JaggedBoxComponent>
                  </div>
                  <div onClick={() => setScanType("deep")} className="cursor-pointer w-1/2">
                    <JaggedBoxComponent
                      className="text-center h-full"
                      innerClassName={
                        scanType === "deep" ? "bg-sky-400" : "bg-[#361519]"
                      }
                    >
                      <p
                        className={`p-4 font-orbitron font-bold ${
                          scanType === "deep" ? "text-[#361519]" : "text-sky-400"
                        }`}
                      >
                        Deep
                      </p>
                    </JaggedBoxComponent>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 mt-4 text-center font-sans">{error}</p>}
        </SectionContainerComponent>

        {uploadedFile && !isLoading && (
          <SectionContainerComponent title="Analysis Results">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
              <div className="relative w-[250px] h-[250px] flex items-center justify-center border-2 border-[#652821] bg-[#361519]">
                <div className="relative w-[225px] h-[225px] rounded-full bg-[#e47c7c]"></div>
                <div className="absolute w-[180px] h-[180px] rounded-full bg-[#1a0a09] text-[#e47c7c] font-rajdhani flex flex-col items-center justify-center">
                  <p className="text-5xl font-bold text-center leading-6">
                    {totalIssues}
                  </p>
                  <p className="text-4xl font-light text-center">
                    /{totalRules}
                  </p>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div id="point-circle" className="h-4 w-4 rounded-full bg-[#ff7373] absolute -top-[125px] left-[75px]"></div>
                  <div id="point-line1" className="h-0.5 w-6 bg-[#ff7373] absolute -top-[120px] left-[85px] rotate-[10deg]"></div>
                  <div id="point-line2" className="h-0.5 w-36 bg-[#ff7373] absolute -top-[115px] left-[105px]"></div>
                </div>
              </div>
              <JaggedBoxComponent className="h-full w-full md:w-[600px] font-orbitron text-sm font-bold text-[#e47c7c]">
                <p className="p-4 text-justify">{summaryMessage}</p>
              </JaggedBoxComponent>
            </div>

            <div className="mt-8 overflow-x-auto">
              {scanType === "quick" && processedResults.length > 0 && (
                <>
                  <div className="flex font-rajdhani text-sky-400 mb-2 gap-4">
                    <div className="w-[30%] text-2xl md:text-3xl border-[#652821] border-2 p-2 leading-none font-light text-center bg-[#361519]">
                      Rule
                    </div>
                    <div className="w-[40%] text-2xl md:text-3xl border-[#652821] border-2 p-2 leading-none font-light text-center bg-[#361519]">
                      Resource
                    </div>
                    <div className="w-[30%] text-2xl md:text-3xl border-[#652821] border-2 p-2 leading-none font-light text-center bg-[#361519]">
                      Severity
                    </div>
                  </div>
                  {processedResults.map((item, index) => (
                    <VulnerabilityItem
                      key={index}
                      scanType="quick"
                      {...(item as ProcessedQuickResult)}
                    />
                  ))}
                </>
              )}

              {scanType === "deep" && processedResults.length > 0 && (
                <>
                  <div className="flex font-rajdhani text-sky-400 mb-2 gap-4">
                    <div className="w-[20%] text-2xl md:text-3xl border-[#652821] border-2 p-2 leading-none font-light text-center bg-[#361519]">
                      Rule
                    </div>
                    <div className="w-[25%] text-2xl md:text-3xl border-[#652821] border-2 p-2 leading-none font-light text-center bg-[#361519]">
                      Description
                    </div>
                    <div className="w-[15%] text-2xl md:text-3xl border-[#652821] border-2 p-2 leading-none font-light text-center bg-[#361519]">
                      Line
                    </div>
                    <div className="w-[15%] text-2xl md:text-3xl border-[#652821] border-2 p-2 leading-none font-light text-center bg-[#361519]">
                      Severity
                    </div>
                    <div className="w-[25%] text-2xl md:text-3xl border-[#652821] border-2 p-2 leading-none font-light text-center bg-[#361519]">
                      Recommendations
                    </div>
                  </div>
                  {processedResults.map((item, index) => (
                    <VulnerabilityItem
                      key={index}
                      scanType="deep"
                      {...(item as ProcessedDeepResult)}
                    />
                  ))}
                </>
              )}
            </div>
          </SectionContainerComponent>
        )}
      </main>
      <FooterComponent className="mt-8" />
    </div>
  );
}

export default ReportPage;


