import "../App.css";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import JaggedBox from "../components/layout/JaggedBox";
import SectionContainer from "../components/layout/SectionContainer";
import VulnerabilityItem from "../components/layout/VulnerabilityItem";
import Footer from "../components/layout/Footer";

function ReportPage() {
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
          <JaggedBox className="flex flex-col w-[600px] text-center">
            <p className="p-22 pt-23 font-orbitron text-4xl font-bold uppercase text-quaternary-red">
              drop the file.
            </p>
          </JaggedBox>
          <div className="flex w-[250px] flex-col gap-1.5">
            <JaggedBox className="text-center">
              <p className="p-4.5 font-orbitron font-bold text-primary-blue">
                File Type
              </p>
            </JaggedBox>
            <JaggedBox className="text-center">
              <p className="p-4.5 font-orbitron font-bold text-primary-blue">
                File Type
              </p>
            </JaggedBox>
            <JaggedBox className="text-center">
              <p className="p-4.5 font-orbitron font-bold text-primary-blue">
                File Type
              </p>
            </JaggedBox>
          </div>
        </div>
      </SectionContainer>
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
              sem augue, placerat hendrerit aliquam in, rhoncus et ipsum. Aenean
              a est urna. Sed vel ex accumsan, aliquam tellus viverra, eleifend
              nisl. Sed viverra bibendum tortor. Proin imperdiet mauris vel
              nulla lacinia, et gravida est porttitor. Nunc id malesuada tellus.
              Nullam et arcu ligula.
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
  );
}

export default ReportPage;
