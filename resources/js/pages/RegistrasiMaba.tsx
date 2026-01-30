import { Head, useForm, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Send, CheckCircle2, School } from "lucide-react";
import { useState } from "react";

// Definisikan Interface untuk Data Form (Opsional, untuk TypeScript strict)
interface FormData {
  nama_lengkap: string;
  nisn: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  alamat: string;
  asal_sekolah: string;
  nama_ayah: string;
  nama_ibu: string;
  no_hp_ortu: string;
}

export default function RegistrasiMaba() {
  const { data, setData, post, processing, errors, reset } = useForm<FormData>({
    nama_lengkap: "",
    nisn: "", 
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "L",
    alamat: "",
    asal_sekolah: "",
    nama_ayah: "",
    nama_ibu: "",
    no_hp_ortu: "",
  });

  const [success, setSuccess] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("registrasi.store"), {
      onSuccess: () => {
        setSuccess(true);
        reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (err) => {
        console.log(err); // Debugging jika ada error validasi
      }
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-['Poppins']">
        <Head title="Pendaftaran Berhasil" />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full"
        >
          <Card className="border-emerald-100 shadow-xl">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Alhamdulillah!</h2>
              <p className="text-slate-600">
                Data pendaftaran Anda telah kami terima. Admin  PPTA Abdullah Al Busyroni akan menerima notifikasi dan segera menghubungi nomor WhatsApp yang tertera.
              </p>
              <Link href="/">
                <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">
                  Kembali ke Beranda
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Poppins'] py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-200 selection:text-emerald-900">
      <Head>
        <title>Formulir Pendaftaran Siswa Baru</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-emerald-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
        </Link>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600 text-white mb-4 shadow-lg shadow-emerald-200">
            <School className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Formulir Pendaftaran</h1>
          <p className="mt-2 text-slate-600">Penerimaan Peserta Didik Baru (PPDB) T.A 2024/2025</p>
        </div>
      </div>

      {/* Form Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="shadow-xl border-slate-200 bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg text-emerald-800">Data Calon Santri</CardTitle>
            <CardDescription>Mohon isi data dengan benar dan sesuai dokumen resmi (Ijazah/KK).</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={submit} className="space-y-6">
              
              {/* SECTION 1: DATA DIRI */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nama_lengkap">Nama Lengkap (Sesuai Ijazah SD/MI)</Label>
                  <Input 
                    id="nama_lengkap" 
                    value={data.nama_lengkap} 
                    onChange={(e) => setData("nama_lengkap", e.target.value)}
                    placeholder="Contoh: Muhammad Abdullah"
                    className={errors.nama_lengkap ? "border-red-500 focus:ring-red-200" : "focus:border-emerald-500 focus:ring-emerald-200"}
                  />
                  {errors.nama_lengkap && <p className="text-red-500 text-xs">{errors.nama_lengkap}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nisn">NISN (Nomor Induk Siswa Nasional)</Label>
                  <Input 
                    id="nisn" 
                    type="number"
                    value={data.nisn} 
                    onChange={(e) => setData("nisn", e.target.value)}
                    placeholder="10 digit angka"
                    className={errors.nisn ? "border-red-500 focus:ring-red-200" : "focus:border-emerald-500 focus:ring-emerald-200"}
                  />
                  {errors.nisn && <p className="text-red-500 text-xs">{errors.nisn}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Jenis Kelamin</Label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg hover:bg-slate-50 w-full transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                      <input 
                        type="radio" 
                        name="jenis_kelamin" 
                        value="L"
                        checked={data.jenis_kelamin === 'L'}
                        onChange={(e) => setData("jenis_kelamin", e.target.value)}
                        className="text-emerald-600 focus:ring-emerald-500 border-gray-300"
                      />
                      <span className="text-sm">Laki-laki</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg hover:bg-slate-50 w-full transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                      <input 
                        type="radio" 
                        name="jenis_kelamin" 
                        value="P"
                        checked={data.jenis_kelamin === 'P'}
                        onChange={(e) => setData("jenis_kelamin", e.target.value)}
                        className="text-emerald-600 focus:ring-emerald-500 border-gray-300"
                      />
                      <span className="text-sm">Perempuan</span>
                    </label>
                  </div>
                  {errors.jenis_kelamin && <p className="text-red-500 text-xs">{errors.jenis_kelamin}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                  <Input 
                    id="tempat_lahir" 
                    value={data.tempat_lahir} 
                    onChange={(e) => setData("tempat_lahir", e.target.value)}
                    className={errors.tempat_lahir ? "border-red-500" : "focus:border-emerald-500 focus:ring-emerald-200"}
                  />
                  {errors.tempat_lahir && <p className="text-red-500 text-xs">{errors.tempat_lahir}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                  <Input 
                    id="tanggal_lahir" 
                    type="date"
                    value={data.tanggal_lahir} 
                    onChange={(e) => setData("tanggal_lahir", e.target.value)}
                    className={errors.tanggal_lahir ? "border-red-500" : "focus:border-emerald-500 focus:ring-emerald-200"}
                  />
                   {errors.tanggal_lahir && <p className="text-red-500 text-xs">{errors.tanggal_lahir}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="alamat">Alamat Lengkap</Label>
                  <Textarea 
                    id="alamat" 
                    value={data.alamat} 
                    onChange={(e) => setData("alamat", e.target.value)}
                    placeholder="Nama Jalan, RT/RW, Desa, Kecamatan"
                    className={errors.alamat ? "border-red-500" : "focus:border-emerald-500 focus:ring-emerald-200"}
                  />
                  {errors.alamat && <p className="text-red-500 text-xs">{errors.alamat}</p>}
                </div>
              </div>

              <div className="border-t border-slate-100 my-6"></div>

              {/* SECTION 2: DATA ORTU & ASAL SEKOLAH */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="asal_sekolah">Asal Sekolah (SD/MI)</Label>
                  <Input 
                    id="asal_sekolah" 
                    value={data.asal_sekolah} 
                    onChange={(e) => setData("asal_sekolah", e.target.value)}
                    placeholder="Contoh: SD Negeri 1 Kota Santri"
                    className={errors.asal_sekolah ? "border-red-500" : "focus:border-emerald-500 focus:ring-emerald-200"}
                  />
                   {errors.asal_sekolah && <p className="text-red-500 text-xs">{errors.asal_sekolah}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nama_ayah">Nama Ayah Kandung</Label>
                  <Input 
                    id="nama_ayah" 
                    value={data.nama_ayah} 
                    onChange={(e) => setData("nama_ayah", e.target.value)}
                    className={errors.nama_ayah ? "border-red-500" : "focus:border-emerald-500 focus:ring-emerald-200"}
                  />
                   {errors.nama_ayah && <p className="text-red-500 text-xs">{errors.nama_ayah}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nama_ibu">Nama Ibu Kandung</Label>
                  <Input 
                    id="nama_ibu" 
                    value={data.nama_ibu} 
                    onChange={(e) => setData("nama_ibu", e.target.value)}
                    className={errors.nama_ibu ? "border-red-500" : "focus:border-emerald-500 focus:ring-emerald-200"}
                  />
                   {errors.nama_ibu && <p className="text-red-500 text-xs">{errors.nama_ibu}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="no_hp_ortu">No. HP / WhatsApp (Aktif)</Label>
                  <Input 
                    id="no_hp_ortu" 
                    type="number"
                    value={data.no_hp_ortu} 
                    onChange={(e) => setData("no_hp_ortu", e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className={errors.no_hp_ortu ? "border-red-500" : "focus:border-emerald-500 focus:ring-emerald-200"}
                  />
                  {errors.no_hp_ortu && <p className="text-red-500 text-xs">{errors.no_hp_ortu}</p>}
                  <p className="text-xs text-slate-500">Nomor ini akan digunakan untuk info kelulusan.</p>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={processing}
                  className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 rounded-xl"
                >
                  {processing ? "Mengirim Data..." : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" /> Kirim Pendaftaran
                    </span>
                  )}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </motion.div>

      <footer className="mt-12 text-center text-sm text-slate-400">
        © {new Date().getFullYear()}  PPTA Abdullah Al Busyroni. All rights reserved.
      </footer>
    </div>
  );
}