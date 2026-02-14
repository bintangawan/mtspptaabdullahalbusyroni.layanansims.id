import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type PaginatedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, Download, Edit, Plus, Trash2, Upload, X as IconX, XCircle } from 'lucide-react';
import { ReactNode, useRef, useState } from 'react';
import { toast } from 'sonner';

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

// ────────────────────────────────────────────────────────────────
// Interfaces
// ────────────────────────────────────────────────────────────────

interface Term {
    id: number;
    tahun: string;
    semester: 'ganjil' | 'genap';
    aktif: boolean;
    created_at: string;
    updated_at?: string;
    [key: string]: string | number | boolean | undefined;
}

interface Subject {
    id: number;
    kode: string;
    nama: string;
    deskripsi?: string;
    created_at: string;
    updated_at?: string;
    [key: string]: string | number | boolean | undefined;
}

interface Section {
    id: number;
    subject_id: number;
    guru_id: number;
    term_id: number;
    kapasitas?: number;
    jadwal_json?: Record<string, unknown>[];
    created_at: string;
    updated_at?: string;
    subject: Subject;
    guru: { id: number; name: string; email?: string };
    term: Term;
    [key: string]:
        | string
        | number
        | boolean
        | undefined
        | Record<string, unknown>[]
        | Subject
        | Term
        | { id: number; name: string; email?: string };
}

interface Guru {
    id: number;
    name: string;
    nidn?: string;
    mapel_keahlian?: string;
}

interface ImportResultData {
    inserted: number;
    skipped: number;
    failed: number;
    errors: string[];
}

interface Props {
    terms: Term[];
    subjects: PaginatedData<Subject>;
    allSubjects: Subject[];
    sections: PaginatedData<Section>;
    gurus: Guru[];
}

type FormDataType = Record<string, string | number | boolean>;

// ────────────────────────────────────────────────────────────────
// Confirm Delete Dialog (responsive)
// ────────────────────────────────────────────────────────────────

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
        <AlertDialog
            onOpenChange={() => {
                setTyped('');
                setAgreed(false);
            }}
        >
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

            <AlertDialogContent className="max-w-[92vw] rounded-2xl border shadow-xl sm:max-w-md">
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

                <AlertDialogFooter className="mt-4 flex-col-reverse gap-2 sm:flex-row">
                    <AlertDialogCancel className={`${buttonVariants({ variant: 'outline' })} w-full rounded-xl sm:w-auto`}>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={!canSubmit}
                        onClick={onConfirm}
                        className={`${buttonVariants({ variant: 'destructive' })} w-full gap-2 rounded-xl sm:w-auto`}
                    >
                        <Trash2 className="h-4 w-4" />
                        {isLoading ? 'Menghapus...' : 'Hapus'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// ────────────────────────────────────────────────────────────────
// Import Dialog (enhanced with result summary)
// ────────────────────────────────────────────────────────────────

type ImportDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    uploadUrl: string;
    title: string;
    onDone?: () => void;
};

function humanSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ImportDialog({ open, onOpenChange, uploadUrl, title, onDone }: ImportDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [importResult, setImportResult] = useState<ImportResultData | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const maxSizeBytes = 2 * 1024 * 1024;
    const allowedExtensions = /\.(csv|xlsx|xls)$/i;
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

    const validateFile = (f: File) => {
        if (!allowedTypes.includes(f.type) && !allowedExtensions.test(f.name)) {
            toast.error('Format file tidak didukung. Gunakan .csv, .xlsx, atau .xls');
            return false;
        }
        if (f.size > maxSizeBytes) {
            toast.error('Ukuran file maksimal 2 MB');
            return false;
        }
        return true;
    };

    const resetState = () => {
        setFile(null);
        setImportResult(null);
        setUploading(false);
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleClose = (v: boolean) => {
        if (uploading) return;
        if (!v) resetState();
        onOpenChange(v);
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
        if (f && validateFile(f)) setFile(f);
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
            toast.error('Silakan pilih file terlebih dahulu.');
            return;
        }
        setUploading(true);

        const fd = new FormData();
        fd.append('file', file);

        router.post(uploadUrl, fd, {
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = (page.props as Record<string, unknown>).flash as Record<string, unknown> | undefined;
                const result = flash?.import_result as ImportResultData | undefined;

                if (result) {
                    setImportResult(result);
                    setFile(null);
                    if (inputRef.current) inputRef.current.value = '';
                } else {
                    toast.success((flash?.status as string) || 'Import berhasil diproses.');
                    resetState();
                    onOpenChange(false);
                    onDone?.();
                }
            },
            onError: (errors) => {
                const messages = Object.values(errors);
                if (messages.length > 0) {
                    messages.forEach((msg) => toast.error(String(msg)));
                } else {
                    toast.error('Gagal mengimport file. Silakan coba lagi.');
                }
            },
            onFinish: () => setUploading(false),
        });
    };

    const handleDone = () => {
        const wasInserted = importResult && importResult.inserted > 0;
        resetState();
        onOpenChange(false);
        if (wasInserted) {
            onDone?.();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-[92vw] rounded-2xl sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        Unggah file <b>CSV / XLSX / XLS</b>. Maksimal <b>2 MB</b>. Data duplikat akan otomatis dilewati.
                    </DialogDescription>
                </DialogHeader>

                {importResult ? (
                    /* ── Result Summary ─────────────────────────────── */
                    <div className="space-y-4 pt-2">
                        <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
                            {importResult.inserted > 0 && (
                                <div className="flex items-center gap-2.5 text-green-600 dark:text-green-400">
                                    <CheckCircle className="h-5 w-5 shrink-0" />
                                    <span className="font-medium">{importResult.inserted} data baru berhasil ditambahkan</span>
                                </div>
                            )}
                            {importResult.skipped > 0 && (
                                <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
                                    <AlertTriangle className="h-5 w-5 shrink-0" />
                                    <span className="font-medium">{importResult.skipped} data duplikat dilewati</span>
                                </div>
                            )}
                            {importResult.failed > 0 && (
                                <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
                                    <XCircle className="h-5 w-5 shrink-0" />
                                    <span className="font-medium">{importResult.failed} baris gagal diproses</span>
                                </div>
                            )}
                            {importResult.inserted === 0 && importResult.skipped === 0 && importResult.failed === 0 && (
                                <div className="flex items-center gap-2.5 text-muted-foreground">
                                    <AlertTriangle className="h-5 w-5 shrink-0" />
                                    <span className="font-medium">Tidak ada data yang diproses</span>
                                </div>
                            )}
                        </div>

                        {importResult.errors.length > 0 && (
                            <div className="max-h-40 overflow-y-auto rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/30">
                                <div className="mb-2 text-xs font-semibold text-red-600 dark:text-red-400">Detail Error:</div>
                                <div className="space-y-1">
                                    {importResult.errors.map((err, i) => (
                                        <div key={i} className="text-xs text-red-700 dark:text-red-300">
                                            {err}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
                            <Button onClick={handleDone} className="w-full sm:w-auto">
                                Selesai
                            </Button>
                        </DialogFooter>
                    </div>
                ) : (
                    /* ── File Upload Area ────────────────────────────── */
                    <>
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
                                Seret & letakkan file di sini, atau{' '}
                                <button type="button" onClick={pickFile} className="font-semibold underline underline-offset-4">
                                    pilih file
                                </button>
                            </div>
                            <div className="text-xs text-muted-foreground">Format: .csv, .xlsx, .xls — Maks 2 MB</div>

                            <input
                                ref={inputRef}
                                type="file"
                                accept=".csv,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={onChange}
                                className="hidden"
                            />
                        </div>

                        {file && (
                            <div className="mt-3 flex items-start justify-between gap-3 rounded-xl border p-3 text-sm">
                                <div className="flex-1 overflow-hidden">
                                    <div className="truncate font-medium">{file.name}</div>
                                    <div className="text-xs text-muted-foreground">{humanSize(file.size)}</div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={clearFile} disabled={uploading}>
                                    <IconX className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        <DialogFooter className="mt-2 flex-col-reverse gap-2 sm:flex-row">
                            <Button variant="outline" onClick={() => handleClose(false)} disabled={uploading} className="w-full sm:w-auto">
                                Batal
                            </Button>
                            <Button onClick={upload} disabled={uploading || !file} className="w-full sm:w-auto">
                                {uploading ? 'Memproses...' : 'Unggah & Proses'}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

// ────────────────────────────────────────────────────────────────
// Pagination Controls (reusable, responsive)
// ────────────────────────────────────────────────────────────────

function PaginationControls({
    meta,
    links,
    onPageChange,
    keyPrefix,
}: {
    meta: PaginatedData<unknown>['meta'];
    links: PaginatedData<unknown>['links'];
    onPageChange: (page: number | string) => void;
    keyPrefix: string;
}) {
    if (meta.last_page <= 1) return null;

    return (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
            <div className="text-sm text-muted-foreground">
                Hal <span className="font-medium">{meta.current_page}</span> dari <span className="font-medium">{meta.last_page}</span> (
                {meta.total} data)
            </div>

            <div className="flex flex-wrap items-center gap-1">
                <Button variant="outline" size="sm" disabled={meta.current_page <= 1} onClick={() => onPageChange(meta.current_page - 1)}>
                    &laquo; Prev
                </Button>

                {links
                    .filter((l) => /^\d+$/.test(l.label))
                    .map((link) => (
                        <Button
                            key={`${keyPrefix}-${link.label}`}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onPageChange(link.label)}
                            className="hidden sm:inline-flex"
                        >
                            {link.label}
                        </Button>
                    ))}

                <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.current_page >= meta.last_page}
                    onClick={() => onPageChange(meta.current_page + 1)}
                >
                    Next &raquo;
                </Button>
            </div>
        </div>
    );
}

// ────────────────────────────────────────────────────────────────
// Empty Table Row
// ────────────────────────────────────────────────────────────────

function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="py-10 text-center text-muted-foreground">
                {message}
            </TableCell>
        </TableRow>
    );
}

// ────────────────────────────────────────────────────────────────
// Page Component
// ────────────────────────────────────────────────────────────────

export default function MasterData({ terms, subjects, allSubjects, sections, gurus }: Props) {
    const [activeTab, setActiveTab] = useState<'terms' | 'subjects' | 'sections'>('terms');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Term | Subject | Section | undefined>(undefined);
    const [formData, setFormData] = useState<FormDataType>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [openImport, setOpenImport] = useState<null | 'subjects' | 'sections'>(null);

    // ─── Helpers ────────────────────────────────────────────────

    const tabLabel = (tab: string) => (tab === 'terms' ? 'Term' : tab === 'subjects' ? 'Mata Pelajaran' : 'Kelas');

    const downloadTemplate = (type: 'subjects' | 'sections') => {
        window.open(`/admin/master-data/template-${type}`, '_blank');
    };

    const openDialog = (item?: Term | Subject | Section) => {
        setEditingItem(item);
        if (item) {
            const obj: FormDataType = {};
            Object.keys(item).forEach((key) => {
                const value = (item as Record<string, unknown>)[key];
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                    obj[key] = value;
                }
            });
            setFormData(obj);
        } else {
            setFormData({});
        }
        setIsDialogOpen(true);
    };

    // ─── CRUD Handlers ─────────────────────────────────────────

    const handleSubmit = () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const method: 'put' | 'post' = editingItem ? 'put' : 'post';
        const endpoint = editingItem
            ? `/admin/master-data/${activeTab}/${(editingItem as { id: number }).id}`
            : `/admin/master-data/${activeTab}`;

        router[method](endpoint, formData, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${tabLabel(activeTab)} berhasil ${editingItem ? 'diperbarui' : 'ditambahkan'}.`);
                setIsDialogOpen(false);
                setEditingItem(undefined);
                setFormData({});
            },
            onError: (errors) => {
                const messages = Object.values(errors);
                if (messages.length > 0) {
                    messages.forEach((msg) => toast.error(String(msg)));
                } else {
                    toast.error('Terjadi kesalahan. Silakan coba lagi.');
                }
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleDelete = (type: 'terms' | 'subjects' | 'sections', id: number) => {
        setIsDeleting(true);
        router.delete(`/admin/master-data/${type}/${id}`, {
            preserveScroll: true,
            onSuccess: () => toast.success(`${tabLabel(type)} berhasil dihapus.`),
            onError: (errors) => {
                const messages = Object.values(errors);
                toast.error(String(messages[0]) || 'Gagal menghapus data.');
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    const handleActivateTerm = (termId: number) => {
        router.patch(
            `/admin/master-data/terms/${termId}/activate`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Term berhasil diaktifkan.'),
                onError: (errors) => {
                    const messages = Object.values(errors);
                    toast.error(String(messages[0]) || 'Gagal mengaktifkan term.');
                },
            },
        );
    };

    // ─── Pagination ─────────────────────────────────────────────

    const gotoSubjectsPage = (page: number | string) => {
        router.get(
            '/admin/master-data',
            { subjects_page: page, sections_page: sections.meta.current_page },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const gotoSectionsPage = (page: number | string) => {
        router.get(
            '/admin/master-data',
            { sections_page: page, subjects_page: subjects.meta.current_page },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    // ─── Render ─────────────────────────────────────────────────

    return (
        <AppLayout>
            <Head title="Master Data" />

            <div className="space-y-6 p-4 sm:p-6">
                {/* ── Page Header ──────────────────────────────── */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Master Data</h1>
                    <p className="text-sm text-muted-foreground">Kelola data master sistem (Term, Mata Pelajaran, Kelas)</p>
                </div>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="terms">Term</TabsTrigger>
                        <TabsTrigger value="subjects">Mapel</TabsTrigger>
                        <TabsTrigger value="sections">Kelas</TabsTrigger>
                    </TabsList>

                    {/* ════════════════════════════════════════════ */}
                    {/* Terms Tab                                   */}
                    {/* ════════════════════════════════════════════ */}
                    <TabsContent value="terms">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle className="text-lg">Term Akademik</CardTitle>
                                        <CardDescription>Kelola tahun ajaran dan semester</CardDescription>
                                    </div>
                                    <Button onClick={() => openDialog()} className="w-full sm:w-auto">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto rounded-lg border">
                                    <Table className="min-w-[580px]">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tahun Ajaran</TableHead>
                                                <TableHead>Semester</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Dibuat</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {terms.length === 0 && <EmptyRow colSpan={5} message="Belum ada data term." />}
                                            {terms.map((term) => (
                                                <TableRow key={term.id}>
                                                    <TableCell className="font-medium">{term.tahun}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {term.semester.charAt(0).toUpperCase() + term.semester.slice(1)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={term.aktif ? 'default' : 'secondary'}>
                                                            {term.aktif ? 'Aktif' : 'Tidak Aktif'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        {new Date(term.created_at).toLocaleDateString('id-ID')}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {!term.aktif && (
                                                                <Button size="sm" variant="outline" onClick={() => handleActivateTerm(term.id)}>
                                                                    <CheckCircle className="mr-1 h-4 w-4" />
                                                                    <span className="hidden sm:inline">Aktifkan</span>
                                                                </Button>
                                                            )}
                                                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => openDialog(term)}>
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <ConfirmDeleteDialog
                                                                trigger={
                                                                    <Button
                                                                        size="icon"
                                                                        variant="outline"
                                                                        className="h-8 w-8 text-red-600 hover:text-red-700"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                }
                                                                title={`Hapus Term "${term.tahun} - ${term.semester}"?`}
                                                                description="Menghapus term dapat memengaruhi penjadwalan terkait."
                                                                onConfirm={() => handleDelete('terms', term.id)}
                                                                isLoading={isDeleting}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ════════════════════════════════════════════ */}
                    {/* Subjects Tab                                */}
                    {/* ════════════════════════════════════════════ */}
                    <TabsContent value="subjects">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle className="text-lg">Mata Pelajaran</CardTitle>
                                        <CardDescription>Kelola data mata pelajaran</CardDescription>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => downloadTemplate('subjects')}
                                            className="flex-1 sm:flex-none"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Template
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setOpenImport('subjects')} className="flex-1 sm:flex-none">
                                            <Upload className="mr-2 h-4 w-4" />
                                            Import
                                        </Button>
                                        <Button size="sm" onClick={() => openDialog()} className="flex-1 sm:flex-none">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto rounded-lg border">
                                    <Table className="min-w-[600px]">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Kode</TableHead>
                                                <TableHead>Nama</TableHead>
                                                <TableHead>Deskripsi</TableHead>
                                                <TableHead className="w-[110px]">Dibuat</TableHead>
                                                <TableHead className="w-[100px] text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {subjects.data.length === 0 && (
                                                <EmptyRow colSpan={5} message="Belum ada data mata pelajaran." />
                                            )}
                                            {subjects.data.map((subject) => (
                                                <TableRow key={subject.id}>
                                                    <TableCell className="font-medium">{subject.kode}</TableCell>
                                                    <TableCell>{subject.nama}</TableCell>
                                                    <TableCell className="max-w-[200px] truncate" title={subject.deskripsi || undefined}>
                                                        {subject.deskripsi || '-'}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        {new Date(subject.created_at).toLocaleDateString('id-ID')}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                className="h-8 w-8"
                                                                onClick={() => openDialog(subject)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <ConfirmDeleteDialog
                                                                trigger={
                                                                    <Button
                                                                        size="icon"
                                                                        variant="outline"
                                                                        className="h-8 w-8 text-red-600 hover:text-red-700"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                }
                                                                title={`Hapus Mapel "${subject.nama}"?`}
                                                                description={`Kode: ${subject.kode}. Data terkait mungkin ikut terhapus.`}
                                                                onConfirm={() => handleDelete('subjects', subject.id)}
                                                                isLoading={isDeleting}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <PaginationControls
                                    meta={subjects.meta}
                                    links={subjects.links}
                                    onPageChange={gotoSubjectsPage}
                                    keyPrefix="subj"
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ════════════════════════════════════════════ */}
                    {/* Sections Tab                                */}
                    {/* ════════════════════════════════════════════ */}
                    <TabsContent value="sections">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle className="text-lg">Kelas / Section</CardTitle>
                                        <CardDescription>Kelola kelas dan jadwal pembelajaran</CardDescription>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => downloadTemplate('sections')}
                                            className="flex-1 sm:flex-none"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Template
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setOpenImport('sections')} className="flex-1 sm:flex-none">
                                            <Upload className="mr-2 h-4 w-4" />
                                            Import
                                        </Button>
                                        <Button size="sm" onClick={() => openDialog()} className="flex-1 sm:flex-none">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto rounded-lg border">
                                    <Table className="min-w-[700px]">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Mata Pelajaran</TableHead>
                                                <TableHead>Guru</TableHead>
                                                <TableHead>Term</TableHead>
                                                <TableHead className="w-[90px]">Kapasitas</TableHead>
                                                <TableHead className="w-[110px]">Dibuat</TableHead>
                                                <TableHead className="w-[100px] text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sections.data.length === 0 && <EmptyRow colSpan={6} message="Belum ada data kelas." />}
                                            {sections.data.map((section) => (
                                                <TableRow key={section.id}>
                                                    <TableCell className="font-medium">{section.subject?.nama ?? '-'}</TableCell>
                                                    <TableCell>{section.guru?.name ?? '-'}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="whitespace-nowrap">
                                                            {section.term?.tahun} {section.term?.semester}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{section.kapasitas || '-'}</TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        {new Date(section.created_at).toLocaleDateString('id-ID')}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                className="h-8 w-8"
                                                                onClick={() => openDialog(section)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <ConfirmDeleteDialog
                                                                trigger={
                                                                    <Button
                                                                        size="icon"
                                                                        variant="outline"
                                                                        className="h-8 w-8 text-red-600 hover:text-red-700"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                }
                                                                title={`Hapus Kelas "${section.subject?.nama}"?`}
                                                                description={`Guru: ${section.guru?.name} · Term: ${section.term?.tahun}. Menghapus kelas tidak dapat dibatalkan.`}
                                                                onConfirm={() => handleDelete('sections', section.id)}
                                                                isLoading={isDeleting}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <PaginationControls
                                    meta={sections.meta}
                                    links={sections.links}
                                    onPageChange={gotoSectionsPage}
                                    keyPrefix="sec"
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* ════════════════════════════════════════════════ */}
                {/* Add / Edit Dialog                               */}
                {/* ════════════════════════════════════════════════ */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-[92vw] rounded-2xl sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {editingItem ? 'Edit' : 'Tambah'} {tabLabel(activeTab)}
                            </DialogTitle>
                            <DialogDescription>
                                {activeTab === 'terms'
                                    ? 'Isi tahun ajaran dan semester. Tandai aktif bila ini term berjalan.'
                                    : activeTab === 'subjects'
                                      ? 'Isi kode, nama, dan deskripsi mata pelajaran.'
                                      : 'Pilih mata pelajaran, guru, term, dan kapasitas kelas.'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            {/* ── Term Fields ───────────────────── */}
                            {activeTab === 'terms' && (
                                <>
                                    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                                        <Label htmlFor="tahun" className="text-left sm:text-right">
                                            Tahun Ajaran
                                        </Label>
                                        <Input
                                            id="tahun"
                                            value={(formData.tahun as string) || ''}
                                            onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                                            className="col-span-1 sm:col-span-3"
                                            placeholder="2024/2025"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                                        <Label htmlFor="semester" className="text-left sm:text-right">
                                            Semester
                                        </Label>
                                        <div className="col-span-1 sm:col-span-3">
                                            <Select
                                                value={(formData.semester as string) || ''}
                                                onValueChange={(value) => setFormData({ ...formData, semester: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih semester" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ganjil">Ganjil</SelectItem>
                                                    <SelectItem value="genap">Genap</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                                        <Label htmlFor="aktif" className="text-left sm:text-right">
                                            Status Aktif
                                        </Label>
                                        <div className="col-span-1 sm:col-span-3">
                                            <Select
                                                value={String(Boolean(formData.aktif))}
                                                onValueChange={(value) => setFormData({ ...formData, aktif: value === 'true' })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="true">Aktif</SelectItem>
                                                    <SelectItem value="false">Tidak Aktif</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── Subject Fields ────────────────── */}
                            {activeTab === 'subjects' && (
                                <>
                                    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                                        <Label htmlFor="kode" className="text-left sm:text-right">
                                            Kode
                                        </Label>
                                        <Input
                                            id="kode"
                                            value={(formData.kode as string) || ''}
                                            onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                            className="col-span-1 sm:col-span-3"
                                            placeholder="MTK001"
                                            maxLength={30}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                                        <Label htmlFor="nama" className="text-left sm:text-right">
                                            Nama
                                        </Label>
                                        <Input
                                            id="nama"
                                            value={(formData.nama as string) || ''}
                                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                            className="col-span-1 sm:col-span-3"
                                            placeholder="Matematika"
                                            maxLength={150}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-start sm:gap-4">
                                        <Label htmlFor="deskripsi" className="mt-2 text-left sm:text-right">
                                            Deskripsi
                                        </Label>
                                        <Textarea
                                            id="deskripsi"
                                            value={(formData.deskripsi as string) || ''}
                                            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                            className="col-span-1 sm:col-span-3"
                                            placeholder="Deskripsi mata pelajaran..."
                                            rows={3}
                                        />
                                    </div>
                                </>
                            )}

                            {/* ── Section Fields ────────────────── */}
                            {activeTab === 'sections' && (
                                <>
                                    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                                        <Label htmlFor="subject_id" className="text-left sm:text-right">
                                            Mata Pelajaran
                                        </Label>
                                        <div className="col-span-1 sm:col-span-3">
                                            <Select
                                                value={formData.subject_id?.toString() || ''}
                                                onValueChange={(value) => setFormData({ ...formData, subject_id: parseInt(value) })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih mata pelajaran" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(allSubjects ?? []).map((subject) => (
                                                        <SelectItem key={subject.id} value={subject.id.toString()}>
                                                            {subject.kode} - {subject.nama}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                                        <Label htmlFor="guru_id" className="text-left sm:text-right">
                                            Guru Pengampu
                                        </Label>
                                        <div className="col-span-1 sm:col-span-3">
                                            <Select
                                                value={formData.guru_id?.toString() || ''}
                                                onValueChange={(value) => setFormData({ ...formData, guru_id: parseInt(value) })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih guru" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {gurus.map((g) => (
                                                        <SelectItem key={g.id} value={g.id.toString()}>
                                                            {g.name}
                                                            {g.mapel_keahlian ? ` — ${g.mapel_keahlian}` : ''}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                                        <Label htmlFor="term_id" className="text-left sm:text-right">
                                            Term
                                        </Label>
                                        <div className="col-span-1 sm:col-span-3">
                                            <Select
                                                value={formData.term_id?.toString() || ''}
                                                onValueChange={(value) => setFormData({ ...formData, term_id: parseInt(value) })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih term" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {terms.map((term) => (
                                                        <SelectItem key={term.id} value={term.id.toString()}>
                                                            {term.tahun} - {term.semester.charAt(0).toUpperCase() + term.semester.slice(1)}
                                                            {term.aktif ? ' (Aktif)' : ''}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                                        <Label htmlFor="kapasitas" className="text-left sm:text-right">
                                            Kapasitas
                                        </Label>
                                        <Input
                                            id="kapasitas"
                                            type="number"
                                            value={(formData.kapasitas as number) ?? ''}
                                            onChange={(e) => setFormData({ ...formData, kapasitas: parseInt(e.target.value) || 0 })}
                                            className="col-span-1 sm:col-span-3"
                                            placeholder="30"
                                            min={1}
                                            max={100}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                Batal
                            </Button>
                            <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
                                {isSubmitting ? 'Menyimpan...' : editingItem ? 'Perbarui' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ════════════════════════════════════════════════ */}
                {/* Import Dialogs                                  */}
                {/* ════════════════════════════════════════════════ */}
                <ImportDialog
                    open={openImport === 'subjects'}
                    onOpenChange={(v) => setOpenImport(v ? 'subjects' : null)}
                    uploadUrl="/admin/master-data/import-subjects"
                    title="Import Mata Pelajaran"
                />

                <ImportDialog
                    open={openImport === 'sections'}
                    onOpenChange={(v) => setOpenImport(v ? 'sections' : null)}
                    uploadUrl="/admin/master-data/import-sections"
                    title="Import Kelas / Section"
                />
            </div>
        </AppLayout>
    );
}
