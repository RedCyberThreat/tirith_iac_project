import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import JaggedBox from "../components/layout/JaggedBox";
import SectionContainer from "../components/layout/SectionContainer";
import VulnerabilityItem from "../components/layout/VulnerabilityItem";
import Footer from "../components/layout/Footer";
import { FaTimes } from "react-icons/fa";
import { quickScan, deepSearch } from "../api/scan";
import type { QuickScanResponse, DeepSearchResponse } from "../types/scan";

function ReportPage() {
  // State to hold the uploaded file object
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // State to manage the visual feedback on drag over
  const [isDragOver, setIsDragOver] = useState(false);
  // State to manage the selected scan type, defaults to 'deep'
  const [scanType, setScanType] = useState<"quick" | "deep">("deep");
  // Ref for the hidden file input element
  const fileInputRef = useRef<HTMLInputElement>(null);
  // State for API call status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<string | null>(null);
  // State for the rule and issue counts
  const [totalRules, setTotalRules] = useState(0);
  const [totalIssues, setTotalIssues] = useState(0);
  // State for the dynamic summary message
  const [summaryMessage, setSummaryMessage] = useState("");

  // Counts the total number of resources in the uploaded CloudFormation template
  const countTotalRules = (jsonData: any) => {
    if (jsonData && jsonData.Resources) {
      return Object.keys(jsonData.Resources).length;
    }
    return 0;
  };

  // Counts the total issues found, handling both Quick Scan and Deep Search formats
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

  // Analyzes scan results to generate a dynamic summary message
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

  // Reads the selected file and triggers the chosen scan
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

        const rulesCount = countTotalRules(jsonData);
        setTotalRules(rulesCount);

        setIsLoading(true);
        setError(null);
        setTotalIssues(0);
        setSummaryMessage("");
        setAnalysisStatus(
          `Running ${scanType === "quick" ? "Quick Scan" : "Deep Search"}...`
        );

        let result;
        if (scanType === "quick") {
          result = await quickScan(jsonData);
        } else {
          result = await deepSearch(jsonData);
        }

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

  // This function is called when a file is selected
  const handleFileSelected = (file: File | null) => {
    if (file && file.type === "application/json") {
      setUploadedFile(file);
      handleFileAnalysis(file);
    } else {
      alert("Please select a valid JSON file.");
    }
  };

  // Resets the uploaded file and all related states
  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setUploadedFile(null);
    setError(null);
    setAnalysisStatus(null);
    setTotalRules(0);
    setTotalIssues(0);
    setSummaryMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag and drop handlers
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

  // Click and file change handlers
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

  // Truncates long filenames
  const truncateFileName = (name: string, maxLength: number = 25) => {
    if (name.length <= maxLength) return name;
    const start = name.substring(0, 8);
    const end = name.substring(name.length - 10);
    return `${start}...${end}`;
  };

  return (
    <>
      <Header />
      <div className="m-4">
        <Link to="/" className="text-primary-blue hover:underline">
          &larr; Back to Landing Page
        </Link>
      </div>
      <SectionContainer title="Upload File">
        <div className="flex gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/json"
            className="hidden"
          />
          <JaggedBox
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className="w-[600px] h-[200px] cursor-pointer"
            innerClassName={isDragOver ? "bg-tertiary-red/50" : ""}
          >
            <div className="relative flex flex-col h-full text-center justify-center items-center">
              {uploadedFile && (
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-4 right-4 text-primary-blue hover:text-secondary-red transition-colors"
                  aria-label="Remove file"
                >
                  <FaTimes size={24} />
                </button>
              )}
              <p className="p-4 font-orbitron text-4xl font-bold uppercase text-quaternary-red">
                {uploadedFile
                  ? truncateFileName(uploadedFile.name)
                  : "drop the file."}
              </p>
              {analysisStatus && (
                <p className="mt-2 text-sm text-primary-blue font-orbitron font-bold tracking-wider">
                  {analysisStatus}
                </p>
              )}
            </div>
          </JaggedBox>

          <div className="flex flex-col w-[250px] gap-1.5">
            <JaggedBox className="text-center">
              <p className="p-4 font-orbitron font-bold text-primary-blue truncate">
                {uploadedFile ? uploadedFile.name : "No file selected"}
              </p>
            </JaggedBox>
            <JaggedBox className="text-center">
              <p className="p-4 font-orbitron font-bold text-primary-blue">
                {uploadedFile
                  ? `${(uploadedFile.size / 1024).toFixed(2)} KB`
                  : "File Size"}
              </p>
            </JaggedBox>

            <div className="flex-grow flex items-end">
              <div className="flex w-full gap-1.5">
                <div
                  onClick={() => setScanType("quick")}
                  className="cursor-pointer w-1/2"
                >
                  <JaggedBox
                    className="text-center"
                    innerClassName={
                      scanType === "quick" ? "bg-primary-blue" : "bg-black/40"
                    }
                  >
                    <p
                      className={`p-4 font-orbitron font-bold ${
                        scanType === "quick"
                          ? "text-black"
                          : "text-primary-blue"
                      }`}
                    >
                      Quick
                    </p>
                  </JaggedBox>
                </div>
                <div
                  onClick={() => setScanType("deep")}
                  className="cursor-pointer w-1/2"
                >
                  <JaggedBox
                    className="text-center"
                    innerClassName={
                      scanType === "deep" ? "bg-primary-blue" : "bg-black/40"
                    }
                  >
                    <p
                      className={`p-4 font-orbitron font-bold ${
                        scanType === "deep" ? "text-black" : "text-primary-blue"
                      }`}
                    >
                      Deep
                    </p>
                  </JaggedBox>
                </div>
              </div>
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </SectionContainer>

      {uploadedFile && !isLoading && (
        <>
          <SectionContainer title="Analysis Results">
            <div className="flex gap-24 items-center justify-center">
              <div className="border-2 border-tertiary-red w-[250px] h-[250px] flex items-center justify-center bg-lighter-black">
                <div className="relative w-[225px] h-[225px] rounded-full bg-quaternary-red"></div>
                <div className="absolute w-[180px] h-[180px] rounded-full bg-lighter-black text-quaternary-red font-rajdhani flex items-center justify-center">
                  <p className="text-5xl font-bold text-center leading-6">
                    {totalIssues}
                    <br />
                    <span className="text-4xl ">/{totalRules}</span>
                  </p>
                  <div
                    id="point-circle"
                    className="h-4 w-4 rounded-full bg-secondary-red absolute bottom-35 left-41"
                  ></div>
                  <div
                    id="point-line1"
                    className="h-0.5 w-6 bg-secondary-red absolute bottom-39 left-43 -rotate-42"
                  ></div>
                  <div
                    id="point-line2"
                    className="h-0.5 w-36 z-2 bg-secondary-red absolute bottom-[162.9px] left-48 "
                  ></div>
                </div>
              </div>
              <JaggedBox className="h-[250px] w-[600px] font-orbitron text-sm font-bold text-quaternary-red">
                <p className="p-4 py-18 text-justify">{summaryMessage}</p>
              </JaggedBox>
            </div>
            <div className="flex mt-6 font-rajdhani text-primary-blue mb-4 gap-4 ml-16 -mr-8">
              <div className="w-[20.9%] text-3xl border-tertiary-red border-2 leading-none pt-0.5 font-light">
                Rule
              </div>
              <div className="w-[20.9%] text-3xl border-tertiary-red border-2 leading-none pt-0.5 font-light ml-1">
                Description
              </div>
              <div className="w-[20.8%] text-3xl border-tertiary-red border-2 leading-none pt-0.5 font-light ml-1">
                Line
              </div>
              <div className="w-[33.2%] text-3xl border-tertiary-red border-2 leading-none pt-0.5 font-light">
                Recommendations
              </div>
            </div>
            <VulnerabilityItem />
            <VulnerabilityItem />
            <VulnerabilityItem />
          </SectionContainer>
          <Footer />
        </>
      )}
    </>
  );
}

export default ReportPage;
