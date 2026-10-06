import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  UserCheck, 
  Phone, 
  Car, 
  Calendar, 
  MessageSquare, 
  Award,
  Plus,
  Send,
  Check
} from 'lucide-react';
import { CustomerVehicle } from '../../types';

interface CustomerViewProps {
  customers: CustomerVehicle[];
  onBack: () => void;
  onAddNewCustomer: (cust: CustomerVehicle) => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  customers,
  onBack,
  onAddNewCustomer
}) => {
  const [activeTab, setActiveTab] = useState<'database' | 'reminder' | 'loyalty'>('database');
  const [searchQuery, setSearchQuery] = useState('');
  const [waSentNotice, setWaSentNotice] = useState<string | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const handleSendReminderWA = (cust: CustomerVehicle) => {
    const text = encodeURIComponent(
      `Halo Kak ${cust.name}, ini dari Bengkel Qu! Mengingatkan motor Kakak ${cust.vehicleModel} (${cust.plateNumber}) sudah waktunya jadwal servis berkala & ganti oli rutin agar tarikan tetap enteng dan awet. Silakan datang ke Bengkel Qu, kami siap melayani!`
    );
    // WhatsApp URL (cleaner without window.open popup errors)
    const url = `https://wa.me/${cust.phone.replace(/^0/, '62')}?text=${text}`;
    setWaSentNotice(`Pesan reminder disiapkan untuk ${cust.name}`);
    setTimeout(() => {
      setWaSentNotice(null);
      window.open(url, '_blank');
    }, 800);
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
              <h1 className="text-xl font-bold tracking-tight">Database Pelanggan</h1>
              <p className="text-xs text-emerald-100 font-medium">Plat Nomor, Motor & Riwayat</p>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
            {customers.length} Terdaftar
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 mt-4 bg-emerald-800/50 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('database')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'database' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Data Pelanggan
          </button>
          <button
            onClick={() => setActiveTab('reminder')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'reminder' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Reminder WA (Jadwal)
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'loyalty' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Poin Loyalitas
          </button>
        </div>
      </div>

      {waSentNotice && (
        <div className="m-4 p-3 bg-emerald-100 text-[#008952] rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-300">
          <Check className="w-4 h-4" />
          <span>{waSentNotice}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Search Bar */}
        <div className="px-4 py-3 bg-white border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Plat (D 4521 ABC), Nama, Nomor HP..."
              className="w-full bg-slate-100 text-xs text-slate-800 rounded-xl pl-9 pr-3 py-2.5 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Customer Cards */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 hover:border-emerald-200 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-[#008952] text-white">
                      {cust.plateNumber}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{cust.name}</h3>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-1">
                    {cust.vehicleModel} ({cust.year})
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    {cust.phone}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Total Kunjungan</span>
                  <span className="text-xs font-extrabold text-slate-800">{cust.totalVisits} Kali Servis</span>
                  <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold justify-end mt-1">
                    <Award className="w-3 h-3" />
                    <span>{cust.loyaltyPoints} Pts</span>
                  </div>
                </div>
              </div>

              {cust.notes && (
                <div className="bg-slate-50 rounded-xl p-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Catatan Servis: </span>
                  {cust.notes}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] text-slate-400">
                  Servis Terakhir: <span className="font-medium text-slate-700">{cust.lastServiceDate}</span>
                </span>
                <button
                  onClick={() => handleSendReminderWA(cust)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-[#008952] border border-emerald-200 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Reminder WA</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
