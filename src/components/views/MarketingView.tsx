import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Tag, 
  Star, 
  Check, 
  Copy, 
  Sparkles, 
  Users, 
  Percent,
  MessageCircle
} from 'lucide-react';

interface MarketingViewProps {
  onBack: () => void;
}

export const MarketingView: React.FC<MarketingViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'voucher' | 'reviews'>('broadcast');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const PROMO_TEMPLATES = [
    {
      title: 'Promo Ganti Oli + Servis Ringan Diskon 15%',
      target: 'Pelanggan Matic (Vario, BeAT, NMAX, Aerox)',
      message: `🛵 PROMO BENGKEL QU 1.60! 🛵\n\nHalo Sahabat Bengkel Qu!\nSudah berapa KM motormu belum ganti oli? Dapatkan DISKON 15% untuk Paket Ganti Oli + Servis CVT hari ini!\n\n✅ Oli Original Garansi Asli\n✅ Mekanik Berpengalaman\n✅ Free Cek Tekanan Angin & Rem\n\nYuk mampir ke Bengkel Qu sekarang! Tunjukkan pesan ini ke kasir.`
    },
    {
      title: 'Reminder Servis CVT & Pembersihan Injeksi',
      target: 'Pelanggan rutin 3 bulan terakhir',
      message: `🔧 MOTOR NGEGERUNG / GETAR DI CVT? 🔧\n\nJangan tunggu v-belt putus di jalan! Di Bengkel Qu lagi ada PROMO TUNE UP INJEKSI + SERVIS CVT cuma Rp 85.000 (Normal Rp 110.000).\n\nBooking antrian sekarang tanpa nunggu lama via WhatsApp kami!`
    },
    {
      title: 'Gratis Pengecekan Aki & Kelistrikan',
      target: 'Semua Pelanggan Terdaftar',
      message: `⚡ CEK AKI & KELISTRIKAN GRATIS! ⚡\n\nMusim hujan rawan mogok! Bengkel Qu menyediakan pengecekan kesehatan aki digital GRATIS untuk semua jenis motor.\n\nServis nyaman, sparepart komplit, harga transparan!`
    }
  ];

  const VOUCHERS = [
    { code: 'BENGKELQU10', discount: 'Diskon 10%', minOrder: 'Rp 100.000', validUntil: '31 Okt 2026', type: 'Jasa Servis' },
    { code: 'OLIBERKAH5', discount: 'Potongan Rp 5.000', minOrder: 'Pembelian Oli SPX/Yamalube', validUntil: '15 Nov 2026', type: 'Sparepart' },
    { code: 'MEMBERVIP', discount: 'Diskon 20%', minOrder: 'Khusus Member 5x Servis', validUntil: '31 Des 2026', type: 'All Package' }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {/* Top Header */}
      <div className="bg-[#008952] text-white px-5 pt-4 pb-6 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="w-10 h-10 rounded-full bg-white/15 active:bg-white/30 flex items-center justify-center transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Marketing & Promo</h1>
              <p className="text-xs text-emerald-100 font-medium">Broadcast WhatsApp & Voucher</p>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
            CRM Bengkel Qu
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 mt-4 bg-emerald-800/50 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'broadcast' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Broadcast WA
          </button>
          <button
            onClick={() => setActiveTab('voucher')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'voucher' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Voucher Promo
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'reviews' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Ulasan Pelanggan
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {activeTab === 'broadcast' && (
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 flex items-center gap-2.5">
              <MessageCircle className="w-5 h-5 text-[#008952] shrink-0" />
              <span>
                Pilih template pesan promo di bawah untuk disalin atau dikirimkan langsung ke pelanggan.
              </span>
            </div>

            {PROMO_TEMPLATES.map((tmpl, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{tmpl.title}</h3>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold mt-1 inline-block">
                      Target: {tmpl.target}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-700 font-mono whitespace-pre-line border border-slate-200/60 leading-relaxed">
                  {tmpl.message}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleCopy(tmpl.message, idx)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Pesan WA</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'voucher' && (
          <div className="space-y-3">
            {VOUCHERS.map((v, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 shadow-xs border border-dashed border-emerald-300 relative overflow-hidden space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#008952]" />
                    <span className="font-black text-slate-900 text-base tracking-wider bg-slate-100 px-2.5 py-1 rounded-lg">
                      {v.code}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-[#008952] bg-emerald-50 px-2.5 py-1 rounded-full">
                    {v.discount}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-0.5 pt-1">
                  <p>Syarat: <span className="font-semibold text-slate-800">{v.minOrder}</span></p>
                  <p>Berlaku untuk: <span className="font-semibold text-slate-800">{v.type}</span></p>
                  <p className="text-[10px] text-slate-400">Hingga: {v.validUntil}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-4">
            <div className="text-center py-2">
              <span className="text-3xl font-extrabold text-slate-900">4.9</span>
              <div className="flex items-center justify-center gap-1 text-amber-400 my-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-500">Dari 142 ulasan pelanggan Bengkel Qu</p>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Bambang Supriyanto</span>
                  <span className="text-amber-500">★★★★★</span>
                </div>
                <p className="text-slate-600">
                  "Mekanik ramah dan teliti. Servis CVT bersih banget, tarikan motor BeAT langsung enak lagi."
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Ahmad Fauzi</span>
                  <span className="text-amber-500">★★★★★</span>
                </div>
                <p className="text-slate-600">
                  "Kasirnya rapi ada nota cetak dan rincian harga transparan. Gak dimahalin."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
