import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  CheckCircle, 
  CreditCard, 
  QrCode, 
  Coins, 
  FileText,
  Sparkles,
  Receipt
} from 'lucide-react';
import { ServiceItem, Sparepart, Transaction, ServiceQueue } from '../../types';

interface CashierPOSViewProps {
  onBack: () => void;
  spareparts: Sparepart[];
  transactions: Transaction[];
  queues: ServiceQueue[];
  onCompleteTransaction: (newTx: Transaction) => void;
  onOpenReceipt: (tx: Transaction) => void;
  preselectedQueue?: ServiceQueue | null;
}

export const CashierPOSView: React.FC<CashierPOSViewProps> = ({
  onBack,
  spareparts,
  transactions,
  queues,
  onCompleteTransaction,
  onOpenReceipt,
  preselectedQueue
}) => {
  const [activeTab, setActiveTab] = useState<'pos' | 'history' | 'recap'>('pos');
  const [customerName, setCustomerName] = useState(preselectedQueue?.customerName || 'Penjualan Umum (Walk-in)');
  const [plateNumber, setPlateNumber] = useState(preselectedQueue?.plateNumber || '-');
  const [vehicleModel, setVehicleModel] = useState(preselectedQueue?.vehicleModel || 'Pelanggan Toko');
  const [mechanicName, setMechanicName] = useState(preselectedQueue?.mechanicName || 'Mas Joko');
  
  // Cart items
  const [cart, setCart] = useState<ServiceItem[]>(
    preselectedQueue?.items || [
      { id: 'pos-1', name: 'AHM Oil MPX2 0.8L (Matic)', price: 56000, qty: 1, type: 'part' },
      { id: 'pos-2', name: 'Jasa Ganti Oli Cepat', price: 15000, qty: 1, type: 'jasa' }
    ]
  );

  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Transfer Bank'>('Tunai');
  const [discount, setDiscount] = useState<number>(0);
  const [cashAmount, setCashAmount] = useState<number>(100000);
  const [searchPart, setSearchPart] = useState('');

  // Quick Service Services
  const SERVICE_PRESETS = [
    { name: 'Jasa Servis Lengkap Matic', price: 65000 },
    { name: 'Jasa Servis CVT & Greasing', price: 45000 },
    { name: 'Jasa Tune Up Injeksi', price: 50000 },
    { name: 'Jasa Ganti Oli Mesin & Gardan', price: 15000 },
    { name: 'Jasa Setel Rem Depan & Belakang', price: 25000 },
    { name: 'Jasa Bongkar Pasang Ban Luar', price: 20000 }
  ];

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Math.max(0, subtotal - discount);
  const change = Math.max(0, cashAmount - total);

  const handleAddToCart = (name: string, price: number, type: 'part' | 'jasa') => {
    const existingIndex = cart.findIndex((i) => i.name === name);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].qty += 1;
      setCart(updated);
    } else {
      setCart([...cart, { id: `item-${Date.now()}-${Math.random()}`, name, price, qty: 1, type }]);
    }
  };

  const handleUpdateQty = (index: number, delta: number) => {
    const updated = [...cart];
    const newQty = updated[index].qty + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].qty = newQty;
    }
    setCart(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const handleProcessPayment = () => {
    if (cart.length === 0) return;
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      invoiceNumber: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      customerName,
      plateNumber,
      vehicleModel,
      mechanicName,
      items: cart,
      subtotal,
      discount,
      total,
      paymentMethod,
      cashPaid: paymentMethod === 'Tunai' ? cashAmount : total,
      change: paymentMethod === 'Tunai' ? change : 0,
      status: 'Lunas'
    };

    onCompleteTransaction(newTx);
    onOpenReceipt(newTx);
    // Reset cart
    setCart([]);
    setCustomerName('Penjualan Umum (Walk-in)');
    setPlateNumber('-');
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
              <h1 className="text-xl font-bold tracking-tight">Kasir POS Bengkel Qu</h1>
              <p className="text-xs text-emerald-100 font-medium">Pembayaran Jasa & Sparepart</p>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
            Shift 1 • Kasir Aktif
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 mt-4 bg-emerald-800/50 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('pos')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'pos' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Kasir Baru
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'history' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Riwayat Nota ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('recap')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'recap' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100'
            }`}
          >
            Tutup Kasir
          </button>
        </div>
      </div>

      {activeTab === 'pos' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Customer / Vehicle info selector */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Pelanggan & Kendaraan</span>
              {queues.filter(q => q.status === 'selesai').length > 0 && (
                <span className="text-[10px] text-[#008952] font-semibold">
                  Tersedia dari antrian selesai
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block mb-1">Nama Pelanggan</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block mb-1">Nomor Plat</label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold uppercase text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Quick Add Section: Sparepart & Jasa */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-800">Tambah Cepat Jasa & Suku Cadang</h3>
            
            {/* Quick Jasa Chips */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">Pilihan Jasa Servis:</span>
              <div className="flex flex-wrap gap-1.5">
                {SERVICE_PRESETS.map((srv, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddToCart(srv.name, srv.price, 'jasa')}
                    className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-[#008952] font-semibold px-2.5 py-1 rounded-lg border border-emerald-200 active:scale-95 transition-all"
                  >
                    + {srv.name} (Rp {srv.price.toLocaleString('id-ID')})
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Sparepart Search */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">Pilih dari Stok Sparepart:</span>
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchPart}
                  onChange={(e) => setSearchPart(e.target.value)}
                  placeholder="Cari sparepart (Oli MPX2, Busi, Kampas Rem)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2 py-1.5 text-xs"
                />
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1 scrollbar-thin">
                {spareparts
                  .filter((p) => p.name.toLowerCase().includes(searchPart.toLowerCase()))
                  .slice(0, 5)
                  .map((part) => (
                    <div
                      key={part.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-emerald-50/50 text-xs transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-slate-800 block leading-tight">{part.name}</span>
                        <span className="text-[10px] text-slate-500">Stok: {part.stock} {part.unit} • {part.rackLocation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#008952]">Rp {part.sellPrice.toLocaleString('id-ID')}</span>
                        <button
                          onClick={() => handleAddToCart(part.name, part.sellPrice, 'part')}
                          className="bg-[#008952] text-white text-[10px] font-bold px-2 py-1 rounded-md active:scale-95"
                        >
                          + Tambah
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Cart & Billing Section */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800">Keranjang Nota ({cart.length} item)</h3>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-[10px] font-semibold text-rose-600 hover:underline"
                >
                  Kosongkan
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada item ditambahkan ke kasir</p>
            ) : (
              <div className="space-y-2">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-slate-100 text-xs"
                  >
                    <div className="flex-1 pr-2">
                      <span className="font-semibold text-slate-800 block leading-tight">{item.name}</span>
                      <span className="text-[10px] text-slate-400">@ Rp {item.price.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5">
                        <button
                          onClick={() => handleUpdateQty(idx, -1)}
                          className="w-5 h-5 rounded bg-white text-slate-700 flex items-center justify-center font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs px-1">{item.qty}</span>
                        <button
                          onClick={() => handleUpdateQty(idx, 1)}
                          className="w-5 h-5 rounded bg-white text-slate-700 flex items-center justify-center font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-slate-900 w-20 text-right">
                        Rp {(item.price * item.qty).toLocaleString('id-ID')}
                      </span>

                      <button
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Subtotal & Discount */}
                <div className="pt-2 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Diskon / Potongan:</span>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                      className="w-24 text-right bg-slate-50 border border-slate-200 rounded p-1 text-xs font-semibold text-rose-600"
                    />
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-[#008952] pt-2 border-t border-slate-200">
                    <span>Total Tagihan:</span>
                    <span>Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method & Process Button */}
          {cart.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-800">Metode Pembayaran</h3>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Tunai', icon: Coins, label: 'Tunai' },
                  { id: 'QRIS', icon: QrCode, label: 'QRIS BCA' },
                  { id: 'Transfer Bank', icon: CreditCard, label: 'Transfer' }
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === m.id
                          ? 'border-[#008952] bg-emerald-50 text-[#008952] font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px]">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === 'Tunai' && (
                <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Uang Diterima:</span>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(Number(e.target.value) || 0)}
                      className="w-32 text-right bg-white border border-slate-300 rounded-lg p-1.5 font-bold text-slate-900"
                    />
                  </div>
                  {/* Quick Cash Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setCashAmount(total)}
                      className="text-[10px] bg-white border rounded px-2 py-1 font-semibold text-slate-700"
                    >
                      Uang Pas
                    </button>
                    {[50000, 100000, 200000, 500000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setCashAmount(amt)}
                        className="text-[10px] bg-white border rounded px-2 py-1 font-semibold text-slate-700"
                      >
                        Rp {amt.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-600">Kembalian:</span>
                    <span className="text-sm font-extrabold text-[#008952]">
                      Rp {change.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleProcessPayment}
                className="w-full bg-[#008952] hover:bg-emerald-700 active:scale-98 text-white font-bold py-3.5 rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all"
              >
                <Printer className="w-5 h-5" />
                <span>Bayar & Cetak Nota (Rp {total.toLocaleString('id-ID')})</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-2 hover:border-emerald-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-900 block">{tx.invoiceNumber}</span>
                  <span className="text-[10px] text-slate-400">{tx.date}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#008952] border border-emerald-100">
                  {tx.paymentMethod}
                </span>
              </div>

              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">{tx.customerName}</span> ({tx.plateNumber} - {tx.vehicleModel})
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500">{tx.items.length} item pengerjaan</span>
                <span className="font-extrabold text-[#008952] text-sm">
                  Rp {tx.total.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => onOpenReceipt(tx)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Lihat / Cetak Struk</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recap Tab (Tutup Kasir) */}
      {activeTab === 'recap' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Rekap Kasir Harian (Shift 1)</h3>
            <p className="text-xs text-slate-500">Ringkasan uang masuk dari pembayaran kasir hari ini.</p>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Total Transaksi Selesai:</span>
                <span className="font-bold text-slate-900">{transactions.length} Nota</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Total Pembayaran Tunai (Cash):</span>
                <span className="font-bold text-slate-900">
                  Rp {transactions.filter(t => t.paymentMethod === 'Tunai').reduce((a, b) => a + b.total, 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Total Pembayaran Non-Tunai (QRIS/Transfer):</span>
                <span className="font-bold text-slate-900">
                  Rp {transactions.filter(t => t.paymentMethod !== 'Tunai').reduce((a, b) => a + b.total, 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#008952] pt-2">
                <span>Total Omset Shift:</span>
                <span>Rp {transactions.reduce((a, b) => a + b.total, 0).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
