import React from "react";

interface FeatureCardProps {
  icon: React.ReactElement<any>;
  title: string;
  description: string;
  stroke: number;
}

function FeatureCard({ icon, title, description, stroke }: FeatureCardProps) {
  return (
    <div className="flex w-1/3 flex-col items-center text-center">
      <div className="mb-16 text-primary-blue">
        {React.cloneElement(icon, {
          className: "w-28 h-28",
          style: {
            strokeWidth: stroke,
            fill: "#a0342a",
          },
        })}
      </div>
      <h2 className="mb-8 font-orbitron text-3xl font-bold leading-tight text-quaternary-red">
        {title}
      </h2>
      <p className="font-orbitron text-xs font-medium text-quaternary-red text-center">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;
