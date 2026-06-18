export default function Button({ label, id, variant ="primary"}) {
    const variants = {
        primary : "bg-blue-500 text-white hover:bg-blue-700 "
    }
    return (
        <button id={id}
            className={`
                ${variants[variant]}
                rounded-sm px-2 py-1 hover:cursor-pointer`}
        >{label}</button>
    )
}