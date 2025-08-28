interface FooterProps {
  className?: string;
}

function Footer({ className = "" }: FooterProps) {
  return (
    <>
      <footer
        className={`${className} mt-4 bg-[#2d110f] flex text-primary-blue text-4xl font-bold justify-center gap-32 font-rajdhani items-center p-1`}
      >
        <a href="/contact-us" className="text-center leading-8">
          Contact <br /> Us
        </a>
        <a href="/" className="text-center leading-8">
          Home <br />
          Page
        </a>
        <a href="/tos" className="text-center leading-8">
          Terms of <br />
          Service
        </a>
      </footer>
    </>
  );
}

export default Footer;
