import { useCallback, useState } from "react";

const GraffittiPaletteColor = ({ i, color, selected, onClick }) => {
  const borderClass = selected
    ? "drop-shadow-lg border-[3px] border-slate-400"
    : "border border-slate-300";
  return (
    <div
      className={borderClass + " rounded-full w-8 h-8 cursor-pointer"}
      style={{ backgroundColor: color }}
      onClick={() => {
        onClick(i, color);
      }}
    />
  );
};

const GraffittiPalette = ({ colors, onClick }) => {
  const [selected, setSelected] = useState(0);
  const clicked = useCallback(
    (i, color) => {
      setSelected(i);
      onClick(color);
    },
    [onClick]
  );

  return (
    <div className="flex gap-4 justify-center">
      {colors.map((color, i) => {
        return (
          <GraffittiPaletteColor
            key={`GraffittiPaletteColor-${i}`}
            i={i}
            color={color}
            selected={selected === i}
            onClick={clicked}
          />
        );
      })}
    </div>
  );
};

export default GraffittiPalette;
