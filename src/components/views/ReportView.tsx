import React, { useState } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  PieChart, 
  Users, 
  Calendar, 
  Download, 
  DollarSign,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { Transaction, Mechanic } from '../../types';

interface ReportViewProps {
  onBack: () => void;
  transactions: Transaction[];
  mechanics: Mechanic[];
}

export const ReportView: React.FC<ReportViewProps> = ({
  onBack,
  transactions,
  mechanics
}) => {
  const [activeTab, setActiveTab] = useState<'revenue' | 'mechanics' | 'margin'>('revenue');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const totalOmset = transactions.reduce((sum, t) => sum + t.total, 0);

  // Breakdown jasa vs part
  let totalJasa = 0;
  let totalPart = 0;
  transactions.forEach((tx) => {
    tx.items.forEach((it) => {
      if (it.type === 'jasa') totalJasa += it.price * it.qty;
      else totalPart += it.price * it.qty;
    });
  });

  const handleDownloadReport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
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
              <h1 className="text-xl font-bold tracking-tight">Laporan & Keuangan</h1>
              <p className="text-xs text-emerald-100 font-medium">Omset, Margin & Komisi Mekanik</p>
            </div>
          </div>
          <button
            onClick={handleDownloadReport}
            className="bg-white text-[#008952] font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Ekspor</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 mt-4 bg-emerald-800/50 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('revenue')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'revenue' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Omset Bengkel
          </button>
          <button
            onClick={() => setActiveTab('mechanics')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'mechanics' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Kinerja Mekanik
          </button>
          <button
            onClick={() => setActiveTab('margin')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'margin' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Jasa vs Part
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="m-4 p-3 bg-emerald-100 text-[#008952] rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>Laporan Harian Bengkel Qu berhasil diunduh (Excel format).</span>
        </div>
      )}

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {activeTab === 'revenue' && (
          <div className="space-y-3">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block">Total Omset</span>
                <span className="text-lg font-extrabold text-[#008952] block mt-1">
                  Rp {totalOmset.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">↑ 18% dari target</span>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block">Nota Transaksi</span>
                <span className="text-lg font-extrabold text-slate-900 block mt-1">
                  {transactions.length} Faktur
                </span>
                <span className="text-[10px] text-slate-400">Rata-rata Rp {(totalOmset / (transactions.length || 1)).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Rekap Metode Bayar */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-2.5">
              <h3 className="font-bold text-slate-900 text-xs">Arus Kas Masuk per Saluran</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Tunai (Cash Laci):</span>
                  <span className="font-bold text-slate-900">
                    Rp {transactions.filter(t => t.paymentMethod === 'Tunai').reduce((a, b) => a + b.total, 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">QRIS (BCA / E-Wallet):</span>
                  <span className="font-bold text-[#008952]">
                    Rp {transactions.filter(t => t.paymentMethod === 'QRIS').reduce((a, b) => a + b.total, 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Transfer Bank:</span>
                  <span className="font-bold text-blue-600">
                    Rp {transactions.filter(t => t.paymentMethod === 'Transfer Bank').reduce((a, b) => a + b.total, 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mechanics' && (
          <div className="space-y-3">
            {mechanics.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#008952] text-white flex items-center justify-center font-bold text-sm">
                      {m.name.split(' ')[1]?.charAt(0) || m.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{m.name}</h4>
                      <p className="text-[11px] text-slate-500">{m.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Rating</span>
                    <span className="text-xs font-extrabold text-amber-500">★ {m.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Dikerjakan Hari Ini</span>
                    <span className="text-xs font-bold text-slate-800">{m.completedToday} Unit</span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-xl">
                    <span className="text-[10px] text-emerald-700 block">Estimasi Komisi</span>
                    <span className="text-xs font-bold text-[#008952]">
                      Rp {(m.completedToday * 25000).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'margin' && (
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Perbandingan Pendapatan Bengkel</h3>
            
            {/* Visual ratio bar */}
            <div>
              <div className="h-4 rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  className="bg-[#008952] h-full"
                  style={{ width: `${(totalJasa / (totalJasa + totalPart || 1)) * 100}%` }}
                />
                <div
                  className="bg-blue-500 h-full"
                  style={{ width: `${(totalPart / (totalJasa + totalPart || 1)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold mt-1.5">
                <span className="text-[#008952]">Jasa Servis: Rp {totalJasa.toLocaleString('id-ID')}</span>
                <span className="text-blue-600">Suku Cadang & Oli: Rp {totalPart.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
              <p>
                • Margin jasa servis berkontribusi langsung sebesar ~90% laba kotor bengkel.
              </p>
              <p>
                • Penjualan oli dan kampas rem merupakan kontributor perputaran kas tertinggi.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
