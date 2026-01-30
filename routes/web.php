<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Chatbot\ChatbotController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\PostsLandingController;

// --- BAGIAN INI YANG DIUBAH ---
// Sebelumnya redirect ke login, sekarang panggil LandingController
Route::get('/', [LandingController::class, 'index'])->name('home'); 
Route::get('/api/landing-news', [PostsLandingController::class, 'index'])->name('api.landing-news');
Route::get('/berita/{slug}', [PostsLandingController::class, 'show'])->name('public.berita.show');
// Halaman Semua Berita
Route::get('/berita', [PostsLandingController::class, 'allNews'])->name('public.berita.index');
// API untuk mengambil semua berita (JSON)
Route::get('/api/all-news', [PostsLandingController::class, 'getAllNews'])->name('api.all-news');
Route::get('/kelembagaan', [PostsLandingController::class, 'kelembagaan'])->name('public.kelembagaan');
Route::get('/registrasi', [RegistrationController::class, 'index'])->name('registrasi.index');
Route::post('/registrasi', [RegistrationController::class, 'store'])->name('registrasi.store');

// Route untuk Chatbot
Route::post('/chatbot', [ChatbotController::class, 'handle'])->name('chatbot.handle');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard utama: pilih role otomatis → redirect ke /dashboard/{role}
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Dashboard spesifik role
    Route::get('/dashboard/{role}', [DashboardController::class, 'index'])
        ->whereIn('role', ['admin', 'guru', 'siswa'])
        ->name('role.dashboard');
});

// File routes lainnya (Login ada di dalam auth.php, jadi aman)
require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/guru.php';
require __DIR__ . '/siswa.php';
require __DIR__ . '/api.php';