import { useEffect, useRef } from "react";

const ProgressBar = ({
  className,
  progress = 0,
  progressColor = "#000000",
}) => {
  const progressRef = useRef();

  useEffect(() => {
    if (isNaN(progress)) return;
    progressRef.current.style.width = `${progress}%`;
    progressRef.current.style.backgroundColor = progressColor;
  }, [progress, progressColor]);

  return (
    <div
      className={
        className +
        ` border border-slate-200 rounded-full [&>*]:rounded-full w-full`
      }
    >
      <div ref={progressRef} className={`h-full ${progressColor}`}></div>
    </div>
  );
};

export default ProgressBar;
