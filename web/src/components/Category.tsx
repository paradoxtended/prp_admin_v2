const Category: React.FC<{
    icon: string;
    active?: boolean;
    setactive: () => void;
}> = ({ icon, active, setactive }) => {
    return (
        <i className={`${icon}
        w-9 h-9 rounded-full cursor-pointer
        flex justify-center items-center
        border-2 text-white hover:bg-lime-500/20
        duration-200
        ${active ? 'bg-lime-500/20 border-lime-600' : 'bg-neutral-200/10 border-neutral-400'}`}
        onClick={() => setactive()}></i>
    )
};

export default Category;