import React from 'react';
import { Link } from 'react-router-dom';
// --- Helper Components

// Header component using Tailwind JIT values
const Header = () => (
  <header className="bg-[#2d110f] p-4 font-rajdhani">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center w-12 h-12 gap-1 rounded-full bg-sky-500 ">
                <span className="block w-8 h-1.5 bg-red-800 rounded-full"></span>
                <span className="block w-8 h-1.5 bg-red-800 rounded-full"></span>
                <span className="block w-8 h-1.5 bg-red-800 rounded-full"></span>
            </div>
            <h1 className="text-4xl text-sky-400 font-bold">IaC - Tirith</h1>
          </Link>
      </div>
      <nav className="flex gap-4 text-sky-400">
        <Link to="/#features" className="hover:text-sky-300">Features</Link>
        <Link to="/#about" className="hover:text-sky-300">About</Link>
        <Link to="/report" className="hover:text-sky-300">Get Started</Link>
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

const SectionContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`border-2 border-[#652821] p-6 md:p-8 rounded-lg bg-[#361519] bg-opacity-50 shadow-lg ${className}`}>
    {children}
  </div>
);


function TermsAndConditions() {
  return (
    <div className="bg-[#1a0a09] text-stone-200">
      <Header />
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="font-orbitron text-center mb-12">
          <h1 className="text-4xl md:text-5xl leading-snug font-bold text-sky-400">
            Terms and Conditions
          </h1>
          <p className="text-stone-400 mt-2">Last Updated: September 24, 2025</p>
        </div>

        <SectionContainer className="font-sans text-stone-300 space-y-6">
            <p>
                Welcome to IaC - Tirith ("we," "us," or "our"). These Terms and Conditions govern your use of our website and our AWS CloudFormation security scanning service (the "Service"). By accessing or using our Service, you agree to be bound by these terms.
            </p>

            {/* --- Section Template --- */}
            <div>
              <h2 className="font-orbitron text-2xl font-bold text-sky-400 mb-2">1. Description of Service</h2>
              <p className="text-justify">
                IaC - Tirith provides an automated tool for scanning AWS CloudFormation templates (Infrastructure as Code) to identify potential security misconfigurations and vulnerabilities. The results are provided for informational purposes only to help you improve your cloud infrastructure security.
              </p>
            </div>

            <div>
              <h2 className="font-orbitron text-2xl font-bold text-sky-400 mb-2">2. User Responsibilities</h2>
              <p className="text-justify">
                You are solely responsible for the content of the templates you upload. You agree not to upload any templates that contain sensitive personal data, production secrets, access keys, or any other confidential information. You acknowledge that you are responsible for validating the results of the scan and for the security of any infrastructure deployed from your templates.
              </p>
            </div>

            <div>
              <h2 className="font-orbitron text-2xl font-bold text-sky-400 mb-2">3. Data Handling and Privacy</h2>
              <p className="text-justify">
                We are committed to protecting your privacy. The CloudFormation templates you upload are processed in memory for the sole purpose of conducting the security analysis. **We do not store your templates or the results of your scans on our servers after the analysis is complete and the session ends.** We do not collect any personal information through the scanning process.
              </p>
            </div>

            <div>
              <h2 className="font-orbitron text-2xl font-bold text-sky-400 mb-2">4. No Guarantees and Disclaimer of Warranty</h2>
              <p className="text-justify">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. IaC - Tirith makes no guarantee that the Service will identify all potential security vulnerabilities or misconfigurations in your templates. The analysis is based on a predefined set of rules and may not be exhaustive. We disclaim all warranties, express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </div>

            <div>
              <h2 className="font-orbitron text-2xl font-bold text-sky-400 mb-2">5. Limitation of Liability</h2>
              <p className="text-justify">
                In no event shall IaC - Tirith, its creators, or its contributors be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, data, or other intangible losses resulting from the use or inability to use the Service. You agree that you use the Service at your own risk and are solely responsible for any damages to your systems or loss of data that results from such use.
              </p>
            </div>
            
            <div>
              <h2 className="font-orbitron text-2xl font-bold text-sky-400 mb-2">6. Intellectual Property</h2>
              <p className="text-justify">
                The IaC - Tirith software is an open-source project. You are free to use, modify, and distribute the source code in accordance with its open-source license, available on our GitHub repository. All content on this website, including text, graphics, and logos, is the property of IaC - Tirith unless otherwise stated.
              </p>
            </div>

            <div>
              <h2 className="font-orbitron text-2xl font-bold text-sky-400 mb-2">7. Changes to Terms</h2>
              <p className="text-justify">
                We reserve the right to modify these Terms and Conditions at any time. We will notify you of any changes by posting the new terms on this page. You are advised to review this page periodically for any changes. Changes are effective when they are posted on this page.
              </p>
            </div>
            
            <div>
              <h2 className="font-orbitron text-2xl font-bold text-sky-400 mb-2">8. Governing Law</h2>
              <p className="text-justify">
                These Terms shall be governed and construed in accordance with the laws of Estonia, without regard to its conflict of law provisions.
              </p>
            </div>
        </SectionContainer>

      </main>
      <Footer className="pb-8" />
    </div>
  );
}

export default TermsAndConditions;