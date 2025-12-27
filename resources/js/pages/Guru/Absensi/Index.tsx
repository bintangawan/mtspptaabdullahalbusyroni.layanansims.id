import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowLeft, CalendarDays, Eye, Plus, Users } from 'lucide-react';

interface Subject {
    id: number;
    nama: string;
    kode: string;
}

interface Section {
    id: number;
    subject: Subject;
    kapasitas?: number;
    capacity?: number;
}

interface Attendance {
    id: number;
    pertemuan_ke: number;
    tanggal: string;
    students_count: number;
    created_at: string;
}

interface Props {
    section: Section;
    attendances: Attendance[];
}

export default function Index({ section, attendances }: Props) {
    const handleCreateAttendance = () => {
        router.visit(route('guru.absensi.create', section.id));
    };

    const handleViewAttendance = (attendanceId: number) => {
        router.visit(route('guru.absensi.show', attendanceId));
    };

    // Fungsi untuk kembali ke dashboard/list kelas
    const handleBack = () => {
        // Sesuaikan route ini dengan route dashboard guru atau list kelas kamu
        router.visit(route('guru.kelas.index'));
    };

    const kapasitas = section.kapasitas ?? section.capacity ?? 0;

    return (
        <AppLayout>
            <Head title={`Absensi - ${section.subject.nama}`} />

            <div className="space-y-6 p-4 sm:p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-2">
                        {/* Tombol Kembali */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="-ml-3 w-fit gap-2 text-muted-foreground hover:text-foreground"
                            onClick={handleBack}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Dashboard
                        </Button>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Absensi {section.subject.nama}</h1>
                            <p className="text-sm text-muted-foreground sm:text-base">
                                Kelola absensi siswa untuk mata pelajaran {section.subject.nama}
                            </p>
                        </div>
                    </div>

                    <Button onClick={handleCreateAttendance} className="w-full gap-2 sm:w-auto">
                        <Plus className="h-4 w-4" />
                        Buat Absensi Baru
                    </Button>
                </div>

                {/* Section Info Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <Users className="h-5 w-5" />
                            Informasi Kelas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="rounded-lg border p-3 sm:border-0 sm:p-0">
                                <p className="text-xs font-medium text-muted-foreground uppercase">Mata Pelajaran</p>
                                <p className="mt-1 text-lg font-semibold">{section.subject.nama}</p>
                            </div>
                            <div className="rounded-lg border p-3 sm:border-0 sm:p-0">
                                <p className="text-xs font-medium text-muted-foreground uppercase">Kode</p>
                                <p className="mt-1 text-lg font-semibold">{section.subject.kode}</p>
                            </div>
                            <div className="rounded-lg border p-3 sm:border-0 sm:p-0">
                                <p className="text-xs font-medium text-muted-foreground uppercase">Kapasitas</p>
                                <p className="mt-1 text-lg font-semibold">{kapasitas} Siswa</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Attendance List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg">Riwayat Absensi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {attendances.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="rounded-full bg-muted p-4">
                                    <CalendarDays className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold">Belum Ada Absensi</h3>
                                <p className="mb-6 text-sm text-muted-foreground">Mulai buat absensi pertemuan pertama untuk kelas ini.</p>
                                <Button onClick={handleCreateAttendance} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Buat Absensi Baru
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {attendances.map((attendance) => (
                                    <div
                                        key={attendance.id}
                                        className="flex flex-col gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        {/* Left Side: Icon & Info */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                <span className="text-lg font-bold text-primary">{attendance.pertemuan_ke}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="leading-none font-semibold">Pertemuan ke-{attendance.pertemuan_ke}</h4>
                                                <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <CalendarDays className="h-3.5 w-3.5" />
                                                        {format(new Date(attendance.tanggal), 'dd MMMM yyyy', { locale: id })}
                                                    </span>
                                                    <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/30 sm:block" />
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3.5 w-3.5" />
                                                        {attendance.students_count} siswa hadir
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Badge & Action */}
                                        <div className="flex items-center justify-between gap-3 border-t pt-3 sm:justify-end sm:border-t-0 sm:pt-0">
                                            <div className="flex flex-col items-start gap-1 sm:items-end">
                                                <span className="text-[10px] text-muted-foreground">Dibuat pada</span>
                                                <Badge variant="secondary" className="font-normal">
                                                    {format(new Date(attendance.created_at), 'dd/MM/yyyy')}
                                                </Badge>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => handleViewAttendance(attendance.id)} className="gap-2">
                                                <Eye className="h-4 w-4" />
                                                <span className="hidden sm:inline">Lihat Detail</span>
                                                <span className="sm:hidden">Detail</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
