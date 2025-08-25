import React from "react";

// The props interface now includes 'innerClassName' and extends standard HTML div attributes
// to allow passing event handlers like onClick, onDragOver, etc.
interface JaggedBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  type?: string;
  innerClassName?: string; // This new prop is for styling the inner background
}

function JaggedBox({
  children,
  className = "",
  type,
  innerClassName, // Destructure the new prop
  ...props // Capture any other passed props (like event handlers)
}: JaggedBoxProps) {
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
    // Spread the captured props onto the main grid container.
    // This makes the component accept event handlers.
    <div className={`grid ${className}`} {...props}>
      <div
        className={`${
          type === "lighter" ? "bg-[#652821]" : "bg-tertiary-red"
        }  [grid-area:1/1]`}
        style={{ clipPath: outerClipPath }}
      ></div>
      <div
        // The inner background now uses 'innerClassName'. If it's not provided,
        // it falls back to the default 'bg-lighter-black'.
        className={`[grid-area:1/1] ${innerClassName || "bg-lighter-black"}`}
        style={{ clipPath: innerClipPath }}
      ></div>
      <div className="relative [grid-area:1/1]">{children}</div>
    </div>
  );
}

export default JaggedBox;
