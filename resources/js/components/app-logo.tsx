export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center bg-sidebar-primary overflow-hidden">
                <img
                    src="/logo/spendify_logo.jpg"
                    alt="Spendify Logo"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Spendify
                </span>
            </div>
        </>
    );
}
