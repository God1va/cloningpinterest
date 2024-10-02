import Navbar from './components/Navbar';
import { useState, useEffect } from 'react';
import { FaCheckCircle, FaQuestion } from "react-icons/fa";
import Image from 'next/image';
import Link from 'next/link';

const zodiakList = [
  { name: "Capricorn", start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
  { name: "Aquarius", start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
  { name: "Pisces", start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
  { name: "Aries", start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
  { name: "Taurus", start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
  { name: "Gemini", start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
  { name: "Cancer", start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
  { name: "Leo", start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
  { name: "Virgo", start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
  { name: "Libra", start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
  { name: "Scorpio", start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
  { name: "Sagittarius", start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
  { name: "Capricorn", start: { month: 12, day: 22 }, end: { month: 12, day: 31 } } // Capricorn juga termasuk awal Januari
];

// Fungsi untuk mendapatkan zodiak berdasarkan tanggal
const getZodiak = (month, day) => {
  for (const zodiak of zodiakList) {
    const startMonth = zodiak.start.month;
    const endMonth = zodiak.end.month;
    const startDay = zodiak.start.day;
    const endDay = zodiak.end.day;

    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay) ||
      (startMonth < endMonth && month > startMonth && month < endMonth) ||
      (startMonth > endMonth && (month > startMonth || month < endMonth))
    ) {
      return zodiak.name;
    }
  }
  return null;
};

const Jelajahi = () => {
  const [tanggalSekarang, setTanggalSekarang] = useState('');
  const [zodiak, setZodiak] = useState('');

  useEffect(() => {
    const tanggal = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = tanggal.toLocaleDateString('id-ID', options); // Format sesuai bahasa Indonesia
    setTanggalSekarang(formattedDate);

    // Ambil bulan dan tanggal sekarang
    const month = tanggal.getMonth() + 1; // getMonth() dimulai dari 0
    const day = tanggal.getDate();

    // Dapatkan zodiak berdasarkan bulan dan tanggal
    const currentZodiak = getZodiak(month, day);
    setZodiak(currentZodiak);
  }, []);

  return (
    <div className="bg-wh">
      <Navbar />
      <div className="pt-24 bg-white">
        <p className="pt-3 text-center text-xl text-black font-medium leading-7">
          {tanggalSekarang}
        </p>
        <p className="text-center text-black font-medium text-4xl font-sans leading-relaxed">
          Dapatkan Inspirasi
        </p>

        {/* Grid untuk gambar */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-20 pt-8">
          <div className="relative w-full max-w-[440px] h-[330px] mx-auto cursor-pointer">
            <Image
              src="/jelajahi1.jpg"
              alt="Image 1"
              layout="fill"
              objectFit="cover"
              className="rounded-[24px] brightness-50 hover:drop-shadow-2xl cursor-pointer"
            />
            <div className="absolute bottom-5 left-0 right-0 text-white text-center py-2 rounded-b-[24px]">
              <p className='text-mx pb-1'>si rapih yang bisa diandalkan</p>
              <p className="text-3xl font-medium">Zodiak bulan ini: {zodiak}</p>
            </div>
          </div>
          {/* Tambahkan gambar lain dengan format yang sama */}
          <div className="relative w-full max-w-[440px] h-[330px] mx-auto cursor-pointer">
            <Image
              src="/jelajahi2.jpeg"
              alt="Image 2"
              layout="fill"
              objectFit="cover"
              className="rounded-[24px] brightness-50 hover:drop-shadow-2xl cursor-pointer"
            />
            <div className="absolute bottom-5 left-0 right-0 text-white text-center py-2 rounded-b-[24px]">
              <p className='text-mx pb-1'>teman musim hujan</p>
              <p className="text-3xl font-medium">Resep minuman hangat</p>
            </div>
          </div>
          <div className="relative w-full max-w-[440px] h-[330px] mx-auto cursor-pointer">
            <Image
              src="/jelajahi3.jpeg"
              alt="Image 3"
              layout="fill"
              objectFit="cover"
              className="rounded-[24px] brightness-50 hover:drop-shadow-2xl"
            />
            <div className="absolute bottom-5 left-0 right-0 text-white text-center py-2 px-4 rounded-b-[24px]">
              <p className='text-mx pb-1'>atau untuk dikirim ke teman</p>
              <p className="text-3xl font-medium">Kata kata untukmu yang butuh semangat</p>
            </div>
          </div>
          <div className="relative w-full max-w-[440px] h-[330px] mx-auto cursor-pointer">
            <Image
              src="/jelajahi4.jpeg"
              alt="Image 4"
              layout="fill"
              objectFit="cover"
              className="rounded-[24px] brightness-50 hover:drop-shadow-2xl cursor-pointer"
            />
            <div className="absolute bottom-5 left-0 right-0 text-white text-center py-2 px-4 rounded-b-[24px]">
              <p className='text-mx pb-1'>gaya senin-jumat</p>
              <p className="text-3xl font-medium">OOTD oversize buat ngampus</p>
            </div>
          </div>
          <div className="relative w-full max-w-[440px] h-[330px] mx-auto cursor-pointer">
            <Image
              src="/jelajahi5.jpeg"
              alt="Image 5"
              layout="fill"
              objectFit="cover"
              className="rounded-[24px] brightness-50 hover:drop-shadow-2xl cursor-pointer"
            />
            <div className="absolute bottom-5 left-0 right-0 text-white text-center py-2 px-4 rounded-b-[24px]">
              <p className='text-mx pb-1'>statement & fungsi</p>
              <p className="text-3xl font-medium">Inspo desain tangga estetik</p>
            </div>
          </div>
          <div className="relative w-full max-w-[440px] h-[330px] mx-auto cursor-pointer">
            <Image
              src="/jelajahi6.jpeg"
              alt="Image 6"
              layout="fill"
              objectFit="cover"
              className="rounded-[24px] brightness-50 hover:drop-shadow-2xl cursor-pointer"
            />
            <div className="absolute bottom-5 left-0 right-0 text-white text-center py-2 px-4 rounded-b-[24px]">
              <p className='text-mx pb-1'>tersimpel</p>
              <p className="text-3xl font-medium">Berbagai resep dari bahan: Telur</p>
            </div>
          </div>

          {/* Gambar ke-7 */}
          <div className="relative w-full h-[330px] lg:col-span-3 flex justify-center">
            <div className="relative w-[440px] h-[330px]">
              <Image
                src="/jelajahi7.jpeg"
                alt="Image 7"
                layout="fill"
                objectFit="cover"
                className="rounded-[24px] brightness-50 hover:drop-shadow-2xl cursor-pointer"
              />
              <div className="absolute bottom-5 left-0 right-0 text-white text-center py-2 px-4 rounded-b-[24px]">
                <p className='text-mx pb-1'>dari toko lokal</p>
                <p className="text-3xl font-medium">Berbagai ide hadiah untuk teman kantor</p>
              </div>
            </div>
          </div>
        </div>
        <div className='pt-28 flex flex-col items-center'>
          <FaCheckCircle className='text-black text-center w-8 h-8 mb-2' />
          <p className='text-black text-center mb-1'>
            Cukup sekian untuk hari ini
          </p>
          <p className='text-black text-center text-xl font-medium mb-10'>
            Kembali lagi besok untuk mendapatkan lebih banyak inspirasi
          </p>
                  <Link
                      href="/"
                      className='bg-zinc-200 rounded-full px-3 py-2 text-center text-black font-medium mb-24 cursor-pointer border'>
            kunjungi sajian beranda
          </Link>
        </div>
        <div className='fixed bottom-6 right-6 group rounded-full border p-4 shadow-xl cursor-pointer'>
          <FaQuestion className='text-black w-6 h-6' />
          <span className='absolute left-1/2 transform -translate-x-1/2 -mt-20 text-xs hidden group-hover:block bg-black border rounded-lg text-gray-100 py-2 px-2.5'>
            Lainnya
          </span>
        </div>
      </div>
    </div>
  );
};

export default Jelajahi;
