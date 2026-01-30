import { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Menu, X, BookOpen, GraduationCap, 
  Library, ArrowRight, MapPin, Mail, Phone,
  CheckCircle2
} from "lucide-react";

// --- IMPORT CHAT WIDGET ---
import ChatWidget from "@/components/Chatbot/ChatWidget";

// --- KOMPONEN ANIMASI ---
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }} 
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Kelembagaan({ auth }: any) {
  const [open, setOpen] = useState<boolean>(false);
  const user = auth?.user;
  const userRole = user?.roles?.[0]?.name || null;

  // Navigasi
  const navLinks = [
    { name: "Beranda", href: "/#hero" },
    { name: "Profil", href: "/#profil" },
    { name: "Berita", href: route('public.berita.index') },
    { name: "Program", href: "/#program" },
    { name: "Kelembagaan", href: "/kelembagaan" },
  ]


  return (
    <div className="min-h-screen bg-slate-50 font-['Poppins'] text-slate-800 overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900 relative">
      
      <Head>
        <title>Kelembagaan -  PPTA Abdullah Al Busyroni</title>
        {/* Font Injection Manual */}
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        `}</style>
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
            <Link href="/" className="flex items-center cursor-pointer group">
              <img 
                src="/images/logosekolah.png" 
                alt="Logo  PPTA" 
                className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative group py-2 ${
                      link.name === "Kelembagaan" ? "text-emerald-600 font-bold" : "text-slate-600 hover:text-emerald-600"
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-emerald-500 transition-all duration-300 ${
                      link.name === "Kelembagaan" ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              ))}
              
              <Link href={user ? route("dashboard") : route("login")}>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 h-11 text-sm font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                  {user ? 'Dashboard' : 'Login Sistem'}
                </Button>
              </Link>
            </nav>

            <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition">
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

      {/* ================= HERO SECTION ================= */}
      <section className="pt-40 pb-20 bg-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-white to-white opacity-70"></div>
         <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10 text-center max-w-4xl mx-auto">
            <FadeIn>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6">
                    <Library className="w-4 h-4" />
                    Struktur Pendidikan
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                    Unit Kelembagaan <br/> <span className="text-emerald-600">PPTA Abdullah Al Busyroni</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                    Kami menyelenggarakan pendidikan terintegrasi mulai dari tingkat menengah hingga atas dengan fokus pada hafalan Al-Qur'an dan penguasaan ilmu pengetahuan.
                </p>
            </FadeIn>
         </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main className="pb-24 bg-slate-50 relative">
        <div className="container mx-auto px-4 md:px-12 lg:px-20 max-w-6xl space-y-16 lg:space-y-24">

            {/* 1. TAHFIZ AL-QUR'AN */}
            <FadeIn className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-10 items-center">
                <div className="lg:w-1/2 space-y-6">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Tahfiz Al-Qur'an</h2>
                    <p className="text-slate-600 leading-loose">
                        Program unggulan yang menjadi ruh pendidikan di PPTA Abdullah Al Busyroni. Santri dibimbing secara intensif untuk menghafal Al-Qur'an 30 Juz dengan metode yang sistematis, mutqin, dan bersanad. Kami menekankan tidak hanya pada kuantitas hafalan, tetapi juga kualitas bacaan (tajwid) dan pemahaman (tadabbur).
                    </p>
                    <ul className="space-y-3 pt-2">
                        {[
                            "Target hafalan 30 Juz mutqin",
                            "Setoran hafalan setiap hari (ziyadah & murajaah)",
                            "Ujian Tasmi' sekali duduk",
                            "Sanad bacaan bersambung ke Rasulullah SAW"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:w-1/2 w-full">
                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 shadow-lg">
                        {/* Ganti src dengan gambar tahfiz yang asli jika ada */}
                        <img 
                            src="/images/tahfiz.png" 
                            alt="Kegiatan Tahfiz" 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </FadeIn>

            {/* 2.  (MADRASAH TSANAWIYAH) */}
            <FadeIn className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row-reverse gap-10 items-center">
                <div className="lg:w-1/2 space-y-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900"> (Madrasah Tsanawiyah)</h2>
                    <p className="text-slate-600 leading-loose">
                        Jenjang pendidikan setingkat SMP yang memadukan kurikulum nasional (Kemenag) dengan kurikulum kepesantrenan. Di tingkat ini, kami fokus pada pembentukan karakter dasar santri, kemandirian, dan penguasaan dasar-dasar bahasa Arab serta Inggris.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-1">Akademik</h4>
                            <p className="text-xs text-slate-500">Sains, Matematika, Bahasa Inggris, Teknologi Informasi.</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-1">Diniyah</h4>
                            <p className="text-xs text-slate-500">Aqidah Akhlak, Fiqih Dasar, Bahasa Arab, Nahwu Shorof.</p>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/2 w-full">
                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 shadow-lg">
                        <img 
                            src="/images/mts.png"  
                            alt="Kegiatan Makan " 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </FadeIn>

            {/* 3. MA (MADRASAH ALIYAH) */}
            <FadeIn className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-10 items-center">
                <div className="lg:w-1/2 space-y-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
                        <Library className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">MA (Madrasah Aliyah)</h2>
                    <p className="text-slate-600 leading-loose">
                        Jenjang pendidikan setingkat SMA yang mempersiapkan santri untuk melanjutkan ke perguruan tinggi (PTN/PTKIN) maupun berkiprah di masyarakat. Kurikulum MA didesain untuk pendalaman ilmu syar'i (Kitab Kuning) serta penguatan skill riset dan kepemimpinan.
                    </p>
                    <ul className="space-y-3 pt-2">
                        {[
                            "Jurusan IPA & Keagamaan",
                            "Bimbingan intensif masuk PTN/Timur Tengah",
                            "Kajian Kitab Kuning tingkat lanjut",
                            "Program pengabdian masyarakat & dakwah"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                                <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:w-1/2 w-full">
                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 shadow-lg">
                        <img 
                            src="/images/ma.png"  
                            alt="Kegiatan MA" 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </FadeIn>

        </div>
      </main>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-20 bg-emerald-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-800 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 opacity-50"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Bergabunglah Bersama Kami</h2>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-10 font-light">
                Siapkan masa depan putra-putri Anda dengan pendidikan terbaik yang menyeimbangkan kecerdasan intelektual dan spiritual.
            </p>
            <Link href={route("registrasi.index")}>
                <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 rounded-full px-10 h-14 text-base font-bold shadow-xl transition-all hover:scale-105">
                    Daftar Sekarang <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </Link>
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

      <ChatWidget isAuthenticated={!!user} userRole={userRole as any} />
    </div>
  )
}