<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Term;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class JadwalController extends Controller
{
    public function index(Request $request)
    {
        $activeTerm = Term::where('aktif', true)->first();

        $query = Section::with(['subject', 'guru', 'term'])
            ->when($request->term_id, function ($q, $termId) {
                return $q->where('term_id', $termId);
            }, function ($q) use ($activeTerm) {
                if ($activeTerm) {
                    return $q->where('term_id', $activeTerm->id);
                }
            })
            ->when($request->search, function ($q, $search) {
                $q->where(function ($qq) use ($search) {
                    $qq->whereHas('subject', function ($sq) use ($search) {
                        $sq->where('nama', 'like', "%{$search}%")
                            ->orWhere('kode', 'like', "%{$search}%");
                    })->orWhereHas('guru', function ($gq) use ($search) {
                        $gq->where('name', 'like', "%{$search}%");
                    });
                });
            });

        $sections = $query->orderBy('id', 'desc')
            ->paginate(15)
            ->withQueryString();

        $terms    = Term::orderBy('tahun', 'desc')->get();
        $subjects = Subject::orderBy('nama')->get();
        $gurus    = User::role('guru')->orderBy('name')->get();

        return Inertia::render('Admin/Jadwal', [
            'sections'   => $sections,
            'terms'      => $terms,
            'subjects'   => $subjects,
            'gurus'      => $gurus,
            'activeTerm' => $activeTerm,
            'filters'    => $request->only(['search', 'term_id']),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject_id'           => 'required|exists:subjects,id',
            'guru_id'              => 'required|exists:users,id',
            'term_id'              => 'required|exists:terms,id',
            'kapasitas'            => 'nullable|integer|min:1|max:100',
            'jadwal'               => 'required|array|min:1',
            'jadwal.*.hari'        => 'required|in:senin,selasa,rabu,kamis,jumat,sabtu',
            'jadwal.*.jam_mulai'   => 'required|date_format:H:i',
            'jadwal.*.jam_selesai' => 'required|date_format:H:i|after:jadwal.*.jam_mulai',
            'jadwal.*.ruangan'     => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // PERBAIKAN: Kirim subject_id untuk cek bentrok mapel
        $conflicts = $this->checkScheduleConflicts(
            $request->guru_id,
            $request->subject_id,
            $request->term_id,
            $request->jadwal
        );

        if (! empty($conflicts)) {
            return back()->withErrors([
                'jadwal' => 'Terdapat bentrok jadwal: ' . implode(', ', $conflicts),
            ])->withInput();
        }

        try {
            Section::create([
                'subject_id'  => $request->subject_id,
                'guru_id'     => $request->guru_id,
                'term_id'     => $request->term_id,
                'kapasitas'   => $request->kapasitas,
                'jadwal_json' => $request->jadwal,
            ]);

            return back()->with('status', 'Jadwal berhasil ditambahkan.');
        } catch (\Exception $e) {
            Log::error('Error storing Jadwal: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Terjadi kesalahan sistem saat menyimpan data.']);
        }
    }

    public function update(Request $request, Section $section)
    {
        $validator = Validator::make($request->all(), [
            'subject_id'           => 'required|exists:subjects,id',
            'guru_id'              => 'required|exists:users,id',
            'term_id'              => 'required|exists:terms,id',
            'kapasitas'            => 'nullable|integer|min:1|max:100',
            'jadwal'               => 'required|array|min:1',
            'jadwal.*.hari'        => 'required|in:senin,selasa,rabu,kamis,jumat,sabtu',
            'jadwal.*.jam_mulai'   => 'required|date_format:H:i',
            'jadwal.*.jam_selesai' => 'required|date_format:H:i|after:jadwal.*.jam_mulai',
            'jadwal.*.ruangan'     => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // PERBAIKAN: Kirim subject_id untuk cek bentrok mapel
        $conflicts = $this->checkScheduleConflicts(
            $request->guru_id,
            $request->subject_id,
            $request->term_id,
            $request->jadwal,
            $section->id
        );

        if (! empty($conflicts)) {
            return back()->withErrors([
                'jadwal' => 'Terdapat bentrok jadwal: ' . implode(', ', $conflicts),
            ])->withInput();
        }

        try {
            $section->update([
                'subject_id'  => $request->subject_id,
                'guru_id'     => $request->guru_id,
                'term_id'     => $request->term_id,
                'kapasitas'   => $request->kapasitas,
                'jadwal_json' => $request->jadwal,
            ]);

            return back()->with('status', 'Jadwal berhasil diperbarui.');
        } catch (\Exception $e) {
            Log::error('Error updating Jadwal: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal memperbarui jadwal.']);
        }
    }

    public function destroy(Section $section)
    {
        try {
            if (method_exists($section, 'students') && $section->students()->exists()) {
                return back()->withErrors(['error' => 'Tidak dapat menghapus: Masih ada siswa di kelas ini.']);
            }

            if (method_exists($section, 'materials') && $section->materials()->exists()) {
                return back()->withErrors(['error' => 'Tidak dapat menghapus: Masih ada materi di kelas ini.']);
            }

            if (method_exists($section, 'assignments') && $section->assignments()->exists()) {
                return back()->withErrors(['error' => 'Tidak dapat menghapus: Masih ada tugas di kelas ini.']);
            }

            $section->delete();
            return back()->with('status', 'Jadwal berhasil dihapus.');
        } catch (\Exception $e) {
            Log::error('Error deleting Jadwal ID ' . $section->id . ': ' . $e->getMessage());
            return back()->withErrors(['error' => 'Terjadi kesalahan server saat menghapus data.']);
        }
    }

    /**
     * Logika Cek Bentrok yang diperbaiki
     * Mengecek Guru Sibuk ATAU Mapel sudah ada jadwalnya
     */
    private function checkScheduleConflicts($guruId, $subjectId, $termId, $jadwalBaru, $excludeSectionId = null)
{
    $conflicts = [];

    // Ambil hanya kolom yang diperlukan (lebih ringan)
    $existingSections = Section::where('term_id', $termId)
        ->where(function($query) use ($guruId, $subjectId) {
            $query->where('guru_id', $guruId)
                  ->orWhere('subject_id', $subjectId);
        })
        ->when($excludeSectionId, function($q) use ($excludeSectionId) {
            $q->where('id', '!=', $excludeSectionId);
        })
        ->select(['id', 'guru_id', 'subject_id', 'jadwal_json'])
        ->with([
            'subject:id,nama',
            'guru:id,name'
        ])
        ->get();

    // Flatten existing schedules dulu supaya tidak triple nested berat
    $flattenedSchedules = [];

    foreach ($existingSections as $section) {
        $schedules = is_string($section->jadwal_json)
            ? json_decode($section->jadwal_json, true)
            : ($section->jadwal_json ?? []);

        if (!is_array($schedules)) continue;

        foreach ($schedules as $schedule) {
            $flattenedSchedules[] = [
                'section' => $section,
                'hari' => strtolower($schedule['hari']),
                'start' => strtotime($schedule['jam_mulai']),
                'end' => strtotime($schedule['jam_selesai']),
                'jam_mulai' => $schedule['jam_mulai'],
                'jam_selesai' => $schedule['jam_selesai'],
            ];
        }
    }

    // Sekarang cek jadwal baru terhadap flattened list
    foreach ($jadwalBaru as $new) {
        $newDay = strtolower($new['hari']);
        $newStart = strtotime($new['jam_mulai']);
        $newEnd = strtotime($new['jam_selesai']);

        foreach ($flattenedSchedules as $existing) {

            if ($existing['hari'] !== $newDay) continue;

            if ($newStart < $existing['end'] && $newEnd > $existing['start']) {

                $section = $existing['section'];
                $timeStr = ucfirst($newDay) . " ({$existing['jam_mulai']}-{$existing['jam_selesai']})";

                if ($section->subject_id == $subjectId) {
                    $conflicts[] = "Mata pelajaran '{$section->subject->nama}' sudah dijadwalkan pada {$timeStr}.";
                } elseif ($section->guru_id == $guruId) {
                    $conflicts[] = "Guru '{$section->guru->name}' sedang mengajar '{$section->subject->nama}' pada {$timeStr}.";
                }
            }
        }
    }

    return array_unique($conflicts);
}

}
