const Button = ({
  onClick,
  border,
  underline,
  className,
  disabled,
  children,
}) => {
  const buttonClasses = disabled
    ? "cursor-pointer text-slate-200"
    : "cursor-pointer text-slate-400 hover:text-slate-500 active:text-slate-600";
  const borderClasses = border
    ? disabled
      ? "p-2 border border-slate-100"
      : "p-2 border border-slate-200 hover:border-slate-300 active:border-slate-500"
    : "";
  const underlineClasses = underline ? "underline" : "";
  return (
    <button className="outline-0" onClick={onClick} disabled={disabled}>
      <span
        className={
          buttonClasses +
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
