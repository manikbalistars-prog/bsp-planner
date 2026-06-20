export default function Button({
  label,
  id,
  variant = "primary",
  onClick,
  type,
}) {
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-700  hover:cursor-pointer",
    disable: "bg-stone-200 text-stone-600 hover:bg-stone-200 hover:cursor-not-allowed"
  };
  return (
    <button
      id={id}
      onClick={onClick}
      type={type}
      className={`
                ${variants[variant]}
                rounded-sm px-2 py-1`}>
      {label}
    </button>
  );
}
