import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


// --- Preloader Component ---
// This is the animation component we created.
interface PreloaderProps {
  onLoadingComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
  const [beaconsLit, setBeaconsLit] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    // Fun time :)
    const timers = [
      setTimeout(() => setBeaconsLit(1), 1200), // First beacon
      setTimeout(() => {
        setBeaconsLit(2); // Central Eye ignites
        setIsShaking(true); // Trigger screen shake
      }, 1800),
      setTimeout(() => setIsShaking(false), 2100), // End screen shake
      setTimeout(() => setBeaconsLit(3), 2400), // Third beacon
      setTimeout(onLoadingComplete, 4500), // Complete the whole sequence
    ];

    // Cleanup function to clear all timers if the component unmounts
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0a09] overflow-hidden">
      <div className={`preloader-container ${isShaking ? 'shake' : ''} relative w-full max-w-lg mx-auto`}>
        
        <div className="scanner-beam" />

        <svg
          className="w-full h-auto text-[#2d110f] opacity-70"
          viewBox="0 0 500 200"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 200 L100 80 L180 150 L250 50 L320 150 L400 80 L500 200 Z"
            fill="currentColor"
            className="stroke-[#652821] stroke-1"
            style={{ filter: 'drop-shadow(0 0 5px rgba(101, 40, 33, 0.5))' }}
          />
          {/* Side Beacons */}
          <circle cx="120" cy="95" r="5" className={`beacon ${beaconsLit >= 1 ? 'lit' : ''}`} />
          <circle cx="380" cy="95" r="5" className={`beacon ${beaconsLit >= 3 ? 'lit' : ''}`} />

          {/* Central Eye Beacon (using a group for more detail) */}
          <g className={`eye ${beaconsLit >= 2 ? 'lit' : ''}`}>
            <circle cx="250" cy="65" r="8" /> {/* Outer glow */}
            <circle cx="250" cy="65" r="3" fill="#1a0a09" /> {/* Pupil */}
          </g>
        </svg>
      </div>
    </div>
  );
};

// Placeholder icons
const GrStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);
const IoMdCog = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/><circle cx="12" cy="12" r="3"/><path d="M12 8a4.94 4.94 0 0 0-4.6 4H12a4.94 4.94 0 0 0 4.6-4Z"/><path d="M12 16a4.94 4.94 0 0 1-4.6-4H12a4.94 4.94 0 0 1 4.6 4Z"/></svg>
);
const GiWaterDrop = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>
);

// Header component using original color scheme with Tailwind JIT values
const Header = () => (
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

// Footer component using original color scheme
const Footer = ({ className }: { className?: string }) => (
  <footer className={`bg-[#2d110f] text-center text-sky-400 p-4 ${className}`}>
    <p>&copy; 2025 IaC - Tirith. All rights reserved.</p>
    <div className="mt-2 text-sm">
      <Link to="/terms-and-conditions" className="hover:text-sky-300">
        Terms & Conditions
      </Link>
    </div>
  </footer>
);

const SectionContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="border-2 border-[#652821] p-2 rounded-lg bg-[#361519] bg-opacity-50 shadow-lg">
    {children}
  </div>
);

// FeatureCard using original color scheme
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-[#361519] border-2 border-[#652821] text-stone-300 p-6 rounded-lg text-center flex flex-col items-center w-full md:w-1/3">
    <div className="text-sky-400 text-5xl mb-4">{icon}</div>
    <h3 className="font-bold text-lg mb-2 font-orbitron">{title}</h3>
    <p className="text-sm">{description}</p>
  </div>
);

// JaggedBox using original color scheme
const JaggedBox = ({ children, className, type }: { children: React.ReactNode; className?: string; type?: string }) => {
    const baseClasses = "border-2 border-[#652821] bg-[#361519] p-4";
    const lighterBg = type === 'lighter' ? 'bg-[#4a1c23]' : '';
    return <div className={`${baseClasses} ${lighterBg} ${className}`}>{children}</div>
};


const iconFeatures = [
  {
    icon: <GrStar />,
    title: "Proactive Security",
    description: "Identify vulnerabilities in your CloudFormation templates before deployment, shifting security left in your development lifecycle.",
  },
  {
    icon: <IoMdCog />,
    title: "Effortless Workflow",
    description: "No CLI, no complex setups. A simple web interface means you can scan your templates and get results in seconds.",
  },
  {
    icon: <GiWaterDrop />,
    title: "Clear & Actionable",
    description: "Receive detailed reports that don't just point out issues but also provide clear guidance on how to remediate them.",
  },
];

function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };
  return (
    <>
      {isLoading && <Preloader onLoadingComplete={handleLoadingComplete} />}
      
      <div className={`bg-[#1a0a09] text-stone-200 transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Header />
        <main className="container mx-auto px-4">
          <section>
            <div className="font-orbitron p-8 md:p-16 text-center flex flex-col items-center">
              <h1 className="text-4xl md:text-5xl leading-snug font-bold text-sky-400">
                Tirith: Your Cloud Guardian <br/>🛡️
              </h1>
              <p className="text-sm md:text-base w-full md:w-2/3 mx-auto mt-4 text-justify text-stone-300 font-sans">
                Tirith is a powerful and intuitive tool designed to fortify your cloud infrastructure at the very beginning of its lifecycle. As a CloudFormation security scanner, Tirith allows you to proactively identify and address vulnerabilities in your IaC templates before they are ever deployed. Our mission is to make cloud security accessible to everyone, from individual developers to large enterprises, by providing a simple, fast, and actionable scanning solution.
              </p>
                <Link
                  to="/report"
                  className="px-8 py-3 mt-8 font-bold rounded-md bg-sky-500 text-black hover:bg-sky-400 transition-colors"
                >
                  Go to Analyzer
                </Link>
            </div>
          </section>

          <section id="features" className="py-12">
            <div className="flex flex-col md:flex-row p-4 md:p-8 justify-between items-center gap-8">
              <div className="w-full md:w-1/2 font-orbitron text-stone-300">
                <h2 className="text-3xl md:text-4xl leading-snug font-bold text-white">
                  The Effortless Way to Secure Your Cloud
                </h2>
                <div className="text-sm md:text-base w-full md:w-5/6 mt-4 font-sans">
                  <p className="text-justify mb-4">
                   Tirith stands apart from traditional security scanners with its emphasis on ease of use and accessibility. While most scanners require you to download and run complex programs via the command line, Tirith operates entirely as a web application. You no longer need to navigate intricate CLI commands or manage software dependencies. With Tirith, securing your infrastructure is as simple as:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Upload:</strong> Select your CloudFormation template from your local machine.
                    </li>
                    <li>
                      <strong>Scan:</strong> Click a single button.
                    </li>
                    <li>
                     <strong>Review:</strong> Receive an instant, clear report that not only highlights potential vulnerabilities but also provides detailed explanations of what each issue is and actionable guidance on how to fix it.
                    </li>
                  </ul>
                   <p className="text-justify mt-4">
                     This straightforward approach empowers you to integrate security into your development workflow without disruption, making it an ideal solution for teams focused on speed and efficiency.
                   </p>
                </div>
              </div>
              <div className="w-full md:w-2/5">
                <SectionContainer>
                  <img
                    src="https://placehold.co/600x400/2d110f/87ceeb?text=Easy+Upload+UI"
                    alt="Effortless Scanning UI"
                    className="w-full h-auto rounded-md"
                  />
                </SectionContainer>
              </div>
            </div>
          </section>

          <section id="about" className="py-12">
            <div className="flex flex-col md:flex-row-reverse p-4 md:p-8 justify-between items-center gap-8">
              <div className="w-full md:w-1/2 font-orbitron text-stone-300">
                <h2 className="text-3xl md:text-4xl leading-snug font-bold text-white">
                  Our Journey: From Concept to Open-Source
                </h2>
                <div className="text-sm md:text-base w-full md:w-5/6 mt-4 font-sans">
                  <p className="text-justify">
                    Tirith was born from a common frustration with the complexity of existing IaC security tools. We recognized a need for a simpler, more streamlined approach that could be easily adopted by any developer. This project was crafted from the ground up to address that need, with a vision of creating a transparent and community-driven solution.
                  </p>
                   <p className="text-justify mt-4">
                     We built Tirith's robust backend using Flask, a lightweight and versatile Python framework, to ensure high performance and reliability. The architecture is designed to efficiently process and analyze templates, delivering fast and accurate results. Now that the project has reached a stable foundation, we are excited to announce that Tirith will be an open-source project, allowing the community to contribute to its growth and evolution. By making Tirith open and accessible, we hope to build a collaborative environment where we can all work together to create a safer cloud for everyone.
                   </p>
                </div>
              </div>
               <div className="w-full md:w-2/5">
                <SectionContainer>
                  <img
                     src="https://placehold.co/600x400/2d110f/87ceeb?text=Open+Source"
                    alt="Open Source Journey"
                    className="w-full h-auto rounded-md"
                  />
                </SectionContainer>
              </div>
            </div>
          </section>

          <section className="p-8 md:p-16">
            <div className="flex flex-col md:flex-row justify-around gap-8">
              {iconFeatures.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </section>

          <section id="cta" className="bg-[#2d110f] p-4 md:p-8 rounded-lg my-12">
             <JaggedBox className="text-stone-300" type="lighter">
               <div className="flex flex-col md:flex-row justify-between items-center ml-4 md:ml-12">
                 <div className="self-center text-center md:text-left">
                   <h2 className="uppercase text-5xl md:text-7xl font-orbitron font-bold text-sky-400">
                     Ready to <br />
                     Get Started?
                   </h2>
                   <div className="flex flex-col md:flex-row mt-10 gap-8 font-orbitron text-sky-400 font-bold">
                      <Link to="/report" className="w-full md:w-72 h-16 flex items-center justify-center text-center bg-[#361519] border-2 border-[#652821] hover:bg-[#4a1c23] transition-colors rounded-md text-white">
                         Scan A Template
                      </Link>
                      <a href="https://github.com/RedCyberThreat/tirith-iac-security-scanner" target="_blank" rel="noopener noreferrer" className="w-full md:w-72 h-16 flex items-center justify-center text-center bg-[#361519] border-2 border-[#652821] hover:bg-[#4a1c23] transition-colors rounded-md text-white">
                         View on GitHub
                      </a>
                   </div>
                 </div>
                 <img className="w-3/5 md:w-2/5 p-4 hidden md:block" src="https://placehold.co/400x300/2d110f/87ceeb?text=Secure+Now" alt="Call to Action" />
               </div>
             </JaggedBox>
          </section>
        </main>
        <Footer className="pb-8" />
      </div>
    </>
  );
}

export default LandingPage;
