import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Package, 
  AlertTriangle, 
  Boxes, 
  Check, 
  Filter, 
  DollarSign,
  Truck
} from 'lucide-react';
import { Sparepart } from '../../types';

interface InventoryViewProps {
  initialTab?: string;
  spareparts: Sparepart[];
  onBack: () => void;
  onUpdateStock: (id: string, newStock: number) => void;
  onAddNewPart: (newPart: Omit<Sparepart, 'id'>) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  initialTab = 'katalog-sparepart',
  spareparts,
  onBack,
  onUpdateStock,
  onAddNewPart
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Form state for adding new part
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Sparepart['category']>('Oli & Pelumas');
  const [formBrand, setFormBrand] = useState('Honda Genuine Part');
  const [formStock, setFormStock] = useState(10);
  const [formMinStock, setFormMinStock] = useState(5);
  const [formBuyPrice, setFormBuyPrice] = useState(45000);
  const [formSellPrice, setFormSellPrice] = useState(55000);
  const [formUnit, setFormUnit] = useState('Botol');
  const [formRack, setFormRack] = useState('Rak A-1');
  const [successMsg, setSuccessMsg] = useState('');

  const categories = [
    'Semua',
    'Oli & Pelumas',
    'Sistem Rem',
    'Transmisi / CVT',
    'Busi & Kelistrikan',
    'Ban & Velg',
    'Filter & Karburator'
  ];

  const lowStockItems = spareparts.filter((p) => p.stock <= p.minStock);

  const filteredParts = spareparts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Semua' ? true : p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    onAddNewPart({
      code: `PART-${Date.now().toString().slice(-4)}`,
      name: formName,
      category: formCategory,
      brand: formBrand,
      stock: Number(formStock),
      minStock: Number(formMinStock),
      buyPrice: Number(formBuyPrice),
      sellPrice: Number(formSellPrice),
      unit: formUnit,
      rackLocation: formRack
    });

    setSuccessMsg('Sparepart berhasil ditambahkan!');
    setFormName('');
    setTimeout(() => {
      setSuccessMsg('');
      setActiveTab('katalog-sparepart');
    }, 1200);
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
              <h1 className="text-xl font-bold tracking-tight">Inventaris Sparepart</h1>
              <p className="text-xs text-emerald-100 font-medium">Stok Oli, Part & Pengadaan</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('tambah-sparepart')}
            className="bg-white text-[#008952] font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Barang</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 mt-4 bg-emerald-800/50 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('katalog-sparepart')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'katalog-sparepart'
                ? 'bg-white text-[#008952] shadow-xs'
                : 'text-emerald-100'
            }`}
          >
            Katalog Part ({spareparts.length})
          </button>
          <button
            onClick={() => setActiveTab('stok-menipis')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'stok-menipis'
                ? 'bg-white text-[#008952] shadow-xs'
                : 'text-emerald-100'
            }`}
          >
            Stok Menipis ({lowStockItems.length})
          </button>
          <button
            onClick={() => setActiveTab('tambah-sparepart')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'tambah-sparepart'
                ? 'bg-white text-[#008952] shadow-xs'
                : 'text-emerald-100'
            }`}
          >
            Input Baru
          </button>
        </div>
      </div>

      {/* Katalog Tab */}
      {activeTab === 'katalog-sparepart' && (
        <div className="flex-1 flex flex-col">
          {/* Search & Category Filter */}
          <div className="px-4 py-3 bg-white border-b border-slate-100 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama part, kode atau merk..."
                className="w-full bg-slate-100 text-xs text-slate-800 rounded-xl pl-9 pr-3 py-2.5 focus:outline-hidden"
              />
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#008952] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Parts List */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {filteredParts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 hover:border-emerald-200 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {item.code}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{item.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {item.brand} • <span className="text-emerald-700 font-semibold">{item.category}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Harga Jual</span>
                    <span className="text-sm font-extrabold text-[#008952]">
                      Rp {item.sellPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">
                      Lokasi: <span className="font-bold text-slate-700">{item.rackLocation}</span>
                    </span>
                  </div>

                  {/* Stock adjuster */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">Stok:</span>
                    <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg">
                      <button
                        onClick={() => onUpdateStock(item.id, Math.max(0, item.stock - 1))}
                        className="w-5 h-5 bg-white text-slate-700 font-bold rounded flex items-center justify-center hover:bg-rose-50"
                      >
                        -
                      </button>
                      <span
                        className={`font-black text-xs px-1 ${
                          item.stock <= item.minStock ? 'text-rose-600' : 'text-slate-900'
                        }`}
                      >
                        {item.stock} {item.unit}
                      </span>
                      <button
                        onClick={() => onUpdateStock(item.id, item.stock + 1)}
                        className="w-5 h-5 bg-white text-slate-700 font-bold rounded flex items-center justify-center hover:bg-emerald-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stok Menipis Tab */}
      {activeTab === 'stok-menipis' && (
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-amber-900">Perhatian: Suku Cadang Kritis</h3>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Ada {lowStockItems.length} produk di bawah batas minimum stok. Segera pesan ke distributor.
              </p>
            </div>
          </div>

          {lowStockItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-xs border border-rose-200 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700">
                    Sisa {item.stock} {item.unit} (Min: {item.minStock})
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{item.name}</h4>
                  <p className="text-xs text-slate-500">{item.brand} • {item.rackLocation}</p>
                </div>
                <button
                  onClick={() => onUpdateStock(item.id, item.stock + 12)}
                  className="bg-[#008952] hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs"
                >
                  + Restock 12 {item.unit}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tambah Sparepart Baru Tab */}
      {activeTab === 'tambah-sparepart' && (
        <div className="flex-1 p-4 overflow-y-auto">
          <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Input Suku Cadang Masuk Baru</h3>

            {successMsg && (
              <div className="p-3 bg-emerald-50 text-[#008952] text-xs font-bold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Barang / Part</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Contoh: AHM Oil MPX2 0.8L"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Kategori</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                >
                  {categories.filter(c => c !== 'Semua').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Merk / Brand</label>
                <input
                  type="text"
                  value={formBrand}
                  onChange={(e) => setFormBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Harga Beli (Modal)</label>
                <input
                  type="number"
                  value={formBuyPrice}
                  onChange={(e) => setFormBuyPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Harga Jual</label>
                <input
                  type="number"
                  value={formSellPrice}
                  onChange={(e) => setFormSellPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Stok Awal</label>
                <input
                  type="number"
                  value={formStock}
                  onChange={(e) => setFormStock(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Min. Stok</label>
                <input
                  type="number"
                  value={formMinStock}
                  onChange={(e) => setFormMinStock(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Satuan</label>
                <input
                  type="text"
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Lokasi Rak / Lemari</label>
              <input
                type="text"
                value={formRack}
                onChange={(e) => setFormRack(e.target.value)}
                placeholder="Contoh: Rak A-2"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#008952] hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md text-xs active:scale-98 transition-all"
            >
              Simpan Sparepart ke Database
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
