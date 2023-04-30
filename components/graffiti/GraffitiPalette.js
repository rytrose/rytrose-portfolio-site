import { useCallback, useState } from "react";

const GraffitiPaletteColor = ({ i, color, selected, onClick }) => {
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

const useGraffitiPalette = (colors, onClick) => {
  const [selected, setSelected] = useState(0);
  const clicked = useCallback(
    (i, color) => {
      setSelected(i);
      onClick(color);
    },
    [onClick]
  );

  const graffitiPalette = (
    <div className="flex mx-2 gap-4 justify-center">
      {colors.map((color, i) => {
        return (
          <GraffitiPaletteColor
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

  return [
    graffitiPalette,
    useCallback(() => {
      const newIndex = (selected + 1) % colors.length;
      clicked(newIndex, colors[newIndex]);
    }, [selected, colors, clicked]),
    useCallback(() => {
      const newIndex = (selected - 1) % colors.length;
      clicked(newIndex, colors[newIndex]);
    }, [selected, colors, clicked]),
  ];
};

export default useGraffitiPalette;
