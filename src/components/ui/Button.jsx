import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  disabled = false,
  ...rest
}) {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full" : "",
  ].filter(Boolean).join(" ");

  return (
    <button type={type} className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}