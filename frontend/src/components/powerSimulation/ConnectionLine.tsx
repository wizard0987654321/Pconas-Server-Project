import React from "react";

type ConnectionLineProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  strokeWidth?: number;
  dashed?: boolean; // e.g. for cables that are not saved yet
  damaged?: boolean; // draws a small X in the middle of the line
  // Hover support (optional, only used where lines should show info)
  hovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  color = "black",
  strokeWidth = 2,
  dashed = false,
  damaged = false,
  hovered = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const hoverable = !!(onMouseEnter || onMouseLeave || onClick);

  // Middle of the line, for the damage X
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

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

      {damaged && (
        <path
          d={`M ${midX - 7} ${midY - 7} L ${midX + 7} ${midY + 7} M ${midX + 7} ${midY - 7} L ${midX - 7} ${midY + 7}`}
          stroke={color}
          strokeWidth={strokeWidth + 1}
          strokeLinecap="round"
        />
      )}

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
          onClick={onClick}
        />
      )}
    </g>
  );
};

export default ConnectionLine;
