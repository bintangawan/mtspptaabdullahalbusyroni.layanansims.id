import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, User, Tag } from 'lucide-react';
import sanitizeHtml from 'sanitize-html';

export default function Show({ post }: any) {
    // Sanitasi HTML untuk keamanan saat menggunakan dangerouslySetInnerHTML
    const cleanContent = sanitizeHtml(post.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'span']),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            '*': ['style', 'class'],
        }
    });

    return (
        <AppLayout>
            <Head title={post.title} />
            <div className="p-4 md:p-8 max-w-4xl mx-auto">
                {/* Header Nav */}
                <div className="mb-6 flex items-center justify-between">
                    <Link href={route('admin.berita.index')} className="flex items-center text-sm text-muted-foreground hover:text-emerald-600">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Kembali ke Daftar
                    </Link>
                    <Link href={route('admin.berita.edit', post.id)}>
                        <Button variant="outline">Edit Berita Ini</Button>
                    </Link>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden">
                    {/* Hero Image */}
                    {post.image ? (
                        <div className="w-full h-64 md:h-96 bg-slate-100">
                            <img 
                                src={`/storage/${post.image}`} 
                                alt={post.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-48 bg-emerald-50 flex items-center justify-center text-emerald-200">
                            <span className="text-4xl font-bold">No Image</span>
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        {/* Meta Data */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                            <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border">
                                <Calendar className="w-4 h-4 text-emerald-600" />
                                {new Date(post.created_at).toLocaleDateString('id-ID', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </div>
                            <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border">
                                <User className="w-4 h-4 text-blue-600" />
                                {post.author.name}
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">
                            {post.title}
                        </h1>

                        {/* Tags */}
                        {post.tags && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {post.tags.split(',').map((tag: string, idx: number) => (
                                    <span key={idx} className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                        <Tag className="w-3 h-3" />
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}

                        <hr className="mb-8 border-slate-100" />

                        {/* WYSIWYG Content Render */}
                        <div 
                            className="prose prose-lg prose-slate max-w-none prose-img:rounded-xl prose-a:text-emerald-600"
                            dangerouslySetInnerHTML={{ __html: cleanContent }}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}