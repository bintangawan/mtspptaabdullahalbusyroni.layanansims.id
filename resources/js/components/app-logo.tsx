export default function AppLogo() {
    return (
        <>
            {/* Wadah untuk Logo Sekolah */}
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md">
                <img 
                    src="/images/logosekolah.png" 
                    alt="Logo Sekolah" 
                    className="size-full object-contain"
                />
            </div>

            {/* Teks Nama Sekolah */}
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-semibold">
                     PPTA Abdullah Al Busyroni
                </span>
                <span className="truncate text-xs text-muted-foreground">
                    ADMIN
                </span>
            </div>
        </>
    );
}
