const InlineLink = ({ href, border, target, className, children }) => {
  const borderClasses = border
    ? "p-2 border border-slate-200 hover:border-slate-300 active:border-slate-500"
    : "";
  return (
    <a href={href} target={target}>
      <span
        className={
          "cursor-pointer text-slate-400 hover:text-slate-500 active:text-slate-600" +
          ` ${borderClasses}` +
          ` ${className}`
        }
      >
        {children}
      </span>
    </a>
  );
};

export default InlineLink;
