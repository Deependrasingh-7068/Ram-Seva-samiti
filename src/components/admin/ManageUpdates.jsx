import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { BellRing, Plus, Trash2, Edit3, X, Calendar, UserCheck, Search } from 'lucide-react';

const CATEGORIES = ['ANNOUNCEMENT', 'SEVA', 'EDUCATION', 'EVENT', 'NOTICE'];

function formatDescription(desc) {
  if (!desc || typeof desc !== 'string') return '';
  const trimmed = desc.trim().replace(/^["“']+|["”']+$/g, '');
  return `“${trimmed}”`;
}

function formatDate(iso) {
  if (!iso) return '';
  const parsed = new Date(iso);
  if (isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ManageUpdates() {
  const { updates = [], addUpdate, deleteUpdate, updateUpdate, currentAdmin } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic logged-in admin name attribution
  const loggedAdminName =
    currentAdmin?.name ||
    currentAdmin?.username ||
    (currentAdmin?.email ? currentAdmin.email.split('@')[0] : 'Admin');

  const [formData, setFormData] = useState({
    title: '',
    category: 'ANNOUNCEMENT',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    content: ''
  });

  const isSuperAdmin = currentAdmin?.role === 'SUPERADMIN' || currentAdmin?.isSuperAdmin;
  const myUpdates = isSuperAdmin
    ? updates
    : updates.filter((u) => u.createdBy === currentAdmin?.email);

  const filteredUpdates = myUpdates.filter((item) => {
    const text = `${item.title || ''} ${item.category || ''} ${item.excerpt || ''} ${item.content || ''}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'ANNOUNCEMENT',
      date: new Date().toISOString().split('T')[0],
      excerpt: '',
      content: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id || item.id);
    setFormData({
      title: item.title || '',
      category: item.category || 'ANNOUNCEMENT',
      date: item.date ? String(item.date).split('T')[0] : new Date().toISOString().split('T')[0],
      excerpt: item.excerpt || '',
      content: item.content || item.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const payload = {
      ...formData,
      slug:
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `notice-${Date.now()}`,
      adminName: loggedAdminName,
      createdBy: currentAdmin?.email || 'admin@samiti.com'
    };

    if (editingId) {
      if (updateUpdate) await updateUpdate(editingId, payload);
    } else {
      if (addUpdate) await addUpdate(payload);
    }

    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('क्या आप वाकई इस सूचना को हटाना चाहते हैं?')) {
      if (deleteUpdate) await deleteUpdate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-navy-2/60 border border-gold/15 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-saffron/15 rounded-xl text-saffron border border-gold/20">
            <BellRing size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-cream">Notices & Updates Management</h2>
            <p className="text-xs text-cream/60">
              Publish circulars, announcements, and important updates for users.
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-saffron hover:bg-gold text-navy font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-saffron/20 cursor-pointer shrink-0"
        >
          <Plus size={16} /> Publish New Notice
        </button>
      </div>

      {/* Filter / Search Bar */}
      {myUpdates.length > 0 && (
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notices..."
            className="w-full bg-navy-2 border border-gold/20 rounded-xl pl-9 pr-4 py-2 text-xs text-cream placeholder-cream/30 focus:outline-none focus:border-gold"
          />
        </div>
      )}

      {/* Notices Grid */}
      {filteredUpdates.length === 0 ? (
        <div className="py-20 text-center bg-navy-2/30 rounded-2xl border border-gold/10">
          <BellRing size={40} className="mx-auto text-gold/30 mb-3" />
          <p className="text-cream/50 text-sm">
            {searchQuery ? 'No notices matched your search.' : 'No notices published by your account.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUpdates.map((item) => {
            const itemId = item._id || item.id;
            const author =
              item.adminName || (item.createdBy ? item.createdBy.split('@')[0] : 'Admin');
            const displayDesc = item.excerpt || item.content || item.description;

            return (
              <div
                key={itemId}
                className="group bg-navy-2 border border-gold/15 rounded-2xl p-5 flex flex-col justify-between hover:border-gold/40 hover:-translate-y-0.5 transition-all shadow-lg h-[260px] relative overflow-hidden"
              >
                {/* Content */}
                <div className="flex flex-col min-h-0">
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap shrink-0">
                    <span className="text-[10px] font-bold text-saffron bg-saffron/10 px-2.5 py-0.5 rounded border border-gold/20 uppercase tracking-wider">
                      {item.category || 'NOTICE'}
                    </span>
                    <span className="text-[11px] text-cream/50 flex items-center gap-1">
                      <Calendar size={12} className="text-saffron shrink-0" />
                      {formatDate(item.date)}
                    </span>
                  </div>

                  <h3 className="font-hindi text-base font-bold text-cream leading-snug truncate shrink-0 mb-1.5">
                    {item.title}
                  </h3>

                  {/* Scrollable Description with Curly Double Quotes */}
                  {displayDesc && (
                    <div className="relative w-full h-16 shrink-0 mt-1">
                      <div className="h-full overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <p className="font-hindi text-xs text-cream/70 leading-relaxed italic break-words">
                          {formatDescription(displayDesc)}
                        </p>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-navy-2 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-300" />
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-gold/10 flex items-center justify-between shrink-0">
                  <span className="text-[10px] text-gold flex items-center gap-1.5 bg-saffron/10 px-2.5 py-0.5 rounded-md border border-gold/20 font-medium">
                    <UserCheck size={11} className="text-saffron shrink-0" /> By: {author}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-cream/60 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors cursor-pointer"
                      title="Edit Notice"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(itemId)}
                      className="p-1.5 text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Notice"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Publish / Edit Notice */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
          <div className="bg-navy-2 border border-gold/20 rounded-3xl w-full max-w-xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gold/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-cream">
                  {editingId ? 'Edit Notice' : 'Publish New Notice'}
                </h3>
                <p className="text-xs text-gold/80 mt-0.5 flex items-center gap-1">
                  <UserCheck size={12} className="text-saffron" /> Publishing as: {loggedAdminName}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-cream/50 hover:text-cream transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Notice Title */}
              <div>
                <label className="block text-xs font-semibold text-cream/70 uppercase tracking-wider mb-1.5">
                  Notice Title (शीर्षक) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="उदा. राम नवमी महोत्सव हेतु पंजीकरण प्रारंभ"
                  className="w-full bg-navy border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-cream/70 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-navy border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-navy text-cream">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cream/70 uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-navy border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Short Excerpt */}
              <div>
                <label className="block text-xs font-semibold text-cream/70 uppercase tracking-wider mb-1.5">
                  Short Excerpt (संक्षिप्त विवरण)
                </label>
                <input
                  type="text"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="कार्ड पर दिखने वाला 1-2 लाइन का संक्षिप्त विवरण"
                  className="w-full bg-navy border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-semibold text-cream/70 uppercase tracking-wider mb-1.5">
                  Full Content / Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="पूरा विवरण यहाँ लिखें..."
                  className="w-full bg-navy border border-gold/20 rounded-xl p-4 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold resize-none leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gold/20 text-xs font-semibold uppercase tracking-wider text-cream/70 hover:text-cream transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-saffron hover:bg-gold text-navy font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-saffron/20 cursor-pointer"
                >
                  {editingId ? 'Save Changes' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}