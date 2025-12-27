<?php

namespace App\Http\Controllers\Chatbot;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Subject;
use App\Models\Section;
use App\Models\Term;
use App\Models\Announcement;
use App\Models\Assignment;
use App\Models\AttendanceDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ChatbotController extends Controller
{
    // Definisi Menu
    private $menu = [
        1 => ['label' => 'Total Siswa', 'keywords' => ['berapa siswa', 'jumlah siswa', 'total siswa']],
        2 => ['label' => 'Total Guru', 'keywords' => ['berapa guru', 'jumlah guru', 'total guru']],
        3 => ['label' => 'Total Mata Pelajaran', 'keywords' => ['berapa matkul', 'jumlah matkul', 'mata pelajaran']],
        4 => ['label' => 'Total Kelas Aktif', 'keywords' => ['berapa kelas', 'jumlah kelas', 'total kelas']],
        5 => ['label' => 'Info Tahun Ajaran', 'keywords' => ['tahun ajaran', 'semester', 'term']],
        6 => ['label' => 'Pengumuman Terbaru', 'keywords' => ['pengumuman', 'info terbaru']],
        7 => ['label' => 'Tugas (Assignment) Terbaru', 'keywords' => ['tugas', 'assignment', 'pr']],
        8 => ['label' => 'Cek Kehadiran Siswa', 'keywords' => ['hadir', 'absen', 'kehadiran']],
    ];

    public function handle(Request $request)
    {
        $input = Str::lower(trim($request->input('question')));
        $reply = '';

        // 1. Cek apakah user meminta menu ulang
        if (in_array($input, ['menu', 'help', 'bantuan', 'hallo', 'halo', 'hi'])) {
            return response()->json(['reply' => $this->getMenuResponse()]);
        }

        // 2. Deteksi Maksud User (Angka atau Teks)
        $intent = null;

        // Cek jika input adalah angka 1-8
        if (is_numeric($input) && isset($this->menu[$input])) {
            $intent = $input;
        } 
        // Cek jika input teks mengandung keyword khusus (Logic khusus untuk Cek Kehadiran nama orang)
        elseif (Str::contains($input, ['cek kehadiran', 'apakah hadir', 'status kehadiran'])) {
            $intent = 8; 
        }
        // Cek keyword standar dari array menu
        else {
            foreach ($this->menu as $key => $item) {
                if (Str::contains($input, $item['keywords'])) {
                    $intent = $key;
                    break;
                }
            }
        }

        // 3. Eksekusi Logic Berdasarkan Intent
        try {
            switch ($intent) {
                case 1: // Siswa
                    $count = User::whereHas('roles', fn($q) => $q->where('name', 'siswa'))->count();
                    $reply = "👥 **Data Siswa**\nSaat ini terdaftar **$count siswa** aktif di SIMS.";
                    break;

                case 2: // Guru
                    $count = User::whereHas('roles', fn($q) => $q->where('name', 'guru'))->count();
                    $reply = "👨‍🏫 **Data Guru**\nTerdapat **$count guru** yang aktif mengajar saat ini.";
                    break;

                case 3: // Mapel
                    $count = Subject::count();
                    $reply = "📚 **Kurikulum**\nTotal ada **$count mata pelajaran** yang tersedia.";
                    break;

                case 4: // Kelas
                    $count = Section::count();
                    $reply = "🏫 **Kelas**\nTotal kelas (section) yang aktif saat ini berjumlah **$count kelas**.";
                    break;

                case 5: // Tahun Ajaran
                    $term = Term::where('aktif', 1)->first();
                    if ($term) {
                        $sem = ucfirst($term->semester);
                        $reply = "📅 **Term Akademik**\nSekarang adalah Tahun Ajaran **{$term->tahun}**, Semester **{$sem}**.";
                    } else {
                        $reply = "Belum ada Term Akademik yang diaktifkan.";
                    }
                    break;

                case 6: // Pengumuman
                    $latest = Announcement::latest()->first();
                    if ($latest) {
                        $date = Carbon::parse($latest->created_at)->translatedFormat('d F Y');
                        $preview = Str::limit($latest->content, 150);
                        $reply = "📢 **Pengumuman Terbaru**\n\n**{$latest->title}** ({$date})\n{$preview}";
                    } else {
                        $reply = "Belum ada pengumuman yang diterbitkan.";
                    }
                    break;

                case 7: // Tugas Terbaru
                    // Ambil tugas yang deadlinenya belum lewat (>= now)
                    $assignment = Assignment::with('section.subject')
                        ->where('deadline', '>=', now())
                        ->orderBy('deadline', 'asc') // Yang paling mendekati deadline
                        ->first();

                    if ($assignment) {
                        $deadline = Carbon::parse($assignment->deadline)->translatedFormat('d F Y H:i');
                        $mapel = $assignment->section->subject->nama ?? 'Unknown';
                        $reply = "📝 **Tugas Terdekat**\n\n**Mapel:** {$mapel}\n**Judul:** {$assignment->judul}\n**Deadline:** {$deadline}\n\n_Segera kerjakan sebelum tenggat waktu!_";
                    } else {
                        $reply = "👍 **Aman!**\nTidak ada tugas aktif dengan deadline mendatang saat ini.";
                    }
                    break;

                case 8: // Cek Kehadiran Spesifik
                    // Cara pakai: "Cek kehadiran Budi" atau input angka "8" lalu ditanya nama
                    
                    // Bersihkan kata kunci trigger untuk mendapatkan nama
                    $cleanName = str_replace(['cek kehadiran', 'apakah', 'hadir', 'hari ini', '?'], '', $input);
                    $cleanName = trim($cleanName);

                    // Jika user hanya mengetik angka "8" atau "cek kehadiran" tanpa nama
                    if (empty($cleanName) || is_numeric($cleanName)) {
                        $reply = "🔍 **Cek Kehadiran**\nSilakan ketik nama siswa yang ingin dicek.\nContoh: _\"Cek kehadiran Budi\"_ atau _\"Apakah Siti hadir hari ini?\"_";
                    } else {
                        // Cari User
                        $user = User::where('name', 'like', "%{$cleanName}%")
                            ->whereHas('roles', fn($q) => $q->where('name', 'siswa'))
                            ->first();

                        if (!$user) {
                            $reply = "❌ Siswa dengan nama **\"{$cleanName}\"** tidak ditemukan.";
                        } else {
                            // Cari Absensi HARI INI
                            $today = Carbon::today()->format('Y-m-d');
                            
                            $status = AttendanceDetail::where('user_id', $user->id)
                                ->whereHas('attendance', function($q) use ($today) {
                                    $q->where('tanggal', $today);
                                })
                                ->first();

                            if ($status) {
                                $icon = match($status->status) {
                                    'hadir' => '✅',
                                    'sakit' => 'uahs', // Typo di enum db? biasanya 'sakit'
                                    'izin' => '📩',
                                    'alpha' => '❌',
                                    default => '❓'
                                };
                                $statusText = ucfirst($status->status);
                                $reply = "📅 **Status Kehadiran Hari Ini**\n\nSiswa: **{$user->name}**\nStatus: **{$statusText}** {$icon}";
                            } else {
                                $reply = "ℹ️ Belum ada data absensi masuk untuk **{$user->name}** hari ini ({$today}).";
                            }
                        }
                    }
                    break;

                default:
                    $reply = $this->getMenuResponse("Maaf, saya tidak mengerti. Silakan pilih menu di bawah ini:");
                    break;
            }

        } catch (\Exception $e) {
            // \Log::error("Chatbot Error: " . $e->getMessage());
            $reply = "⚠️ Terjadi kesalahan teknis saat mengambil data.";
        }

        return response()->json(['reply' => $reply]);
    }

    private function getMenuResponse($intro = "Halo! Berikut data yang bisa saya bantu cek:")
    {
        $text = "🤖 **$intro**\n\n";
        foreach ($this->menu as $key => $item) {
            $text .= "**{$key}.** {$item['label']}\n";
        }
        $text .= "\n_Ketik angkanya saja (misal: **1**) atau ketik pertanyaan Anda._";
        return $text;
    }
}