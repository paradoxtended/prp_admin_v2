const Header: React.FC<{
    exit: () => void
}> = ({ exit }) => {
    return (
        <div className="px-10 py-5 flex items-center justify-between text-white">
            <img src="/logo.webp" className="w-60" />
            <i className="fa-regular fa-circle-xmark hover:text-lime-500 duration-200 cursor-pointer scale-110"
            onClick={() => exit()}></i>
        </div>
    )
};

export default Header;