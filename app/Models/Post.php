<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $table = 'posts';

    protected $fillable = [
        'title',
        'slug',
        'content',
        'image',
        'tags',          // Kolom baru tadi
        'is_published',
        'author_id',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    /**
     * Relasi: Berita dimiliki oleh satu User (Penulis)
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}