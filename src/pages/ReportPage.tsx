import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import JaggedBox from "../components/layout/JaggedBox";
import SectionContainer from "../components/layout/SectionContainer";
import VulnerabilityItem from "../components/layout/VulnerabilityItem";
import Footer from "../components/layout/Footer";
import { FaTimes } from "react-icons/fa";

function ReportPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [scanType, setScanType] = useState<"quick" | "deep">("deep");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = (file: File | null) => {
    if (file && file.type === "application/json") {
      setUploadedFile(file);
      console.log("File selected:", file);
    } else {
      alert("Please select a valid JSON file.");
    }
  };

  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setUploadedFile(null);
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
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelected(files[0]);
    }
  };

  const truncateFileName = (name: string, maxLength: number = 25) => {
    if (name.length <= maxLength) {
      return name;
    }
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
                  className="absolute top-4 right-4 text-primary-blue hover:text-secondary-red transition-colors cursor-pointer"
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
              {uploadedFile && (
                <p className="mt-2 text-sm text-primary-blue font-orbitron font-bold tracking-wider">
                  File loaded. Ready for analysis.
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
      </SectionContainer>

      {uploadedFile && (
        <>
          <SectionContainer title="Analysis Results">
            <div className="flex gap-24 items-center justify-center">
              <div className="border-2 border-tertiary-red w-[250px] h-[250px] flex items-center justify-center bg-lighter-black">
                <div className="relative w-[225px] h-[225px] rounded-full bg-quaternary-red"></div>
                <div className="absolute w-[180px] h-[180px] rounded-full bg-lighter-black text-quaternary-red font-rajdhani flex items-center justify-center">
                  <p className="text-5xl font-bold text-center leading-6">
                    5<br />
                    <span className="text-4xl ">/5</span>
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
                <p className="p-4 py-18 text-justify">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Curabitur sem augue, placerat hendrerit aliquam in, rhoncus et
                  ipsum. Aenean a est urna. Sed vel ex accumsan, aliquam tellus
                  viverra, eleifend nisl. Sed viverra bibendum tortor. Proin
                  imperdiet mauris vel nulla lacinia, et gravida est porttitor.
                  Nunc id malesuada tellus. Nullam et arcu ligula.
                </p>
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
