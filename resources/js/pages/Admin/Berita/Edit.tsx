import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface EditForm {
    _method: string;
    title: string;
    content: string;
    tags: string;
    image: File | null;
    is_published: number;
}

export default function Edit({ post: berita }: any) {
    const { data, setData, post, processing, errors } = useForm<EditForm>({
        _method: 'PUT',
        title: berita.title,
        content: berita.content,
        tags: berita.tags || '',
        image: null,
        is_published: berita.is_published,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.berita.update', berita.id));
    };

    const handleContentChange = (content: string) => {
        setData('content', content);
    };

    return (
        <AppLayout>
            <Head title="Edit Berita" />
            <div className="p-4 md:p-8 max-w-5xl mx-auto">
                <div className="mb-6">
                    <Link href={route('admin.berita.index')} className="flex items-center text-sm text-muted-foreground">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Kembali
                    </Link>
                    <h1 className="text-2xl font-bold mt-2">Edit Berita</h1>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                            <div>
                                <Label>Judul</Label>
                                <Input value={data.title} onChange={e => setData('title', e.target.value)} />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <Label htmlFor="tags">Tagar (Pisahkan dengan koma)</Label>
                                <Input 
                                    value={data.tags} 
                                    onChange={e => setData('tags', e.target.value)} 
                                    className="font-medium text-emerald-600"
                                />
                            </div>
                            
                            <div>
                                <Label>Konten</Label>
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
                    <div className="bg-white p-6 rounded-xl border shadow-sm h-fit space-y-4">
                         {berita.image && (
                            <div className="mb-4">
                                <Label>Gambar Saat Ini</Label>
                                <img src={`/storage/${berita.image}`} alt="Current" className="w-full h-32 object-cover rounded-md mt-2" />
                            </div>
                        )}
                        <div>
                            <Label>Update Gambar (Opsional)</Label>
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
                        </div>
                        
                        <Button disabled={processing} className="w-full bg-emerald-600">Simpan Perubahan</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}