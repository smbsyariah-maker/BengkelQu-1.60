import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  UserCheck, 
  Phone, 
  FileText, 
  Share2,
  Calendar,
  Sparkles,
  ChevronRight,
  Printer
} from 'lucide-react';
import { ServiceQueue, ServiceStatus } from '../../types';

interface ServiceDetailViewProps {
  initialTab?: string;
  queues: ServiceQueue[];
  onBack: () => void;
  onOpenNewQueue: () => void;
  onUpdateQueueStatus: (id: string, status: ServiceStatus, progress?: number) => void;
  onSelectQueueForInvoice?: (queue: ServiceQueue) => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({
  initialTab = 'antrian',
  queues,
  onBack,
  onOpenNewQueue,
  onUpdateQueueStatus,
  onSelectQueueForInvoice
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQueue, setSelectedQueue] = useState<ServiceQueue | null>(null);

  const filteredQueues = queues.filter((q) => {
    const matchesSearch =
      q.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.queueNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'semua') return matchesSearch;
    return matchesSearch && q.status === filterStatus;
  });

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {/* Top Header matching green & white theme */}
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
              <h1 className="text-xl font-bold tracking-tight">Manajemen Servis</h1>
              <p className="text-xs text-emerald-100 font-medium">Antrian & Pengerjaan Kendaraan</p>
            </div>
          </div>
          <button
            onClick={onOpenNewQueue}
            className="bg-white text-[#008952] font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Unit Baru</span>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 mt-4 bg-emerald-800/50 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('antrian')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'antrian' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Antrian Aktif
          </button>
          <button
            onClick={() => setActiveTab('daftar-service')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'daftar-service' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Daftar Servis
          </button>
          <button
            onClick={() => setActiveTab('proses-service')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'proses-service' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Proses Mekanik
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="px-4 py-3 bg-white border-b border-slate-100 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Plat (D 1234 ABC), Nama, Motor..."
            className="w-full bg-slate-100 text-xs text-slate-800 rounded-xl pl-9 pr-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['semua', 'menunggu', 'proses', 'selesai', 'diambil'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                filterStatus === st
                  ? 'bg-[#008952] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Queue List Content */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {filteredQueues.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 mt-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#008952] flex items-center justify-center mx-auto mb-2">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Tidak ada kendaraan di status ini</h3>
            <p className="text-xs text-slate-400 mt-1">Coba ganti filter status atau input antrian baru</p>
            <button
              onClick={onOpenNewQueue}
              className="mt-4 bg-[#008952] text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Tambah Antrian Baru
            </button>
          </div>
        ) : (
          filteredQueues.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 hover:border-emerald-200 transition-all space-y-3"
            >
              {/* Header card */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-xl bg-[#008952] text-white flex flex-col items-center justify-center shadow-xs">
                    <span className="text-[10px] font-medium leading-none text-emerald-100">No</span>
                    <span className="text-sm font-black leading-none mt-0.5">{item.queueNumber}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-sm">{item.plateNumber}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                        {item.vehicleType}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">{item.vehicleModel}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      {item.customerName} ({item.customerPhone})
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                    item.status === 'proses'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : item.status === 'selesai'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : item.status === 'diambil'
                      ? 'bg-slate-100 text-slate-600 border border-slate-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Keluhan & Kategori */}
              <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#008952]">{item.serviceCategory}</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Masuk: {item.timeIn}
                  </span>
                </div>
                <p className="text-slate-700 font-normal">
                  <span className="font-semibold text-slate-900">Keluhan: </span>
                  {item.complaint}
                </p>
                {item.notes && (
                  <p className="text-[11px] text-emerald-700 bg-emerald-50/70 p-1.5 rounded-md">
                    <span className="font-semibold">Catatan Mekanik: </span>
                    {item.notes}
                  </p>
                )}
              </div>

              {/* Spareparts & Jasa list preview */}
              <div className="border-t border-slate-100 pt-2">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Estimasi Part & Jasa ({item.items.length} item)
                  </span>
                  <span className="font-extrabold text-[#008952] text-xs">
                    Rp {item.totalCost.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.items.slice(0, 3).map((it, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-white border border-slate-200 rounded-md px-2 py-0.5 text-slate-700"
                    >
                      {it.name} (x{it.qty})
                    </span>
                  ))}
                  {item.items.length > 3 && (
                    <span className="text-[10px] bg-slate-100 rounded-md px-1.5 py-0.5 text-slate-500">
                      +{item.items.length - 3} lainnya
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar & Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#008952] flex items-center justify-center text-xs font-bold">
                    {item.mechanicName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block leading-none">Mekanik</span>
                    <span className="text-xs font-semibold text-slate-800 leading-none">
                      {item.mechanicName}
                    </span>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-1.5">
                  {item.status === 'menunggu' && (
                    <button
                      onClick={() => onUpdateQueueStatus(item.id, 'proses', 30)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                    >
                      Mulai Kerjakan
                    </button>
                  )}
                  {item.status === 'proses' && (
                    <button
                      onClick={() => onUpdateQueueStatus(item.id, 'selesai', 100)}
                      className="bg-[#008952] hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selesaikan
                    </button>
                  )}
                  {item.status === 'selesai' && (
                    <button
                      onClick={() => {
                        if (onSelectQueueForInvoice) {
                          onSelectQueueForInvoice(item);
                        } else {
                          onUpdateQueueStatus(item.id, 'diambil');
                        }
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> Bayar di Kasir
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
