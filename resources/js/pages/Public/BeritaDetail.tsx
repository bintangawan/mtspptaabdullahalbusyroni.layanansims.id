import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

import {
    ChevronLeft,
    Calendar,
    User,
    Tag,
    Share2,
    Facebook,
    Instagram,
    Twitter,
    Copy,
} from "lucide-react";

import sanitizeHtml from "sanitize-html";

export default function BeritaDetail({ post }: any) {

    /* ===============================
       SANITIZE HTML
    =============================== */
    const cleanContent = sanitizeHtml(post.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            "img", "h1", "h2", "h3", "iframe", "span",
            "b", "i", "u", "br", "p", "ul", "ol", "li", "blockquote"
        ]),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            "*": ["style", "class"],
            img: ["src", "alt", "width", "height"],
        },
    });

    const formattedDate = new Date(post.created_at).toLocaleDateString(
        "id-ID",
        { weekday: "long", day: "numeric", month: "long", year: "numeric" }
    );

    /* ===============================
       SHARE FUNCTION
    =============================== */
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : "";

    const shareText = `Baca berita terbaru: ${post.title}`;

    const handleShare = (platform: string) => {
        let url = "";

        switch (platform) {
            case "facebook":
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
                break;
            case "twitter":
                url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
                break;
            case "instagram":
                // Instagram tidak punya share URL resmi
                navigator.clipboard.writeText(currentUrl);
                alert("Link disalin. Silakan tempel di Instagram.");
                return;
        }

        if (url) window.open(url, "_blank", "width=600,height=500");
    };

    /* ===============================
       UI
    =============================== */
    return (
        <div className="min-h-screen bg-slate-50 font-['Poppins'] text-slate-800 overflow-x-hidden">

            {/* ================= HEAD ================= */}
            <Head title={post.title}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* ================= HEADER LANDING STYLE ================= */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="container mx-auto px-6 md:px-12 max-w-6xl h-20 flex items-center justify-between">

                    <Link href="/" className="flex items-center gap-3 group">
                        <img
                            src="/images/logosekolah.png"
                            alt="Logo"
                            className="h-10 md:h-12 object-contain group-hover:scale-105 transition"
                        />
                    </Link>

                    <Link href="/">
                        <Button
                            variant="ghost"
                            className="gap-2 rounded-full text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                        >
                            <ChevronLeft className="h-5 w-5" />
                            Kembali
                        </Button>
                    </Link>
                </div>
            </header>

            {/* ================= CONTENT ================= */}
            <main className="container mx-auto px-4 md:px-6 pt-32 pb-20 max-w-4xl">

                {/* HEADER */}
                <header className="text-center mb-12">

                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wide mb-6">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6 break-words">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                        <User className="w-4 h-4 text-emerald-600" />
                        Ditulis oleh {post.author?.name ?? "Admin"}
                    </div>
                </header>

                {/* HERO IMAGE */}
                {post.image && (
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg mb-12 border border-slate-200">
                        <img
                            src={`/storage/${post.image}`}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                    </div>
                )}

                {/* ARTICLE */}
                <article className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100 overflow-hidden">

                    <div
                        className="prose prose-lg prose-slate max-w-none break-words
                        prose-headings:font-bold prose-headings:text-slate-900
                        prose-p:text-slate-600 prose-p:leading-loose
                        prose-img:rounded-2xl prose-img:w-full
                        prose-a:text-emerald-600 prose-a:break-all"
                        dangerouslySetInnerHTML={{ __html: cleanContent }}
                    />

                    <hr className="my-12 border-slate-100" />

                    {/* FOOTER */}
                    <div className="flex flex-col md:flex-row justify-between gap-10">

                        {/* TAGS */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Tag className="w-4 h-4" /> Topik
                            </h4>

                            {post.tags ? (
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.split(",").map((tag: string, i: number) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-sm"
                                        >
                                            #{tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400 italic text-sm">
                                    Tidak ada topik khusus
                                </p>
                            )}
                        </div>

                        {/* SHARE */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Share2 className="w-4 h-4" /> Bagikan
                            </h4>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleShare("facebook")}
                                    className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
                                >
                                    <Facebook className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => handleShare("twitter")}
                                    className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition"
                                >
                                    <Twitter className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => handleShare("instagram")}
                                    className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-600 hover:text-white transition"
                                >
                                    <Instagram className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(currentUrl);
                                        alert("Link disalin!");
                                    }}
                                    className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-800 hover:text-white transition"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </article>

                <div className="mt-16 text-center text-slate-400 text-sm">
                    © {new Date().getFullYear()}  PPTA Abdullah Al Busyroni
                </div>
            </main>
        </div>
    );
}
