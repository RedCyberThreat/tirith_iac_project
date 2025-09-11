import React from "react";

interface SectionContainerProps {
  title: string;
  children: React.ReactNode;
}

function SectionContainer({ title, children }: SectionContainerProps) {
  const cutSize = "20px";
  const borderWidth = "1.5px";

  const diagonalInset = `calc(${borderWidth} * 0.75)`;

  const outerClipPath = `polygon(
    ${cutSize} 0%,
    calc(100% - ${cutSize}) 0%,
    100% ${cutSize},
    100% calc(100% - ${cutSize}),
    calc(100% - ${cutSize}) 100%,
    ${cutSize} 100%,
    0% calc(100% - ${cutSize}),
    0% ${cutSize}
  )`;

  const innerClipPath = `polygon(
    calc(${cutSize} + ${diagonalInset}) ${borderWidth},
    calc(100% - ${cutSize} - ${diagonalInset}) ${borderWidth},
    calc(100% - ${borderWidth}) calc(${cutSize} + ${diagonalInset}),
    calc(100% - ${borderWidth}) calc(100% - ${cutSize} - ${diagonalInset}),
    calc(100% - ${cutSize} - ${diagonalInset}) calc(100% - ${borderWidth}),
    calc(${cutSize} + ${diagonalInset}) calc(100% - ${borderWidth}),
    ${borderWidth} calc(100% - ${cutSize} - ${diagonalInset}),
    ${borderWidth} calc(${cutSize} + ${diagonalInset})
  )`;

  return (
    <section className="relative m-8 ">
      <div
        className="absolute inset-0 bg-tertiary-red"
        style={{ clipPath: outerClipPath }}
      ></div>

      <div
        className="relative bg-light-black py-6 px-20"
        style={{ clipPath: innerClipPath }}
      >
        <h2 className="text-5xl font-rajdhani font-bold text-primary-blue mb-2">
          {title}
        </h2>
        <div>{children}</div>
      </div>
    </section>
  );
}

export default SectionContainer;
