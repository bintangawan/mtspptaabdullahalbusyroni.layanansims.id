import { useState, useEffect, useCallback } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Pastikan komponen Input ada
import { Plus, Edit, Trash2, Search, Filter, XCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { debounce } from 'lodash'; // Jika tidak punya lodash, kita pakai manual debounce di bawah

// Props yang diterima dari Controller
interface IndexProps {
    posts: any;
    filters: {
        search?: string;
        month?: string;
        year?: string;
    };
}

export default function Index({ posts, filters }: IndexProps) {
    const { delete: destroy } = useForm();

    // State untuk filter
    const [search, setSearch] = useState(filters.search || '');
    const [month, setMonth] = useState(filters.month || '');
    const [year, setYear] = useState(filters.year || '');

    // List Tahun (Generate 5 tahun ke belakang)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

    // List Bulan
    const months = [
        { value: '1', label: 'Januari' },
        { value: '2', label: 'Februari' },
        { value: '3', label: 'Maret' },
        { value: '4', label: 'April' },
        { value: '5', label: 'Mei' },
        { value: '6', label: 'Juni' },
        { value: '7', label: 'Juli' },
        { value: '8', label: 'Agustus' },
        { value: '9', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ];

    // --- LOGIC SEARCH REALTIME (Debounce) ---
    // Efek ini akan jalan setiap kali search, month, atau year berubah
    useEffect(() => {
        const timer = setTimeout(() => {
            // Hanya request jika ada perubahan nilai dari props asli (untuk menghindari double request saat mount)
            if (
                search !== (filters.search || '') || 
                month !== (filters.month || '') || 
                year !== (filters.year || '')
            ) {
                router.get(
                    route('admin.berita.index'),
                    { search, month, year }, // Kirim parameter
                    {
                        preserveState: true, // Jangan refresh full page component
                        preserveScroll: true, // Jangan scroll ke atas
                        replace: true, // Ganti history browser (agar back button rapi)
                    }
                );
            }
        }, 300); // Tunggu 300ms setelah user berhenti mengetik/memilih

        return () => clearTimeout(timer);
    }, [search, month, year]);

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            destroy(route('admin.berita.destroy', id));
        }
    };

    // Fungsi Reset Filter
    const resetFilter = () => {
        setSearch('');
        setMonth('');
        setYear('');
    };

    return (
        <AppLayout>
            <Head title="Manajemen Berita" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                
                {/* Header Title & Add Button */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Berita & Kegiatan</h1>
                        <p className="text-sm text-muted-foreground">Kelola konten berita, artikel, dan pengumuman kegiatan.</p>
                    </div>
                    <Link href={route('admin.berita.create')}>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto shadow-sm">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Berita
                        </Button>
                    </Link>
                </div>

                {/* --- FILTER SECTION --- */}
                <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari judul berita..."
                                className="pl-9 bg-slate-50 border-slate-200"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Filter Bulan */}
                        <div className="w-full md:w-48">
                            <select
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                <option value="">Semua Bulan</option>
                                {months.map((m) => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filter Tahun */}
                        <div className="w-full md:w-32">
                            <select
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            >
                                <option value="">Semua Tahun</option>
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        {/* Reset Button */}
                        {(search || month || year) && (
                            <Button 
                                variant="ghost" 
                                onClick={resetFilter}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                                <XCircle className="mr-2 h-4 w-4" /> Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Tabel Data */}
                <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[40%]">Judul Berita</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Penulis</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.data.length > 0 ? (
                                posts.data.map((post: any) => (
                                    <TableRow key={post.id} className="hover:bg-slate-50/50">
                                        <TableCell className="font-medium">
                                            <div className="line-clamp-2" title={post.title}>
                                                {post.title}
                                            </div>
                                            {/* Tampilkan snippet tags kecil jika ada */}
                                            {post.tags && (
                                                <div className="flex gap-1 mt-1">
                                                    {post.tags.split(',').slice(0, 2).map((tag:string, idx:number) => (
                                                        <span key={idx} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                                                            #{tag.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                post.is_published 
                                                ? 'bg-emerald-100 text-emerald-800' 
                                                : 'bg-slate-100 text-slate-800'
                                            }`}>
                                                {post.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {post.author?.name || '-'}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(post.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell className="flex justify-end gap-2">
                                            <Link href={route('admin.berita.edit', post.id)}>
                                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                    <Edit className="h-4 w-4 text-slate-600" />
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="destructive" 
                                                size="sm" 
                                                className="h-8 w-8 p-0 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200"
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search className="h-8 w-8 mb-2 opacity-20" />
                                            <p>Tidak ada berita ditemukan.</p>
                                            {(search || month || year) && (
                                                <p className="text-xs text-muted-foreground mt-1">Coba ubah kata kunci atau reset filter.</p>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* --- PAGINATION SECTION --- */}
                {posts.data.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-start gap-4 mt-2">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan <span className="font-medium text-slate-900">{posts.from}</span> - <span className="font-medium text-slate-900">{posts.to}</span> dari <span className="font-medium text-slate-900">{posts.total}</span> data
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-1">
                            {posts.links.map((link: any, i: number) => {
                                // Render pagination links
                                return link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        preserveScroll
                                        preserveState // Penting agar filter tidak hilang saat ganti halaman
                                    >
                                        <Button
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            className={`h-8 min-w-[2rem] px-3 transition-all ${
                                                link.active 
                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600' 
                                                : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    </Link>
                                ) : (
                                    <Button
                                        key={i}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 min-w-[2rem] px-3 text-slate-300 cursor-not-allowed border-slate-100 bg-slate-50"
                                        disabled
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}