const Button = ({ onClick, border, underline, className, children }) => {
  const borderClasses = border
    ? "p-2 border border-slate-200 hover:border-slate-300 active:border-slate-500"
    : "";
  const underlineClasses = underline ? "underline" : "";
  return (
    <button className="outline-0" onClick={onClick}>
      <span
        className={
          "cursor-pointer text-slate-400 hover:text-slate-500 active:text-slate-600" +
          ` ${borderClasses}` +
          ` ${underlineClasses}` +
          ` ${className}`
        }
      >
        {children}
      </span>
    </button>
  );
};

export default Button;
