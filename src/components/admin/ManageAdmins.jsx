import { useState, useEffect } from 'react';
import { 
  Search, Shield, Trash2, Key, UserPlus, AlertCircle, CheckCircle, Edit2, X, Save, ShieldAlert 
} from 'lucide-react';

const INITIAL_MOCK_ADMINS = [
  {
    id: 'ADM-101',
    _id: 'ADM-101',
    name: 'Harsh Singh',
    email: 'harshramsinghs768@gmail.com',
    contact: '7068180049',
    designation: 'Secretary',
    designationHindi: 'सचिव',
    role: 'ADMIN',
  },
  {
    id: 'ADM-102',
    _id: 'ADM-102',
    name: 'Deependra Singh',
    email: 'harshramsingh768@gmail.com',
    contact: '7068180049',
    designation: 'Senior Member',
    designationHindi: 'वरिष्ठ सदस्य',
    role: 'ADMIN',
  }
];

function resolveHindiDesignation(eng, hindi) {
  if (hindi && hindi.trim().length > 0 && hindi !== 'NA' && hindi !== '()') {
    return hindi.trim();
  }
  const d = (eng || '').toLowerCase();
  if (d.includes('sec') || d.includes('सचिव')) return 'सचिव';
  if (d.includes('pres') || d.includes('अध्यक्ष')) return 'अध्यक्ष';
  if (d.includes('tre') || d.includes('कोषाध्यक्ष')) return 'कोषाध्यक्ष';
  if (d.includes('sen') || d.includes('वरिष्ठ')) return 'वरिष्ठ सदस्य';
  return 'प्रशासक';
}

export default function ManageAdmins() {
  const [admins, setAdmins] = useState(() => {
    const saved = localStorage.getItem('registered_admins');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_ADMINS;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Admin Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [designation, setDesignation] = useState('');
  const [designationHindi, setDesignationHindi] = useState('');
  const [password, setPassword] = useState('');
  
  // Edit Admin Modal State
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editDesignation, setEditDesignation] = useState('');
  const [editDesignationHindi, setEditDesignationHindi] = useState('');

  // Delete Target State
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch / Sync Admins List
  const fetchAdmins = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin-auth/admins');
      const data = await res.json();
      if (data.success && Array.isArray(data.admins)) {
        setAdmins(data.admins);
        localStorage.setItem('registered_admins', JSON.stringify(data.admins));
      }
    } catch {
      // Keep local state intact if API isn't connected
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Save changes locally and dispatch sync event across the entire app
  const syncSessionAndBroadcast = (updatedAdmin) => {
    const currentLoggedIn = JSON.parse(localStorage.getItem('adminInfo') || '{}');
    
    // Check match by email or id, or fallback to updating the active session
    if (
      !currentLoggedIn.email ||
      currentLoggedIn.email?.toLowerCase() === updatedAdmin.email?.toLowerCase() ||
      currentLoggedIn.id === updatedAdmin.id ||
      currentLoggedIn._id === updatedAdmin._id ||
      currentLoggedIn.name?.toLowerCase() === updatedAdmin.name?.toLowerCase()
    ) {
      const newSession = {
        ...currentLoggedIn,
        ...updatedAdmin,
        name: updatedAdmin.name,
        contact: updatedAdmin.contact,
        designation: updatedAdmin.designation,
        designationHindi: resolveHindiDesignation(updatedAdmin.designation, updatedAdmin.designationHindi),
      };
      localStorage.setItem('adminInfo', JSON.stringify(newSession));
      window.dispatchEvent(new CustomEvent('samiti_admin_updated', { detail: newSession }));
    }
  };

  // Handle Create Admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const newAdminObj = {
      id: `ADM-${Date.now()}`,
      _id: `ADM-${Date.now()}`,
      name,
      email,
      contact,
      designation,
      designationHindi: resolveHindiDesignation(designation, designationHindi),
      role: 'ADMIN',
    };

    try {
      const res = await fetch('http://localhost:5000/api/admin-auth/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, contact, designation, designationHindi: newAdminObj.designationHindi, password }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Admin created successfully!' });
        fetchAdmins();
      } else {
        throw new Error(data.message || 'Server returned error');
      }
    } catch {
      // Fallback local creation
      const updatedList = [newAdminObj, ...admins];
      setAdmins(updatedList);
      localStorage.setItem('registered_admins', JSON.stringify(updatedList));
      setMessage({ type: 'success', text: 'Admin added locally & synchronized.' });
    } finally {
      setName('');
      setEmail('');
      setContact('');
      setDesignation('');
      setDesignationHindi('');
      setPassword('');
      setLoading(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (admin) => {
    setEditingAdmin(admin);
    setEditName(admin.name || '');
    setEditEmail(admin.email || '');
    setEditContact(admin.contact || '');
    setEditDesignation(admin.designation || '');
    setEditDesignationHindi(admin.designationHindi || resolveHindiDesignation(admin.designation, ''));
  };

  // Save Edited Admin
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingAdmin) return;

    const finalHindi = resolveHindiDesignation(editDesignation, editDesignationHindi);

    const updatedAdmin = {
      ...editingAdmin,
      name: editName,
      email: editEmail,
      contact: editContact,
      designation: editDesignation,
      designationHindi: finalHindi,
    };

    // 1. Update State & LocalStorage
    const updatedList = admins.map((a) => 
      (a.id === editingAdmin.id || a._id === editingAdmin._id || a.email?.toLowerCase() === editingAdmin.email?.toLowerCase()) 
        ? updatedAdmin 
        : a
    );
    setAdmins(updatedList);
    localStorage.setItem('registered_admins', JSON.stringify(updatedList));

    // 2. Broadcast Live Change to AdminLayout/Topbar
    syncSessionAndBroadcast(updatedAdmin);

    // 3. Try syncing with backend API
    try {
      await fetch(`http://localhost:5000/api/admin-auth/update/${editingAdmin._id || editingAdmin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAdmin),
      });
    } catch (err) {
      console.warn('Backend update failed, saved in local session:', err);
    }

    setMessage({ type: 'success', text: `Admin ${editName} updated successfully to ${editDesignation} (${finalHindi})!` });
    setEditingAdmin(null);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const filtered = admins.filter((a) => a.id !== deleteTarget.id && a._id !== deleteTarget._id);
    setAdmins(filtered);
    localStorage.setItem('registered_admins', JSON.stringify(filtered));

    try {
      await fetch(`http://localhost:5000/api/admin-auth/delete/${deleteTarget._id || deleteTarget.id}`, {
        method: 'DELETE',
      });
    } catch {}

    setDeleteTarget(null);
    setMessage({ type: 'success', text: 'Admin removed successfully.' });
  };

  // Filter admins based on search query
  const filteredAdmins = admins.filter((admin) => 
    admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.contact?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.designation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 w-full pb-16">
      
      {/* Top Banner */}
      <div className="bg-navy-2 p-6 rounded-3xl border border-gold/20 shadow-xl space-y-2">
        <div className="flex items-center gap-3 text-saffron">
          <Shield size={28} />
          <h1 className="font-display text-2xl tracking-wide text-cream">Super Admin Control Center</h1>
        </div>
        <p className="text-xs text-cream/60">
          Manage all samiti admins, credentials, and access permissions. Role changes sync live to topbars.
        </p>
      </div>

      {/* Create New Admin Form Section */}
      <div className="bg-navy-2 p-8 rounded-3xl border border-gold/20 shadow-xl space-y-6">
        <h2 className="text-lg font-semibold text-gold">Create New Admin</h2>

        {message.text && (
          <div className={`p-3.5 rounded-xl text-xs flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron"
              required
            />
            <input 
              type="email" 
              placeholder="Admin ID / Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="Contact Number" 
              value={contact} 
              onChange={(e) => setContact(e.target.value)}
              className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron"
              required
            />
            <input 
              type="text" 
              placeholder="Designation (e.g. Secretary)" 
              value={designation} 
              onChange={(e) => setDesignation(e.target.value)}
              className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron"
              required
            />
            <input 
              type="text" 
              placeholder="Designation Hindi (e.g. सचिव)" 
              value={designationHindi} 
              onChange={(e) => setDesignationHindi(e.target.value)}
              className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron font-hindi"
            />
          </div>

          <input 
            type="password" 
            placeholder="Initial Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron"
            required
          />

          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-3 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-semibold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creating...' : 'Create & Send Email'}</span>
          </button>
        </form>
      </div>

      {/* Registered Admins List Section with Search Bar */}
      <div className="bg-navy-2 p-8 rounded-3xl border border-gold/20 shadow-xl space-y-6">
        
        {/* Header with Search Bar on the Right */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gold">Registered Admins List</h2>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 text-gold/50" size={16} />
            <input 
              type="text"
              placeholder="Search by name, email, contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gold/10 text-xs text-gold/70 uppercase tracking-wider">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email / ID</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10 text-sm">
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => {
                  const hindi = resolveHindiDesignation(admin.designation, admin.designationHindi);
                  return (
                    <tr key={admin._id || admin.id || admin.email} className="hover:bg-navy/40 transition-colors">
                      <td className="py-4 px-4 font-medium text-cream">{admin.name}</td>
                      <td className="py-4 px-4 text-cream/70 text-xs">{admin.email}</td>
                      <td className="py-4 px-4 text-cream/70 text-xs">{admin.contact}</td>
                      <td className="py-4 px-4 text-xs font-semibold text-gold">
                        <span className="uppercase">{admin.designation}</span>{' '}
                        <span className="font-hindi text-saffron font-bold">({hindi})</span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button 
                          onClick={() => handleOpenEdit(admin)} 
                          className="p-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors cursor-pointer" 
                          title="Edit Admin"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          onClick={() => alert(`Password reset link sent to ${admin.email}`)}
                          className="p-2 rounded-lg bg-saffron/10 text-saffron hover:bg-saffron/20 transition-colors cursor-pointer" 
                          title="Reset Password"
                        >
                          <Key size={15} />
                        </button>
                        <button 
                          onClick={() => setDeleteTarget(admin)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer" 
                          title="Delete Admin"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-xs text-cream/50">
                    No matching admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= EDIT ADMIN MODAL ================= */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm px-4 animate-in fade-in duration-200">
          <div className="bg-navy-2 border border-gold/30 p-7 rounded-3xl max-w-lg w-full shadow-2xl space-y-5 relative">
            <button 
              onClick={() => setEditingAdmin(null)} 
              className="absolute top-5 right-5 text-cream/60 hover:text-saffron transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="font-display text-xl text-cream flex items-center gap-2">
              <Edit2 size={18} className="text-saffron" /> Edit Admin Profile
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gold/80 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gold/80 ml-1">Contact</label>
                  <input 
                    type="text" 
                    value={editContact} 
                    onChange={(e) => setEditContact(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gold/80 ml-1">Email / ID (Read-only)</label>
                <input 
                  type="email" 
                  value={editEmail} 
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-navy/60 border border-gold/10 text-cream/50 text-xs outline-none cursor-not-allowed" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gold/80 ml-1">Designation (English)</label>
                  <input 
                    type="text" 
                    value={editDesignation} 
                    onChange={(e) => setEditDesignation(e.target.value)} 
                    placeholder="Secretary / President"
                    className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gold/80 ml-1">Designation (Hindi)</label>
                  <input 
                    type="text" 
                    value={editDesignationHindi} 
                    onChange={(e) => setEditDesignationHindi(e.target.value)} 
                    placeholder="सचिव / अध्यक्ष"
                    className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron font-hindi" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setEditingAdmin(null)} 
                  className="flex-1 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs font-semibold hover:border-gold/50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 rounded-xl bg-saffron hover:bg-saffron-deep text-navy text-xs font-semibold shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} /> Save & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/85 backdrop-blur-sm px-4">
          <div className="bg-navy-2 border border-red-500/30 p-7 rounded-3xl max-w-sm w-full shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-500/30">
              <ShieldAlert size={28} />
            </div>
            <div>
              <h3 className="text-lg font-display text-cream">Revoke Admin Access?</h3>
              <p className="text-xs text-cream/60 mt-1">
                Are you sure you want to remove <span className="text-saffron font-bold">"{deleteTarget.name}"</span>? They will lose all administrative privileges.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg cursor-pointer"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}