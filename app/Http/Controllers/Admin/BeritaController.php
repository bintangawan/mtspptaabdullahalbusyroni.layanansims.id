<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BeritaController extends Controller
{
    public function index(Request $request)
    {
        // Query dasar
        $query = Post::with('author:id,name')->orderBy('created_at', 'desc');

        // 1. Filter Search (Judul)
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // 2. Filter Bulan
        if ($request->filled('month')) {
            $query->whereMonth('created_at', $request->month);
        }

        // 3. Filter Tahun
        if ($request->filled('year')) {
            $query->whereYear('created_at', $request->year);
        }

        // Pagination
        $posts = $query->paginate(10)->withQueryString(); // withQueryString agar pagination tidak mereset filter

        return Inertia::render('Admin/Berita/Index', [
            'posts' => $posts,
            // Kembalikan state filter ke frontend agar input tidak kosong setelah reload
            'filters' => $request->only(['search', 'month', 'year']),
        ]);
    }

    // ... method create, store, edit, update, destroy TETAP SAMA seperti sebelumnya ...
    public function create()
    {
        return Inertia::render('Admin/Berita/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'tags' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
        }

        Post::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . Str::random(5),
            'content' => $request->content,
            'tags' => $request->tags,
            'image' => $imagePath,
            'author_id' => auth()->id(),
            'is_published' => $request->is_published ?? true,
        ]);

        return redirect()->route('admin.berita.index')->with('success', 'Berita berhasil diterbitkan');
    }

    public function edit($id)
    {
        $post = Post::findOrFail($id);
        return Inertia::render('Admin/Berita/Edit', ['post' => $post]);
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'tags' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($post->image) Storage::disk('public')->delete($post->image);
            $post->image = $request->file('image')->store('posts', 'public');
        }

        $post->update([
            'title' => $request->title,
            'content' => $request->content,
            'tags' => $request->tags,
            'is_published' => $request->is_published,
        ]);

        return redirect()->route('admin.berita.index')->with('success', 'Berita berhasil diperbarui');
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        if ($post->image) Storage::disk('public')->delete($post->image);
        $post->delete();
        return back()->with('success', 'Berita berhasil dihapus');
    }
}