<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostsLandingController extends Controller
{
    /**
     * API untuk Landing Page (Client-side Fetching)
     * Mengembalikan JSON berisi 3 berita terbaru yang statusnya published.
     */
    public function index()
    {
        $posts = Post::with('author:id,name')
            ->where('is_published', true)
            ->latest()
            ->take(3)
            ->get();

        return response()->json($posts);
    }

    /**
     * Halaman Detail Berita Publik
     * Menampilkan full konten berita berdasarkan slug.
     */
    public function show($slug)
    {
        // Cari post berdasarkan slug, pastikan statusnya published
        // Jika tidak ditemukan, otomatis return 404 Not Found
        $post = Post::with('author:id,name')
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        // Render file resources/js/pages/Public/BeritaDetail.tsx
        return Inertia::render('Public/BeritaDetail', [
            'post' => $post
        ]);
    }

    // Menampilkan halaman React
    public function allNews()
    {
        return Inertia::render('Public/AllBerita');
    }

    // API JSON untuk mengambil semua berita (bisa dipaginate)
    public function getAllNews()
    {
        $posts = Post::with('author:id,name')
            ->where('is_published', true)
            ->latest()
            ->get(); // Atau ->paginate(9) jika ingin pagination

        return response()->json($posts);
    }

    // Tambahkan method ini di dalam class PostsLandingController
    public function kelembagaan()
    {
        return Inertia::render('Public/Kelembagaan');
    }
}