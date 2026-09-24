import React, { useState } from 'react';

export const PieChartCard = ({ title, subtitle, data = [], isDonut = true }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const total = data.reduce((acc, item) => acc + item.value, 0);

  // SVG parameters
  const size = 200;
  const center = size / 2;
  const radius = 80;
  const innerRadius = isDonut ? 52 : 0;

  let cumulativeAngle = 0;

  const slices = data.map((item, index) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const angle = total > 0 ? (item.value / total) * 360 : 0;

    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const getCoordinatesForAngle = (deg) => {
      const rad = ((deg - 90) * Math.PI) / 180;
      return {
        x: center + radius * Math.cos(rad),
        y: center + radius * Math.sin(rad),
        innerX: center + innerRadius * Math.cos(rad),
        innerY: center + innerRadius * Math.sin(rad),
      };
    };

    const start = getCoordinatesForAngle(startAngle);
    const end = getCoordinatesForAngle(endAngle);

    const largeArcFlag = angle > 180 ? 1 : 0;

    let pathData = '';
    if (isDonut) {
      pathData = [
        `M ${start.x} ${start.y}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
        `L ${end.innerX} ${end.innerY}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${start.innerX} ${start.innerY}`,
        'Z',
      ].join(' ');
    } else {
      pathData = [
        `M ${center} ${center}`,
        `L ${start.x} ${start.y}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
        'Z',
      ].join(' ');
    }

    return {
      ...item,
      percentage: Math.round(percentage),
      pathData,
      index,
    };
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const activeSlice = hoveredIndex !== null ? slices[hoveredIndex] : null;

  return (
    <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 space-y-4 relative overflow-hidden shadow-sm">
      {/* Header */}
      <div>
        <h3 className="font-black text-black dark:text-white text-base uppercase font-heading">{title}</h3>
        {subtitle && <p className="text-xs text-neutral-500 font-sans mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
        {/* SVG Donut Container */}
        <div 
          className="relative w-52 h-52 flex items-center justify-center shrink-0 cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform drop-shadow-sm">
            {slices.map((slice) => {
              const isHovered = hoveredIndex === slice.index;
              return (
                <path
                  key={slice.index}
                  d={slice.pathData}
                  fill={slice.color}
                  className="transition-all duration-200 ease-out origin-center"
                  style={{
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: `${center}px ${center}px`,
                    opacity: hoveredIndex !== null && !isHovered ? 0.6 : 1,
                  }}
                  onMouseEnter={() => setHoveredIndex(slice.index)}
                />
              );
            })}
          </svg>

          {/* Donut Center */}
          {isDonut && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none font-mono">
              <span className="text-3xl font-black text-black dark:text-white">
                {activeSlice ? `${activeSlice.percentage}%` : total}
              </span>
              <span className="text-[9px] uppercase font-black text-neutral-400">
                {activeSlice ? activeSlice.label : 'TOTAL SESSIONS'}
              </span>
            </div>
          )}

          {/* Tooltip */}
          {activeSlice && (
            <div
              className="absolute z-20 pointer-events-none bg-black text-white border border-neutral-700 px-3 py-1.5 rounded-xl shadow-2xl text-xs space-y-0.5 font-mono"
              style={{
                left: `${Math.min(cursorPos.x + 10, 130)}px`,
                top: `${Math.min(cursorPos.y - 30, 160)}px`,
              }}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeSlice.color }} />
                <span>{activeSlice.label}</span>
              </div>
              <p className="text-[11px] text-neutral-300">
                <strong className="text-white">{activeSlice.value}</strong> count ({activeSlice.percentage}%)
              </p>
            </div>
          )}
        </div>

        {/* Legend List */}
        <div className="flex-1 space-y-2 w-full font-mono text-xs">
          {slices.map((slice) => {
            const isHovered = hoveredIndex === slice.index;
            return (
              <div
                key={slice.index}
                onMouseEnter={() => setHoveredIndex(slice.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isHovered
                    ? 'bg-neutral-100 dark:bg-[#1c1d27] border-black dark:border-[#FAC600] translate-x-1 shadow-sm'
                    : 'bg-neutral-50 dark:bg-[#0A0A0D] border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-md shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="font-bold text-black dark:text-white">{slice.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-black text-black dark:text-white">{slice.value}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300">
                    {slice.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
