import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft } from 'lucide-react';
import ReactQuill from 'react-quill-new'; // Menggunakan library baru
import 'react-quill-new/dist/quill.snow.css';

// Definisikan tipe form agar tidak error "excessively deep"
interface CreateForm {
    title: string;
    content: string;
    image: File | null;
    tags: string;
    is_published: number;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<CreateForm>({
        title: '',
        content: '',
        image: null,
        tags: '',
        is_published: 1,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.berita.store'));
    };

    // Handler khusus untuk react-quill agar tipe datanya jelas
    const handleContentChange = (content: string) => {
        setData('content', content);
    };

    return (
        <AppLayout>
            <Head title="Tambah Berita" />
            <div className="p-4 md:p-8 max-w-5xl mx-auto">
                <div className="mb-6">
                    <Link href={route('admin.berita.index')} className="flex items-center text-sm text-muted-foreground hover:text-emerald-600 transition-colors">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-bold mt-2">Buat Berita Baru</h1>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom Kiri: Form Utama */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                            <div>
                                <Label htmlFor="title">Judul Berita</Label>
                                <Input 
                                    id="title"
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)} 
                                    placeholder="Contoh: Kegiatan Upacara Hari Senin..." 
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <Label htmlFor="tags">Tagar / Kategori (Pisahkan dengan koma)</Label>
                                <Input 
                                    id="tags"
                                    value={data.tags} 
                                    onChange={e => setData('tags', e.target.value)} 
                                    placeholder="Contoh: #Pendidikan, #Prestasi, #Santri" 
                                    className="font-medium text-emerald-600"
                                />
                                {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
                            </div>

                            <div>
                                <Label>Konten Utama</Label>
                                <div className="mt-2 h-80 mb-12">
                                    <ReactQuill 
                                        theme="snow" 
                                        value={data.content} 
                                        onChange={handleContentChange}
                                        className="h-[250px]"
                                    />
                                </div>
                                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Pengaturan Tambahan */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                            <div>
                                <Label>Gambar Utama (Thumbnail)</Label>
                                <Input 
                                    type="file" 
                                    className="mt-2"
                                    accept="image/*"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setData('image', e.target.files[0]);
                                        }
                                    }}
                                />
                                <p className="text-[10px] text-muted-foreground mt-2 italic">*Maksimal 2MB (JPG, PNG)</p>
                                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                            </div>

                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                            >
                                {processing ? 'Menyimpan...' : 'Terbitkan Sekarang'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}