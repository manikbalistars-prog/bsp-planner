export default function InputForm({ label, type = "text", name, id = { name }, placeholder, required = false, ...props }) {
    return (
        <div className="flex flex-col text-base gap-1">
            <label htmlFor={name} className="text-stone-600">{label}
                {required && "*"}
            </label>
            <input
                type={type}
                name={name}
                id={name}
                placeholder={placeholder}
                required={required}
                {...props}
                className="bg-white px-2 py-1 rounded-sm focus:outline-none"
            />
        </div>
    )
}