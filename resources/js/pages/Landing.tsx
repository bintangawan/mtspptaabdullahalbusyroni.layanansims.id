import { useState, useEffect, useRef, ReactNode } from "react" // Tambah useEffect
import { Link, Head } from "@inertiajs/react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"

// Icons
import {
  Menu, X, School, BookOpen, Users,
  Award, Globe, ArrowRight, Star,
  CheckCircle2, MapPin, Mail, Phone,
  FlaskConical, Cpu, Settings, Palette, Calculator,
  Calendar, Tag
} from "lucide-react"

// --- IMPORT CHAT WIDGET ---
import ChatWidget from "@/components/Chatbot/ChatWidget"

// --- 1. DEFINISI TIPE ---
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// Interface Props
interface LandingProps {
    auth: {
        user: {
            name: string;
            roles: { name: string }[]; 
        } | null;
    };
    // posts tidak lagi wajib dari props karena kita fetch sendiri
    [key: string]: any; 
}

// --- 2. KOMPONEN ANIMASI ---
const FadeIn = ({ children, delay = 0, className = "" }: FadeInProps) => {
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

// Helper: Membersihkan tag HTML
const stripHtml = (html: string) => {
   if (!html) return "";
   const tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
};

export default function Landing({ auth }: LandingProps) {
  const [open, setOpen] = useState<boolean>(false)
  
  // State untuk menyimpan berita hasil fetch
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);

  // Cek user login & role
  const user = auth?.user;
  const userRole = user?.roles?.[0]?.name || null;

  // --- FETCH DATA BERITA DI SINI ---
  useEffect(() => {
    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/landing-news');
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error("Gagal mengambil berita:", error);
        } finally {
            setLoadingPosts(false);
        }
    };

    fetchPosts();
  }, []);

  // Navigasi
  const navLinks = [
    { name: "Beranda", href: "#hero" },
    { name: "Profil", href: "#profil" },
    { name: "Berita", href: route('public.berita.index') },
    { name: "Program", href: "#program" },
    { name: "Kelembagaan", href: route('public.kelembagaan') },
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-['Poppins'] text-slate-800 overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900 relative">
      
      {/* --- SEO & FONTS --- */}
      <Head>
        <title> PPTA Abdullah Al Busyroni</title>
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
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img 
                src="/images/logosekolah.png" 
                alt="Logo  PPTA Abdullah Al Busyroni" 
                className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors relative group py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-500 transition-all duration-300 group-hover:w-full" />
                </a>
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
                <a
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-slate-600 py-3 border-b border-slate-50 hover:text-emerald-600"
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </a>
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

      {/* ================= HERO SECTION ================= */}
      <section id="hero" className="relative pt-40 pb-24 lg:pt-52 lg:pb-40 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-emerald-50/80 rounded-full blur-[100px] opacity-60 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-teal-50/80 rounded-full blur-[100px] opacity-60 -translate-x-1/4 translate-y-1/4" />

        <div className="container mx-auto px-6 md:px-12 lg:px-20 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-widest shadow-sm mb-8">
              <Star size={12} className="fill-emerald-600 text-emerald-600" />
              Pondok Pesantren Tahfiz Al-Qur'an
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1] max-w-5xl mx-auto">
                Hafal Qur'an, Berakhlak, Berilmu dan Berwawasan
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl font-semibold text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Pesantren Sehat Pertama di Sumatera Utara <br />
                Pesantren Digital dan Pesantren Ramah Anak
                </span>
            </p>
            </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-light">
               PPTA Abdullah Al Busyroni menggabungkan nilai-nilai luhur pesantren 
              dengan keunggulan teknologi modern untuk melahirkan generasi yang siap menghadapi masa depan.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">
                <Link
                href={route("registrasi.index")}
                target="_blank"
                rel="noopener noreferrer"
                >
                <Button
                    size="lg"
                    className="h-14 px-10 rounded-full text-base font-semibold bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200/50 hover:shadow-xl transition-all w-full sm:w-auto"
                >
                    Daftar PPDB Online
                </Button>
                </Link>

                <a href="#profil">
                <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-10 rounded-full text-base font-semibold border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 w-full sm:w-auto"
                >
                    Profil Sekolah
                </Button>
                </a>
            </div>
            </FadeIn>
        </div>
      </section>

      <FadeIn delay={0.4}>
        <div className="mt-5 flex justify-center">
            <a
            href="https://firebasestorage.googleapis.com/v0/b/indotema-5f7fa.appspot.com/o/pdf%2FBROSUR%20PPDB%202026-2027.pdf?alt=media&token=1f44461a-d192-4fe5-b963-53c01a0be8e1"
            target="_blank"
            rel="noopener noreferrer"
            >
            <Button
                size="sm"
                variant="outline"
                className="rounded-full px-6 py-3 text-sm font-medium border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-all flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17h16" />
                </svg>
                Download Brosur PPDB 2026/2027
            </Button>
            </a>
        </div>
      </FadeIn>

      {/* ================= STATS SECTION ================= */}
      <section className="py-10">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="bg-slate-900 rounded-[2.5rem] p-12 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-10">
               <svg width="200" height="200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2"/>
                  <path d="M50 10V90" stroke="white" strokeWidth="2"/>
                  <path d="M10 50H90" stroke="white" strokeWidth="2"/>
               </svg>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
              {[
                { label: "Santri Aktif", value: "51" },
                { label: "Tenaga Pendidik", value: "24" },
                { label: "Ekstrakurikuler", value: "21" },
                { label: "Alumni", value: "0" },
              ].map((stat, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="flex flex-col items-center">
                    <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">{stat.value}</div>
                    <div className="text-sm md:text-base text-slate-400 font-medium tracking-wide uppercase">{stat.label}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROFIL & ABOUT ================= */}
      <section id="profil" className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image Composition */}
            <FadeIn className="relative">
              <div className="absolute -inset-4 bg-emerald-100/50 rounded-[2rem] -rotate-3 opacity-60"></div>
              <div className="relative aspect-[4/3] w-full bg-slate-100 rounded-[2rem] overflow-hidden shadow-2xl">
                <img 
                  src="/images/ketuayayasan.png"
                  alt="Kegiatan Belajar Mengajar" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Terakreditasi A</p>
                    <p className="text-xs text-slate-500">Standar Pendidikan Nasional</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Content */}
            <FadeIn delay={0.2}>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-10 bg-emerald-600"></span>
                <span className="text-emerald-600 font-semibold uppercase tracking-widest text-sm">Tentang Madrasah</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                Sinergi Ilmu, Iman, dan Amal Shaleh
              </h2>
              <p className="text-slate-600 mb-8 leading-loose text-lg font-light">
                 PPTA Abdullah Al Busyroni bukan sekadar sekolah, melainkan ekosistem tumbuh kembang. 
                Kami percaya bahwa kecerdasan akademik harus berjalan beriringan dengan kematangan spiritual. 
                Kurikulum kami didesain untuk mencetak pemimpin masa depan yang berkarakter Qur'ani.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Kurikulum Terintegrasi",
                  "Fasilitas Multimedia Lengkap",
                  "Program Tahfidz Intensif",
                  "Lingkungan Asri & Kondusif"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
                      <CheckCircle2 className="text-emerald-600 w-5 h-5 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-slate-700 font-medium group-hover:text-emerald-700 transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ================= BERITA & KEGIATAN (CLIENT SIDE FETCH) ================= */}
      <section id="berita" className="py-20 lg:py-28 bg-slate-50 relative">
  <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl">

    {/* Header */}
    <div className="text-center max-w-3xl mx-auto mb-16">
      <FadeIn>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Berita & Kegiatan
        </h2>
        <p className="text-slate-600 text-base md:text-lg font-light">
          Ikuti perkembangan terbaru dan aktivitas santri di  PPTA
          Abdullah Al Busyroni.
        </p>
      </FadeIn>
    </div>

    {/* GRID RESPONSIVE */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

      {loadingPosts ? (
        [1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="rounded-3xl bg-white p-4 shadow-sm h-96 animate-pulse border border-slate-100"
          >
            <div className="bg-slate-200 h-44 rounded-2xl mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        ))
      ) : posts.length > 0 ? (
        posts.map((post, i) => (
          <FadeIn key={post.id} delay={i * 0.1} className="h-full">

            {/* CARD */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 h-full flex flex-col">

              {/* IMAGE */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                {post.image ? (
                  <img
                    src={`/storage/${post.image}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={post.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <School className="w-14 h-14 opacity-50" />
                  </div>
                )}
              </div>

              {/* CONTENT LINK */}
              <Link
                href={route("public.berita.show", post.slug)}
                className="p-5 md:p-6 flex flex-col flex-1"
              >
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-2 font-medium uppercase tracking-wider">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                  {stripHtml(post.content)}
                </p>

                <div className="mt-auto">
                  <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm group-hover:underline">
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>

            </div>

          </FadeIn>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <div className="inline-block p-6 rounded-2xl bg-slate-100 text-slate-400 mb-4">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="font-medium">Belum ada berita terbaru.</p>
          </div>
        </div>
      )}
    </div>
  </div>
  {/* Di bawah Grid 3 berita di Landing.tsx */}
<div className="mt-12 text-center">
    <Link href={route('public.berita.index')}>
        <Button variant="outline" className="rounded-full px-8 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
            Lihat Semua Berita & Kegiatan
        </Button>
    </Link>
</div>
</section>



      {/* ================= PROGRAM UNGGULAN ================= */}
      <section id="program" className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Program Unggulan</h2>
              <p className="text-slate-600 text-lg font-light">Fokus pengembangan skill dan karakter santri.</p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-6 rounded-full group">
                {/* Space untuk tombol selengkapnya jika perlu */}
              </Button>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
                {
                    title: "Science",
                    icon: <FlaskConical />,
                    desc: "Santri diajak memahami dan meneliti fenomena alam melalui eksperimen serta observasi ilmiah."
                },
                {
                    title: "Technology",
                    icon: <Cpu />,
                    desc: "Mengembangkan kemampuan menggunakan teknologi digital secara bijak mulai dari komputer, coding, hingga media digital pesantren."
                },
                {
                    title: "Engineering",
                    icon: <Settings />,
                    desc: "Melatih santri berpikir logis dan solutif dalam merancang, membangun, dan memperbaiki melalui proyek kreatif."
                },
                {
                    title: "Art",
                    icon: <Palette />,
                    desc: "Menumbuhkan ekspresi kreatif melalui desain, seni visual, dan komunikasi yang bernilai estetika dan kebaikan."
                },
                {
                    title: "Mathematics",
                    icon: <Calculator />,
                    desc: "Meningkatkan kemampuan berpikir analitis, logis, dan sistematis untuk mendukung kecakapan sains dan teknologi."
                },
            ]
            .map((prog, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-emerald-200 hover:shadow-xl transition-all duration-300 group cursor-default h-full">
                  <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    {prog.icon}
                  </div>
                  <h4 className="font-bold text-xl text-slate-900 mb-2">{prog.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{prog.desc}</p>
                </div>
              </FadeIn>
            ))}
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