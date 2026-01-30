<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewStudentRegistration;
use Illuminate\Support\Facades\Log;

class RegistrationController extends Controller
{
    // Menampilkan Form
    public function index()
    {
        return Inertia::render('RegistrasiMaba');
    }

    // Memproses Data & Kirim Email
    public function store(Request $request)
    {
        // 1. Validasi Input (Perbaikan: NIK diganti NISN, digits disesuaikan 10)
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nisn' => 'required|numeric|digits:10', 
            'tempat_lahir' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'required|string',
            'asal_sekolah' => 'required|string|max:255',
            'nama_ayah' => 'required|string|max:255',
            'nama_ibu' => 'required|string|max:255',
            'no_hp_ortu' => 'required|numeric',
        ]);

        // 2. Kirim Email ke Admin Sekolah
        try {
            Mail::to('sharingbang00@gmail.com')
                ->send(new NewStudentRegistration($validated));
        } catch (\Exception $e) {
            // Log error jika email gagal terkirim (misal koneksi internet mati atau password salah)
            Log::error("Gagal mengirim email pendaftaran: " . $e->getMessage());
            
            // Opsional: Anda bisa me-return error ke user jika email wajib terkirim
            // return back()->withErrors(['email' => 'Gagal mengirim notifikasi email.']);
        }

        // 3. Kembali ke halaman dengan pesan sukses
        return redirect()->route('registrasi.index')->with('message', 'Pendaftaran berhasil! Admin kami akan segera menghubungi Anda.');
    }
}