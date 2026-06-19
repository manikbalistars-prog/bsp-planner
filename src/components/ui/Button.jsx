export default function Button({
  label,
  id,
  variant = "primary",
  onClick,
  type,
}) {
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-700 ",
  };
  return (
    <button
      id={id}
      onClick={onClick}
      type={type}
      className={`
                ${variants[variant]}
                rounded-sm px-2 py-1 hover:cursor-pointer`}>
      {label}
    </button>
  );
}
