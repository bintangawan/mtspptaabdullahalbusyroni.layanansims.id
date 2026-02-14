<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Term;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Facades\Excel;

class MasterDataController extends Controller
{
    /**
     * Display master data management page.
     */
    public function index()
    {
        try {
            $terms = Term::orderBy('tahun', 'desc')->orderBy('semester')->get();

            // All subjects (non-paginated) for Section dropdown
            $allSubjects = Subject::orderBy('nama')->get(['id', 'kode', 'nama', 'deskripsi']);

            // Paginated subjects for Subject table
            $subjectsPaginator = Subject::orderBy('nama')
                ->paginate(10, ['*'], 'subjects_page')
                ->appends(request()->only(['subjects_page', 'sections_page']));

            $subjects = [
                'data'  => $subjectsPaginator->items(),
                'meta'  => [
                    'current_page' => $subjectsPaginator->currentPage(),
                    'from'         => $subjectsPaginator->firstItem(),
                    'to'           => $subjectsPaginator->lastItem(),
                    'last_page'    => $subjectsPaginator->lastPage(),
                    'total'        => $subjectsPaginator->total(),
                ],
                'links' => $subjectsPaginator->linkCollection(),
            ];

            // Paginated sections for Section table
            $sectionsPaginator = Section::with(['subject', 'guru', 'term'])
                ->orderBy('id', 'desc')
                ->paginate(10, ['*'], 'sections_page')
                ->appends(request()->only(['subjects_page', 'sections_page']));

            $sections = [
                'data'  => $sectionsPaginator->items(),
                'meta'  => [
                    'current_page' => $sectionsPaginator->currentPage(),
                    'from'         => $sectionsPaginator->firstItem(),
                    'to'           => $sectionsPaginator->lastItem(),
                    'last_page'    => $sectionsPaginator->lastPage(),
                    'total'        => $sectionsPaginator->total(),
                ],
                'links' => $sectionsPaginator->linkCollection(),
            ];

            // Guru list for Section dropdown
            $gurus = User::whereHas('roles', fn ($q) => $q->where('name', 'guru'))
                ->with('guruProfile')
                ->get()
                ->map(fn ($user) => [
                    'id'             => $user->id,
                    'name'           => $user->name,
                    'nidn'           => $user->guruProfile?->nidn,
                    'mapel_keahlian' => $user->guruProfile?->mapel_keahlian,
                ]);

            return Inertia::render('Admin/MasterData', [
                'terms'       => $terms,
                'subjects'    => $subjects,
                'allSubjects' => $allSubjects,
                'sections'    => $sections,
                'gurus'       => $gurus,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading MasterData index: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            // Fallback: return empty data sehingga halaman tetap tampil
            $emptyPaginated = [
                'data'  => [],
                'meta'  => ['current_page' => 1, 'from' => null, 'to' => null, 'last_page' => 1, 'total' => 0],
                'links' => collect([]),
            ];

            return Inertia::render('Admin/MasterData', [
                'terms'       => [],
                'subjects'    => $emptyPaginated,
                'allSubjects' => [],
                'sections'    => $emptyPaginated,
                'gurus'       => [],
            ]);
        }
    }

    // ─── Term CRUD ───────────────────────────────────────────────

    public function storeTerm(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tahun'    => 'required|string|regex:/^\d{4}\/\d{4}$/',
            'semester' => 'required|in:ganjil,genap',
            'aktif'    => 'boolean',
        ], [
            'tahun.regex' => 'Format tahun harus YYYY/YYYY (contoh: 2024/2025).',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $exists = Term::where('tahun', $request->tahun)
            ->where('semester', $request->semester)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'semester' => 'Kombinasi tahun ajaran dan semester sudah ada.',
            ])->withInput();
        }

        try {
            DB::transaction(function () use ($request) {
                if ($request->aktif) {
                    Term::where('aktif', true)->update(['aktif' => false]);
                }
                Term::create([
                    'tahun'    => $request->tahun,
                    'semester' => $request->semester,
                    'aktif'    => $request->aktif ?? false,
                ]);
            });

            return back()->with('status', 'Tahun ajaran berhasil ditambahkan.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menambahkan tahun ajaran.']);
        }
    }

    public function updateTerm(Request $request, Term $term)
    {
        $validator = Validator::make($request->all(), [
            'tahun'    => 'required|string|regex:/^\d{4}\/\d{4}$/',
            'semester' => 'required|in:ganjil,genap',
            'aktif'    => 'boolean',
        ], [
            'tahun.regex' => 'Format tahun harus YYYY/YYYY (contoh: 2024/2025).',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $exists = Term::where('tahun', $request->tahun)
            ->where('semester', $request->semester)
            ->where('id', '!=', $term->id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'semester' => 'Kombinasi tahun ajaran dan semester sudah ada.',
            ])->withInput();
        }

        try {
            DB::transaction(function () use ($request, $term) {
                if ($request->aktif) {
                    Term::where('id', '!=', $term->id)
                        ->where('aktif', true)
                        ->update(['aktif' => false]);
                }
                $term->update([
                    'tahun'    => $request->tahun,
                    'semester' => $request->semester,
                    'aktif'    => $request->aktif ?? false,
                ]);
            });

            return back()->with('status', 'Tahun ajaran berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal memperbarui tahun ajaran.']);
        }
    }

    public function destroyTerm(Term $term)
    {
        if ($term->sections()->exists()) {
            return back()->withErrors([
                'error' => 'Tidak dapat menghapus tahun ajaran yang sudah memiliki kelas.',
            ]);
        }

        try {
            $term->delete();
            return back()->with('status', 'Tahun ajaran berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menghapus tahun ajaran.']);
        }
    }

    public function activateTerm(Term $term)
    {
        try {
            DB::transaction(function () use ($term) {
                Term::where('aktif', true)->update(['aktif' => false]);
                $term->update(['aktif' => true]);
            });

            return back()->with('status', 'Tahun ajaran berhasil diaktifkan.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal mengaktifkan tahun ajaran.']);
        }
    }

    // ─── Subject CRUD ────────────────────────────────────────────

    public function storeSubject(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'kode'      => 'required|string|max:30|unique:subjects,kode',
            'nama'      => 'required|string|max:150',
            'deskripsi' => 'nullable|string',
        ], [
            'kode.unique'   => 'Kode mata pelajaran sudah digunakan.',
            'kode.max'      => 'Kode maksimal 30 karakter.',
            'nama.max'      => 'Nama maksimal 150 karakter.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            Subject::create([
                'kode'      => strtoupper(trim($request->kode)),
                'nama'      => trim($request->nama),
                'deskripsi' => $request->deskripsi ? trim($request->deskripsi) : null,
            ]);

            return back()->with('status', 'Mata pelajaran berhasil ditambahkan.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menambahkan mata pelajaran.']);
        }
    }

    public function updateSubject(Request $request, Subject $subject)
    {
        $validator = Validator::make($request->all(), [
            'kode'      => 'required|string|max:30|unique:subjects,kode,' . $subject->id,
            'nama'      => 'required|string|max:150',
            'deskripsi' => 'nullable|string',
        ], [
            'kode.unique' => 'Kode mata pelajaran sudah digunakan.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $subject->update([
                'kode'      => strtoupper(trim($request->kode)),
                'nama'      => trim($request->nama),
                'deskripsi' => $request->deskripsi ? trim($request->deskripsi) : null,
            ]);

            return back()->with('status', 'Mata pelajaran berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal memperbarui mata pelajaran.']);
        }
    }

    public function destroySubject(Subject $subject)
    {
        if ($subject->sections()->exists()) {
            return back()->withErrors([
                'error' => 'Tidak dapat menghapus mata pelajaran yang sudah memiliki kelas.',
            ]);
        }

        try {
            $subject->delete();
            return back()->with('status', 'Mata pelajaran berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menghapus mata pelajaran.']);
        }
    }

    // ─── Section CRUD ────────────────────────────────────────────

    public function storeSection(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject_id' => 'required|exists:subjects,id',
            'guru_id'    => 'required|exists:users,id',
            'term_id'    => 'required|exists:terms,id',
            'kapasitas'  => 'nullable|integer|min:1|max:500',
            'jadwal'     => 'nullable|array',
        ], [
            'subject_id.required' => 'Mata pelajaran wajib dipilih.',
            'subject_id.exists'   => 'Mata pelajaran tidak valid.',
            'guru_id.required'    => 'Guru pengampu wajib dipilih.',
            'guru_id.exists'      => 'Guru tidak valid.',
            'term_id.required'    => 'Term wajib dipilih.',
            'term_id.exists'      => 'Term tidak valid.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            Section::create([
                'subject_id'  => $request->subject_id,
                'guru_id'     => $request->guru_id,
                'term_id'     => $request->term_id,
                'kapasitas'   => $request->kapasitas,
                'jadwal_json' => $request->jadwal ?? [],
            ]);

            return back()->with('status', 'Kelas berhasil ditambahkan.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menambahkan kelas.']);
        }
    }

    public function updateSection(Request $request, Section $section)
    {
        $validator = Validator::make($request->all(), [
            'subject_id' => 'required|exists:subjects,id',
            'guru_id'    => 'required|exists:users,id',
            'term_id'    => 'required|exists:terms,id',
            'kapasitas'  => 'nullable|integer|min:1|max:500',
            'jadwal'     => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $section->update([
                'subject_id'  => $request->subject_id,
                'guru_id'     => $request->guru_id,
                'term_id'     => $request->term_id,
                'kapasitas'   => $request->kapasitas,
                'jadwal_json' => $request->jadwal ?? [],
            ]);

            return back()->with('status', 'Kelas berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal memperbarui kelas.']);
        }
    }

    public function destroySection(Section $section)
    {
        if ($section->students()->exists()) {
            return back()->withErrors([
                'error' => 'Tidak dapat menghapus kelas yang sudah memiliki siswa.',
            ]);
        }

        if ($section->materials()->exists() || $section->assignments()->exists()) {
            return back()->withErrors([
                'error' => 'Tidak dapat menghapus kelas yang sudah memiliki materi atau tugas.',
            ]);
        }

        try {
            $section->delete();
            return back()->with('status', 'Kelas berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menghapus kelas.']);
        }
    }

    // ─── Import / Export ─────────────────────────────────────────

    /**
     * Import subjects from Excel/CSV.
     * Duplicates (by kode) are skipped — not rejected.
     */
    public function importSubjects(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048',
        ], [
            'file.required' => 'File wajib diunggah.',
            'file.mimes'    => 'Format file harus .xlsx, .xls, atau .csv.',
            'file.max'      => 'Ukuran file maksimal 2 MB.',
        ]);

        try {
            $import = new SubjectImport();
            Excel::import($import, $request->file('file'));

            $parts = [];
            if ($import->inserted > 0) {
                $parts[] = "{$import->inserted} data baru ditambahkan";
            }
            if ($import->skipped > 0) {
                $parts[] = "{$import->skipped} duplikat dilewati";
            }
            if ($import->failed > 0) {
                $parts[] = "{$import->failed} baris gagal";
            }

            $message = count($parts) > 0
                ? 'Import selesai: ' . implode(', ', $parts) . '.'
                : 'Tidak ada data yang diproses dalam file.';

            return back()->with([
                'status'        => $message,
                'import_result' => [
                    'inserted' => $import->inserted,
                    'skipped'  => $import->skipped,
                    'failed'   => $import->failed,
                    'errors'   => array_slice($import->errors, 0, 20),
                ],
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal memproses file: ' . $e->getMessage()]);
        }
    }

    public function exportSubjectsTemplate()
    {
        return Excel::download(
            new SimpleExcelExport(
                ['kode', 'nama', 'deskripsi'],
                [
                    ['MTK001', 'Matematika', 'Mata pelajaran matematika dasar'],
                    ['IPA001', 'IPA', 'Ilmu Pengetahuan Alam'],
                ]
            ),
            'template_mata_pelajaran.xlsx'
        );
    }

    /**
     * Import sections from Excel/CSV.
     * Duplicates (same subject + guru + term) are skipped — not rejected.
     */
    public function importSections(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048',
        ], [
            'file.required' => 'File wajib diunggah.',
            'file.mimes'    => 'Format file harus .xlsx, .xls, atau .csv.',
            'file.max'      => 'Ukuran file maksimal 2 MB.',
        ]);

        try {
            $import = new SectionImport();
            Excel::import($import, $request->file('file'));

            $parts = [];
            if ($import->inserted > 0) {
                $parts[] = "{$import->inserted} data baru ditambahkan";
            }
            if ($import->skipped > 0) {
                $parts[] = "{$import->skipped} duplikat dilewati";
            }
            if ($import->failed > 0) {
                $parts[] = "{$import->failed} baris gagal";
            }

            $message = count($parts) > 0
                ? 'Import selesai: ' . implode(', ', $parts) . '.'
                : 'Tidak ada data yang diproses dalam file.';

            return back()->with([
                'status'        => $message,
                'import_result' => [
                    'inserted' => $import->inserted,
                    'skipped'  => $import->skipped,
                    'failed'   => $import->failed,
                    'errors'   => array_slice($import->errors, 0, 20),
                ],
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal memproses file: ' . $e->getMessage()]);
        }
    }

    public function exportSectionsTemplate()
    {
        return Excel::download(
            new SimpleExcelExport(
                ['subject_kode', 'guru_email', 'term_tahun', 'term_semester', 'kapasitas'],
                [
                    ['MTK001', 'guru@sekolah.com', '2024/2025', 'ganjil', 30],
                    ['IPA001', 'guru2@sekolah.com', '2024/2025', 'ganjil', 25],
                ]
            ),
            'template_kelas.xlsx'
        );
    }
}

// ────────────────────────────────────────────────────────────────
// Template Export Helper
// ────────────────────────────────────────────────────────────────

class SimpleExcelExport implements FromArray, WithHeadings
{
    public function __construct(
        private array $headers,
        private array $data,
    ) {}

    public function array(): array
    {
        return $this->data;
    }

    public function headings(): array
    {
        return $this->headers;
    }
}

// ────────────────────────────────────────────────────────────────
// Import: Mata Pelajaran (skip duplicates, track stats)
// ────────────────────────────────────────────────────────────────

class SubjectImport implements ToCollection, WithHeadingRow
{
    public int $inserted = 0;
    public int $skipped  = 0;
    public int $failed   = 0;
    public array $errors  = [];

    public function collection(Collection $rows): void
    {
        foreach ($rows as $index => $row) {
            $rowNum = $index + 2; // heading = row 1, data starts row 2

            // Skip completely empty rows
            if (empty($row['kode']) && empty($row['nama'])) {
                continue;
            }

            $data = [
                'kode'      => $row['kode'] ?? null,
                'nama'      => $row['nama'] ?? null,
                'deskripsi' => $row['deskripsi'] ?? null,
            ];

            // Validate row
            $validator = Validator::make($data, [
                'kode' => 'required|string|max:30',
                'nama' => 'required|string|max:150',
                'deskripsi' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                $this->failed++;
                $this->errors[] = "Baris {$rowNum}: " . implode(', ', $validator->errors()->all());
                continue;
            }

            $kode = strtoupper(trim($data['kode']));

            // Skip duplicate
            if (Subject::where('kode', $kode)->exists()) {
                $this->skipped++;
                continue;
            }

            try {
                Subject::create([
                    'kode'      => $kode,
                    'nama'      => trim($data['nama']),
                    'deskripsi' => ! empty($data['deskripsi']) ? trim($data['deskripsi']) : null,
                ]);
                $this->inserted++;
            } catch (\Exception $e) {
                $this->failed++;
                $this->errors[] = "Baris {$rowNum}: Gagal menyimpan data.";
            }
        }
    }
}

// ────────────────────────────────────────────────────────────────
// Import: Kelas / Section (skip duplicates, track stats)
// ────────────────────────────────────────────────────────────────

class SectionImport implements ToCollection, WithHeadingRow
{
    public int $inserted = 0;
    public int $skipped  = 0;
    public int $failed   = 0;
    public array $errors  = [];

    public function collection(Collection $rows): void
    {
        foreach ($rows as $index => $row) {
            $rowNum = $index + 2;

            // Skip completely empty rows
            if (empty($row['subject_kode']) && empty($row['guru_email'])) {
                continue;
            }

            $data = [
                'subject_kode'  => $row['subject_kode'] ?? null,
                'guru_email'    => $row['guru_email'] ?? null,
                'term_tahun'    => $row['term_tahun'] ?? null,
                'term_semester' => $row['term_semester'] ?? null,
                'kapasitas'     => $row['kapasitas'] ?? null,
            ];

            // Validate format
            $validator = Validator::make($data, [
                'subject_kode'  => 'required|string',
                'guru_email'    => 'required|email',
                'term_tahun'    => 'required|string',
                'term_semester' => 'required|in:ganjil,genap',
                'kapasitas'     => 'nullable|integer|min:1|max:500',
            ]);

            if ($validator->fails()) {
                $this->failed++;
                $this->errors[] = "Baris {$rowNum}: " . implode(', ', $validator->errors()->all());
                continue;
            }

            // Resolve references
            $subject = Subject::where('kode', strtoupper(trim($data['subject_kode'])))->first();
            if (! $subject) {
                $this->failed++;
                $this->errors[] = "Baris {$rowNum}: Kode mapel '{$data['subject_kode']}' tidak ditemukan.";
                continue;
            }

            $guru = User::where('email', trim($data['guru_email']))->first();
            if (! $guru) {
                $this->failed++;
                $this->errors[] = "Baris {$rowNum}: Email guru '{$data['guru_email']}' tidak ditemukan.";
                continue;
            }

            $term = Term::where('tahun', trim($data['term_tahun']))
                ->where('semester', trim($data['term_semester']))
                ->first();
            if (! $term) {
                $this->failed++;
                $this->errors[] = "Baris {$rowNum}: Term '{$data['term_tahun']} {$data['term_semester']}' tidak ditemukan.";
                continue;
            }

            // Skip duplicate combination (subject + guru + term)
            $exists = Section::where('subject_id', $subject->id)
                ->where('guru_id', $guru->id)
                ->where('term_id', $term->id)
                ->exists();

            if ($exists) {
                $this->skipped++;
                continue;
            }

            try {
                Section::create([
                    'subject_id'  => $subject->id,
                    'guru_id'     => $guru->id,
                    'term_id'     => $term->id,
                    'kapasitas'   => $data['kapasitas'] ?? 30,
                    'jadwal_json' => [],
                ]);
                $this->inserted++;
            } catch (\Exception $e) {
                $this->failed++;
                $this->errors[] = "Baris {$rowNum}: Gagal menyimpan data.";
            }
        }
    }
}
