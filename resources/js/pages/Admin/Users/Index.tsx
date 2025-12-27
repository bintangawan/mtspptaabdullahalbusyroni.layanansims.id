import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Download,
    Edit,
    FileDown,
    FileSpreadsheet,
    Filter,
    X as IconX,
    Info,
    MoreHorizontal,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    Upload,
    UploadCloud,
    UserCheck,
    UserX,
} from 'lucide-react';
import { ReactNode, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

// ────────────────────────────────────────────────────────────────────────────────
// Sentinel constants
const ROLE_ALL = 'all';
const STATUS_ALL = 'all';
const STATUS_ACTIVE = '1';
const STATUS_INACTIVE = '0';

// ────────────────────────────────────────────────────────────────────────────────
// Dialog konfirmasi hapus
type ConfirmDeleteDialogProps = {
    trigger: ReactNode;
    title: string;
    description?: string;
    confirmWord?: string;
    onConfirm: () => void;
    isLoading?: boolean;
};

function ConfirmDeleteDialog({
    trigger,
    title,
    description = 'Tindakan ini permanen dan tidak dapat dibatalkan.',
    confirmWord = 'HAPUS',
    onConfirm,
    isLoading,
}: ConfirmDeleteDialogProps) {
    const [typed, setTyped] = useState('');
    const [agreed, setAgreed] = useState(false);

    const canSubmit = typed.trim().toUpperCase() === confirmWord && agreed && !isLoading;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

            <AlertDialogContent className="max-w-[90vw] rounded-2xl border shadow-xl sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">{description}</AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">
                        Ketik <span className="font-semibold text-foreground">{confirmWord}</span> untuk konfirmasi:
                    </div>
                    <Input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={confirmWord} />

                    <label className="flex items-start gap-2 text-sm sm:items-center">
                        <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(Boolean(v))} className="mt-0.5 sm:mt-0" />
                        <span>Saya paham data yang dihapus tidak dapat dikembalikan.</span>
                    </label>
                </div>

                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel className={`${buttonVariants({ variant: 'outline' })} rounded-xl`}>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={!canSubmit}
                        onClick={onConfirm}
                        className={`${buttonVariants({ variant: 'destructive' })} gap-2 rounded-xl`}
                    >
                        <Trash2 className="h-4 w-4" />
                        {isLoading ? 'Menghapus...' : 'Hapus'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// ────────────────────────────────────────────────────────────────────────────────
// Dialog Import (UPDATED: Button Left & Template)
type ImportUsersDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDone?: () => void;
};

function humanSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ImportUsersDialog({ open, onOpenChange, onDone }: ImportUsersDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const maxSizeBytes = 2 * 1024 * 1024;
    const allowed = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

    const validateFile = (f: File) => {
        if (!allowed.includes(f.type) && !/\.(csv|xlsx|xls)$/i.test(f.name)) {
            toast.error('Format file tidak didukung. Gunakan .csv, .xlsx, atau .xls');
            return false;
        }
        if (f.size > maxSizeBytes) {
            toast.error('Ukuran file maksimal 2MB');
            return false;
        }
        return true;
    };

    const pickFile = () => inputRef.current?.click();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (!validateFile(f)) {
            e.target.value = '';
            return;
        }
        setFile(f);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f && validateFile(f)) {
            setFile(f);
        }
    };
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!dragging) setDragging(true);
    };
    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const clearFile = () => {
        setFile(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const upload = () => {
        if (!file) {
            toast.error('Silakan pilih file terlebih dahulu');
            return;
        }
        setUploading(true);

        const fd = new FormData();
        fd.append('file', file);

        router.post('/admin/users/import', fd, {
            onSuccess: () => {
                toast.success('Import berhasil diproses');
                clearFile();
                onOpenChange(false);
                onDone?.();
            },
            onError: () => {
                toast.error('Gagal import file');
            },
            onFinish: () => {
                setUploading(false);
            },
        });
    };

    const downloadTemplate = () => {
        window.open('/admin/users/template', '_blank');
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !uploading && onOpenChange(v)}>
            <DialogContent className="max-w-[95vw] rounded-2xl sm:max-w-lg">
                <DialogHeader>
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <DialogTitle className="flex items-center gap-2">
                            <UploadCloud className="h-5 w-5" />
                            Import Pengguna
                        </DialogTitle>

                        {/* Tombol Download Template */}
                        <Button variant="secondary" size="sm" onClick={downloadTemplate} className="h-8 text-xs">
                            <FileDown className="mr-2 h-3 w-3" />
                            Download Template
                        </Button>
                    </div>
                    <DialogDescription className="mt-2 text-start">
                        Unggah file <b>CSV/XLSX</b>. Gunakan template agar format sesuai.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Card className="border-dashed shadow-none">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <FileSpreadsheet className="h-4 w-4" />
                                Wajib
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-xs text-muted-foreground">name, email, role (admin/guru/siswa)</CardContent>
                    </Card>

                    <Card className="border-dashed shadow-none">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <Info className="h-4 w-4" />
                                Opsional
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-xs text-muted-foreground">nis/nidn, kelas/mapel, telp</CardContent>
                    </Card>
                </div>

                <div
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    className={`mt-3 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition ${
                        dragging ? 'border-primary/60 bg-primary/5' : 'border-muted-foreground/20'
                    }`}
                >
                    <Upload className="h-6 w-6 opacity-70" />
                    <div className="text-sm">
                        Seret & letakkan file, atau{' '}
                        <button type="button" onClick={pickFile} className="font-semibold underline underline-offset-4">
                            pilih file
                        </button>
                    </div>
                    <div className="text-xs text-muted-foreground">Format: .csv, .xlsx — Maks 2MB</div>

                    <input
                        ref={inputRef}
                        type="file"
                        accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={onChange}
                        className="hidden"
                    />
                </div>

                {file && (
                    <div className="mt-3 flex items-start justify-between gap-3 rounded-xl border bg-muted/20 p-3 text-sm">
                        <div className="flex-1 overflow-hidden">
                            <div className="truncate font-medium">{file.name}</div>
                            <div className="text-xs text-muted-foreground">{humanSize(file.size)}</div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={clearFile} disabled={uploading}>
                            <IconX className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* MODIFIED FOOTER: Buttons on the LEFT side for Chatbot compatibility */}
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-start">
                    <Button onClick={upload} disabled={uploading || !file} className="w-full sm:w-auto">
                        {uploading ? 'Mengunggah...' : 'Unggah & Proses'}
                    </Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading} className="w-full sm:w-auto">
                        Batal
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ────────────────────────────────────────────────────────────────────────────────
// Dialog Export
type ExportUsersDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roles: { id: number; name: string }[];
};

function ExportUsersDialog({ open, onOpenChange, roles }: ExportUsersDialogProps) {
    const [role, setRole] = useState<string>(ROLE_ALL);
    const [status, setStatus] = useState<string>(STATUS_ALL);

    const exportUrl = useMemo(() => {
        const params = new URLSearchParams();
        if (role !== ROLE_ALL) params.set('role', role);
        if (status !== STATUS_ALL) params.set('status', status);
        const qs = params.toString();
        return qs ? `/admin/users/export?${qs}` : `/admin/users/export`;
    }, [role, status]);

    const download = () => {
        toast.info('Menyiapkan file export...');
        window.open(exportUrl, '_blank', 'noopener');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[90vw] rounded-2xl sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        Export Data User
                    </DialogTitle>
                    <DialogDescription>
                        Pilih kriteria export. Format <b>.xlsx</b>.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4">
                        <Label className="text-left sm:text-right">Role</Label>
                        <div className="col-span-1 sm:col-span-3">
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ROLE_ALL}>Semua Role</SelectItem>
                                    {roles.map((r) => (
                                        <SelectItem key={r.id} value={r.name}>
                                            {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4">
                        <Label className="text-left sm:text-right">Status</Label>
                        <div className="col-span-1 sm:col-span-3">
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={STATUS_ALL}>Semua Status</SelectItem>
                                    <SelectItem value={STATUS_ACTIVE}>Aktif</SelectItem>
                                    <SelectItem value={STATUS_INACTIVE}>Tidak Aktif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                    <Button onClick={download}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ────────────────────────────────────────────────────────────────────────────────
// Types (Tetap Sama)
type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    roles: Array<{ name: string }>;
    siswa_profile?: {
        nis: string;
        angkatan: number;
        kelas: string;
    } | null;
    guru_profile?: {
        nidn: string;
        mapel_keahlian: string;
    } | null;
}

interface Role {
    id: number;
    name: string;
}

interface PaginatedUsers {
    data: User[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

interface Props {
    users: PaginatedUsers;
    roles: Role[];
    filters: {
        search?: string;
        role?: string;
        status?: boolean | null;
    };
}

// ────────────────────────────────────────────────────────────────────────────────
// Main Page
export default function Users({ users, roles, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role ?? ROLE_ALL);
    const [selectedStatus, setSelectedStatus] = useState(
        filters.status === true ? STATUS_ACTIVE : filters.status === false ? STATUS_INACTIVE : STATUS_ALL,
    );
    const [isLoading, setIsLoading] = useState(false);

    const [openImport, setOpenImport] = useState(false);
    const [openExport, setOpenExport] = useState(false);

    // Guard sederhana
    if (!users || !Array.isArray(users.data)) {
        return (
            <AppLayout>
                <Head title="Manajemen User" />
                <div className="p-4 text-red-600">Error: Data users tidak tersedia atau tidak valid.</div>
            </AppLayout>
        );
    }

    const handleSearch = () => {
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (selectedRole !== ROLE_ALL) params.role = selectedRole;
        if (selectedStatus !== STATUS_ALL) params.status = selectedStatus;

        router.get('/admin/users', params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setSelectedRole(ROLE_ALL);
        setSelectedStatus(STATUS_ALL);
        router.get('/admin/users', {}, { preserveState: true, replace: true });
    };

    const handleToggleStatus = (userId: number) => {
        if (isLoading) return;
        setIsLoading(true);
        router.patch(
            `/admin/users/${userId}/toggle-status`,
            {},
            {
                onSuccess: () => toast.success('Status user berhasil diubah'),
                onError: () => toast.error('Gagal mengubah status user'),
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleResetPassword = (userId: number) => {
        setIsLoading(true);
        router.post(
            `/admin/users/${userId}/reset-password`,
            {},
            {
                onSuccess: () => toast.success('Password berhasil direset'),
                onError: () => toast.error('Gagal mereset password'),
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleDelete = (userId: number) => {
        setIsLoading(true);
        router.delete(`/admin/users/${userId}`, {
            onSuccess: () => toast.success('User berhasil dihapus'),
            onError: () => toast.error('Gagal menghapus user'),
            onFinish: () => setIsLoading(false),
        });
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800 hover:bg-red-100';
            case 'guru':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            case 'siswa':
                return 'bg-green-100 text-green-800 hover:bg-green-100';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen User" />

            <div className="space-y-6 p-4 sm:p-6">
                {/* Header Responsive */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Manajemen User</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">Kelola data pengguna sistem</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setOpenImport(true)} className="flex-1 sm:flex-none">
                            <Upload className="mr-2 h-4 w-4" />
                            Import
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setOpenExport(true)} className="flex-1 sm:flex-none">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                        <Button asChild size="sm" className="w-full sm:w-auto">
                            <Link href="/admin/users/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters Responsive */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg">Filter & Pencarian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 lg:flex-row">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama / email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Select value={selectedRole} onValueChange={setSelectedRole}>
                                    <SelectTrigger className="w-full sm:w-[160px]">
                                        <SelectValue placeholder="Semua Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ROLE_ALL}>Semua Role</SelectItem>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.name}>
                                                {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger className="w-full sm:w-[160px]">
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={STATUS_ALL}>Semua Status</SelectItem>
                                        <SelectItem value={STATUS_ACTIVE}>Aktif</SelectItem>
                                        <SelectItem value={STATUS_INACTIVE}>Tidak Aktif</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="flex gap-2">
                                    <Button onClick={handleSearch} className="flex-1 sm:flex-none">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filter
                                    </Button>
                                    <Button onClick={handleReset} variant="outline" className="flex-1 sm:flex-none">
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table Responsive Wrapper */}
                <Card className="overflow-hidden">
                    <CardHeader className="pb-3">
                        <CardTitle>Daftar User</CardTitle>
                        <CardDescription>Total: {users.total} user</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6">
                        <div className="overflow-x-auto">
                            <Table className="min-w-[800px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Info Tambahan</TableHead>
                                        <TableHead>Terdaftar</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                                                Tidak ada data user
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.data.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="font-medium">{user.name}</div>
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    {user.roles.map((role) => (
                                                        <Badge
                                                            key={role.name}
                                                            variant="outline"
                                                            className={`border-0 ${getRoleBadgeColor(role.name)}`}
                                                        >
                                                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                                        </Badge>
                                                    ))}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={user.email_verified_at ? 'default' : 'secondary'} className="rounded-full">
                                                        {user.email_verified_at ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {user.siswa_profile && (
                                                        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                                                            <span>
                                                                NIS: <span className="text-foreground">{user.siswa_profile.nis}</span>
                                                            </span>
                                                            <span>
                                                                Kelas: <span className="text-foreground">{user.siswa_profile.kelas || '-'}</span>
                                                            </span>
                                                        </div>
                                                    )}
                                                    {user.guru_profile && (
                                                        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                                                            <span>
                                                                NIDN: <span className="text-foreground">{user.guru_profile.nidn || '-'}</span>
                                                            </span>
                                                            <span>
                                                                Mapel:{' '}
                                                                <span className="text-foreground">{user.guru_profile.mapel_keahlian || '-'}</span>
                                                            </span>
                                                        </div>
                                                    )}
                                                    {!user.siswa_profile && !user.guru_profile && <span className="text-muted-foreground">-</span>}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/users/${user.id}/edit`}>
                                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                                </Link>
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem onClick={() => handleToggleStatus(user.id)} disabled={isLoading}>
                                                                {user.email_verified_at ? (
                                                                    <>
                                                                        <UserX className="mr-2 h-4 w-4" /> Nonaktifkan
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <UserCheck className="mr-2 h-4 w-4" /> Aktifkan
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem onClick={() => handleResetPassword(user.id)} disabled={isLoading}>
                                                                <RotateCcw className="mr-2 h-4 w-4" /> Reset Password
                                                            </DropdownMenuItem>

                                                            <ConfirmDeleteDialog
                                                                trigger={
                                                                    <DropdownMenuItem
                                                                        onSelect={(e) => e.preventDefault()}
                                                                        className="text-red-600 focus:text-red-700"
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                                    </DropdownMenuItem>
                                                                }
                                                                title={`Hapus user "${user.name}"?`}
                                                                description={`Email: ${user.email}. Tindakan ini tidak dapat dibatalkan.`}
                                                                confirmWord="HAPUS"
                                                                onConfirm={() => handleDelete(user.id)}
                                                                isLoading={isLoading}
                                                            />
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {(users.last_page ?? 1) > 1 && (
                            <div className="flex flex-col items-center justify-between gap-4 border-t p-4 sm:flex-row">
                                <div className="text-sm text-muted-foreground">
                                    Hal {users.current_page} dari {users.last_page} ({users.total} data)
                                </div>
                                <div className="flex items-center gap-1">
                                    {users.links.map((link, index) => {
                                        const isPrev = link.label.includes('Previous');
                                        const isNext = link.label.includes('Next');
                                        const isDots = link.label.includes('...');

                                        if (isDots)
                                            return (
                                                <span key={index} className="px-2 text-muted-foreground">
                                                    ...
                                                </span>
                                            );

                                        return (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                className={isPrev || isNext ? 'hidden sm:inline-flex' : ''}
                                            >
                                                {isPrev ? 'Sebelumnya' : isNext ? 'Selanjutnya' : link.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ImportUsersDialog open={openImport} onOpenChange={setOpenImport} onDone={() => router.reload({ only: ['users'] })} />
            <ExportUsersDialog open={openExport} onOpenChange={setOpenExport} roles={roles} />
        </AppLayout>
    );
}
