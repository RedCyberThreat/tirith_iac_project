import React from "react";

interface JaggedBoxProps {
  children: React.ReactNode;
  className?: string;
  type?: string;
}

function JaggedBox({ children, className = "", type }: JaggedBoxProps) {
  const cutSize = "22px";
  const borderWidth = "2px";
  const diagonalInset = `calc(${borderWidth} * 0.75)`;

  const outerClipPath = `polygon(
    0% 0%,
    100% 0%,
    100% calc(100% - ${cutSize}),
    calc(100% - ${cutSize}) 100%,
    0% 100%
  )`;

  const innerClipPath = `polygon(
    ${borderWidth} ${borderWidth},
    calc(100% - ${borderWidth}) ${borderWidth},
    calc(100% - ${borderWidth}) calc(100% - ${cutSize} - ${diagonalInset}),
    calc(100% - ${cutSize} - ${diagonalInset}) calc(100% - ${borderWidth}),
    ${borderWidth} calc(100% - ${borderWidth})
  )`;

  return (
    <div className={`grid ${className}`}>
      <div
        className={`${
          type === "lighter" ? "bg-[#652821]" : "bg-tertiary-red"
        }  [grid-area:1/1]`}
        style={{ clipPath: outerClipPath }}
      ></div>
      <div
        className="bg-lighter-black [grid-area:1/1]"
        style={{ clipPath: innerClipPath }}
      ></div>
      <div className="relative [grid-area:1/1]">{children}</div>
    </div>
  );
}

export default JaggedBox;
