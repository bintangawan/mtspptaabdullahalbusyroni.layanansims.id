import { useState, useEffect, useRef, ReactNode } from "react";
import { Link, Head } from "@inertiajs/react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Menu, X, School, BookOpen, Calendar, ArrowRight, 
  MapPin, Mail, Phone, ChevronRight
} from "lucide-react";

// --- IMPORT CHAT WIDGET ---
import ChatWidget from "@/components/Chatbot/ChatWidget";

// --- TIPE DATA ---
interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    image: string | null;
    created_at: string;
    tags?: string;
    author: {
        name: string;
    };
}

interface AllBeritaProps {
    auth: {
        user: {
            name: string;
            roles: { name: string }[]; 
        } | null;
    };
}

// --- ANIMASI FADE IN ---
const FadeIn = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay: delay, ease: [0.22, 1, 0.36, 1] }} 
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Helper: Membersihkan tag HTML untuk excerpt
const stripHtml = (html: string) => {
   if (!html) return "";
   const tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
};

export default function AllBerita({ auth }: AllBeritaProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Data User untuk Header & Chatbot
  const user = auth?.user;
  const userRole = user?.roles?.[0]?.name || null;

  // --- FETCH DATA BERITA ---
  useEffect(() => {
    const fetchAllNews = async () => {
        try {
            const response = await fetch('/api/all-news');
            if (response.ok) {
                const data = await response.json();
                // Jika controller mengembalikan pagination (data.data), sesuaikan di sini
                setPosts(Array.isArray(data) ? data : data.data || []);
            }
        } catch (error) {
            console.error("Gagal mengambil berita:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchAllNews();
  }, []);

  // Navigasi Header
  const navLinks = [
    { name: "Beranda", href: "/#hero" },
    { name: "Profil", href: "/#profil" },
    { name: "Berita", href: "/berita" }, // Aktif di halaman ini
    { name: "Program", href: "/#program" },
    { name: "Kelembagaan", href: route('public.kelembagaan') }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-['Poppins'] text-slate-800 overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900 relative">
      
      <Head>
        <title>Berita & Kegiatan -  PPTA Abdullah Al Busyroni</title>
        {/* Font Injection */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      {/* ================= HEADER ================= */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm"
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-center justify-between h-24">
            {/* Logo Section */}
            <Link href="/" className="flex items-center cursor-pointer group">
              <img 
                src="/images/logosekolah.png" 
                alt="Logo  PPTA Abdullah Al Busyroni" 
                className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative group py-2 ${
                      link.name === "Berita" ? "text-emerald-600 font-semibold" : "text-slate-600 hover:text-emerald-600"
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-emerald-500 transition-all duration-300 ${
                      link.name === "Berita" ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              ))}
              
              <Link href={user ? route("dashboard") : route("login")}>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 h-11 text-sm font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                  {user ? 'Dashboard' : 'Login Sistem'}
                </Button>
              </Link>
            </nav>

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden bg-white border-t px-6 pb-8 shadow-xl"
          >
            <div className="flex flex-col space-y-4 pt-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-slate-600 py-3 border-b border-slate-50 hover:text-emerald-600"
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link href={user ? route("dashboard") : route("login")} className="pt-4">
                <Button className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-lg">
                   {user ? 'Ke Dashboard' : 'Masuk Sistem'}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* ================= HERO TITLE SECTION ================= */}
      <section className="pt-40 pb-16 bg-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5"></div>
         <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10 text-center">
            <FadeIn>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                    Arsip Berita & Kegiatan
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light">
                    Jelajahi seluruh dokumentasi kegiatan, prestasi santri, dan informasi terbaru dari lingkungan  PPTA Abdullah Al Busyroni.
                </p>
            </FadeIn>
         </div>
      </section>

      {/* ================= MAIN GRID CONTENT ================= */}
      <section id="berita" className="py-16 md:py-24 bg-slate-50 relative min-h-[600px]">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl">

          {/* GRID RESPONSIVE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {loading ? (
              // SKELETON LOADING
              [1, 2, 3, 4, 5, 6].map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-white p-4 shadow-sm h-[420px] animate-pulse border border-slate-100 flex flex-col"
                >
                  <div className="bg-slate-200 h-56 rounded-2xl mb-5 w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3 mt-auto"></div>
                </div>
              ))
            ) : posts.length > 0 ? (
              // CONTENT CARD
              posts.map((post, i) => (
                <FadeIn key={post.id} delay={i * 0.05} className="h-full">
                  <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-slate-100 h-full flex flex-col cursor-default">

                    {/* IMAGE WRAPPER */}
                    <div className="relative h-60 overflow-hidden bg-slate-100">
                      {post.image ? (
                        <img
                          src={`/storage/${post.image}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          alt={post.title}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <School className="w-16 h-16 opacity-50" />
                        </div>
                      )}
                      
                      {/* Overlay Gradient on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* CONTENT */}
                    <Link
                      href={route("public.berita.show", post.slug)}
                      className="p-7 flex flex-col flex-1"
                    >
                      <div className="flex items-center gap-2 text-slate-400 text-xs mb-3 font-medium uppercase tracking-wider">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 font-light">
                        {stripHtml(post.content)}
                      </p>

                      <div className="mt-auto pt-4 border-t border-slate-50">
                        <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm group-hover:gap-3 transition-all duration-300">
                          Baca Selengkapnya
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>

                  </div>
                </FadeIn>
              ))
            ) : (
              // EMPTY STATE
              <div className="col-span-full text-center py-20">
                <div className="inline-block p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm text-slate-400 mb-4">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30 text-emerald-500" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-1">Belum Ada Berita</h3>
                  <p className="text-sm font-light">Saat ini belum ada berita atau kegiatan yang dipublikasikan.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ================= LOKASI & MAPS SECTION ================= */}
            <section className="py-24 bg-slate-50 border-t border-slate-200">
              <div className="container mx-auto px-6 md:px-12 lg:px-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  
                  {/* KIRI: Informasi Kontak */}
                  <FadeIn>
                    <div className="space-y-8">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4">
                          <MapPin className="w-4 h-4" />
                          Lokasi Kami
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                          Kunjungi PPTA Abdullah Al Busyroni
                        </h2>
                        <p className="text-slate-600 text-lg font-light leading-relaxed">
                          Kami menantikan silaturahmi Anda. Mari melihat langsung lingkungan pendidikan yang asri dan kondusif bagi para santri.
                        </p>
                      </div>
      
                      <div className="space-y-6">
                        {/* Alamat */}
                        <div className="flex items-start gap-5">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 shrink-0">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 mb-1 text-lg">Alamat</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                              Jl. Bedagai Dusun VIII, Kec. Sei Rampah,<br />
                              Kab. Serdang Bedagai, Prov. Sumatera Utara
                            </p>
                          </div>
                        </div>
      
                        {/* Email */}
                        <div className="flex items-start gap-5">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 shrink-0">
                            <Mail className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 mb-1 text-lg">Email</h4>
                            <a href="mailto:mahadabdullahalbusyroni@gmail.com" className="text-slate-600 text-sm hover:text-emerald-600 transition-colors">
                              mahadabdullahalbusyroni@gmail.com
                            </a>
                          </div>
                        </div>
      
                        {/* Telepon */}
                        <div className="flex items-start gap-5">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 shrink-0">
                            <Phone className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 mb-1 text-lg">Humas Pesantren</h4>
                            <p className="text-slate-600 text-sm">
                              0852-7527-9289
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
      
                  {/* KANAN: Maps Iframe */}
                  {/* KANAN: Maps Iframe */}
                <FadeIn delay={0.2}>
                  <div className="relative w-full h-[450px] bg-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                    <iframe 
                      title="Lokasi PPTA Abdullah Al Busyroni"
                      // URL ini menggunakan parameter 'q' (query) dengan nama tempat spesifik agar muncul PIN MERAH
                      src="https://maps.google.com/maps?q=Pondok%20Pesantren%20Tahfidz%20Al%20Qur%E2%80%99an%20Abdullah%20Al%20Busyroni&t=&z=17&ie=UTF8&iwloc=&output=embed"
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen={true} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full transition-all duration-700 ease-in-out"
                    ></iframe>
                    
                    {/* Overlay Badge */}
                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-100 text-xs font-semibold text-slate-700 hidden sm:block">
                      📍 Google Maps Location
                    </div>
                  </div>
                </FadeIn>
      
                </div>
              </div>
            </section>
            {/* ================= FOOTER ================= */}
            <footer id="kontak" className="bg-slate-900 text-slate-300 pt-24 pb-12 rounded-t-[3rem] mt-12">
              <div className="container mx-auto px-6 md:px-12 lg:px-20">
                <div className="grid md:grid-cols-4 gap-12 lg:gap-16 mb-16">
                  {/* Brand */}
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="bg-white p-2 rounded-xl inline-block">
                          <img 
                              src="/images/logosekolah.png" 
                              alt=" PPTA Logo" 
                              className="h-12 w-auto object-contain"
                          />
                      </div>
                    </div>
                    <p className="text-slate-400 leading-relaxed max-w-md text-lg font-light">
                      Berkomitmen menyelenggarakan pendidikan yang integratif, melahirkan generasi yang sholeh, cerdas, dan mandiri.
                    </p>
                  </div>
      
                  {/* Quick Links */}
                  <div>
                    <h4 className="text-white font-bold text-lg mb-8">Menu Utama</h4>
                    <ul className="space-y-4">
                      {navLinks.map((link) => (
                          <li key={link.name}>
                              <a href={link.href} className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group">
                                   <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-emerald-400 transition-colors"></span>
                                   {link.name}
                              </a>
                          </li>
                      ))}
                    </ul>
                  </div>
      
                  {/* Contact */}
                  <div>
                    <h4 className="text-white font-bold text-lg mb-8">Hubungi Kami</h4>
                    <ul className="space-y-6">
                      <li className="flex items-start gap-4">
                        <MapPin className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="leading-relaxed">Jl. Bedagai Dusun VIII, Kec. Sei Rampah,
      Kab. Serdang Bedagai, Prov. Sumatera Utara</span>
                      </li>
                      <li className="flex items-center gap-4">
                          <Mail className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <span>mahadabdullahalbusyroni@gmail.com</span>
                      </li>
                       <li className="flex items-center gap-4">
                          <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <span>0852-7527-9289</span>
                      </li>
                    </ul>
                  </div>
                </div>
      
                <div className="pt-10 border-t border-slate-800 text-center md:flex md:justify-between md:items-center text-sm text-slate-500">
                  <p className="mb-4 md:mb-0">© {new Date().getFullYear()}  PPTA Abdullah Al Busyroni. All rights reserved.</p>
                  <p className="flex items-center justify-center gap-2">
                      Dibuat dengan <span className="text-red-500">❤</span> untuk Pendidikan
                  </p>
                </div>
              </div>
            </footer>

      {/* ================= CHATBOT WIDGET ================= */}
      <ChatWidget 
        isAuthenticated={!!user} 
        userRole={userRole as any} 
      />

    </div>
  )
}