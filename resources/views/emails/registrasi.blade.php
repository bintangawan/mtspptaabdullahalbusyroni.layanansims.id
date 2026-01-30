<x-mail::message>
# Pendaftaran Siswa Baru

Ada pendaftaran baru dari formulir online PPDB. Berikut adalah detail data calon santri:

<x-mail::panel>
**Data Calon Santri**
* **Nama Lengkap:** {{ $data['nama_lengkap'] }}
* **NISN:** {{ $data['nisn'] }}
* **Jenis Kelamin:** {{ $data['jenis_kelamin'] == 'L' ? 'Laki-laki' : 'Perempuan' }}
* **TTL:** {{ $data['tempat_lahir'] }}, {{ \Carbon\Carbon::parse($data['tanggal_lahir'])->format('d M Y') }}
* **Alamat:** {{ $data['alamat'] }}
* **Asal Sekolah:** {{ $data['asal_sekolah'] }}

**Data Orang Tua**
* **Ayah:** {{ $data['nama_ayah'] }}
* **Ibu:** {{ $data['nama_ibu'] }}
* **No. HP:** {{ $data['no_hp_ortu'] }}
</x-mail::panel>

Silakan segera hubungi nomor orang tua di atas untuk konfirmasi pendaftaran.

<x-mail::button :url="config('app.url')">
Buka Aplikasi
</x-mail::button>

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>