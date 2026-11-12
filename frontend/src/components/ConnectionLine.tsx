import React from "react";

interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  strokeWidth?: number;
  dashed?: boolean; // e.g. for cables that are not saved yet
  // Hover support (optional, only used where lines should show info)
  hovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  color = "black",
  strokeWidth = 2,
  dashed = false,
  hovered = false,
  onMouseEnter,
  onMouseLeave,
}) => {
  const hoverable = !!(onMouseEnter || onMouseLeave);

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeDasharray={dashed ? "8 6" : undefined}
        strokeLinecap="round"
        // "growing" effect, like hover:scale on the icons
        style={{
          strokeWidth: hovered ? strokeWidth * 2 : strokeWidth,
          transition: "stroke-width 150ms",
        }}
      />

      {/* Invisible wide line, so the thin cable is easy to hover */}
      {hoverable && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="transparent"
          strokeWidth={Math.max(14, strokeWidth * 4)}
          strokeLinecap="round"
          className="cursor-pointer"
          style={{ pointerEvents: "stroke" }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      )}
    </g>
  );
};

export default ConnectionLine;
