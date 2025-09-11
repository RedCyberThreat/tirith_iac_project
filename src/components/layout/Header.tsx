function Header() {
  return (
    <>
      <header className="flex items-center gap-5 p-1 px-4 font-bold bg-primary-red font-rajdhani mb-16">
        <a href="/">
          <div className="flex flex-col items-center justify-center w-12 h-12 gap-1 rounded-full bg-primary-blue ">
            <span className="block w-8 h-[5.2px] bg-secondary-red rounded-full"></span>
            <span className="block w-8 h-[5px] bg-secondary-red rounded-full"></span>
            <span className="block w-8 h-[5px] bg-secondary-red rounded-full"></span>
          </div>
        </a>

        <h1 className="text-6xl text-primary-blue pt-0.5">IaC - Tirith</h1>
      </header>
    </>
  );
}

export default Header;
