import { useState, useEffect } from 'react';
import { UserPlus, Shield, Trash2, KeyRound, Loader2, Search, Edit3, X, Save, Users, HeartHandshake, Image as ImageIcon, Eye, EyeOff, Lock, Unlock, ToggleLeft, ToggleRight } from 'lucide-react';

// Helper: Empty string ko 'NA' format mein normalize karega
function sanitizeValue(val) {
  if (!val || val.trim().length === 0) return 'NA';
  return val.trim();
}

// Helper to mask ID showing only last 6 digits
const formatMaskedId = (idStr) => {
  if (!idStr || idStr === 'NA') return 'NA';
  const cleanStr = String(idStr).trim();
  if (cleanStr.length <= 6) return cleanStr;
  const lastSix = cleanStr.slice(-6);
  return `******${lastSix}`;
};

export default function SuperAdminPanel() {
  const [activeTab, setActiveTab] = useState('admins');
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerSearch, setVolunteerSearch] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);

  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [editVolNameHindi, setEditVolNameHindi] = useState('');
  const [editVolNameEnglish, setEditVolNameEnglish] = useState('');
  const [editVolPhone, setEditVolPhone] = useState('');
  const [editVolEmail, setEditVolEmail] = useState('');
  const [editVolAddress, setEditVolAddress] = useState('');

  // Create Admin States (Designation locked to Administrator / प्रशासक)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [dob, setDob] = useState('');
  const [adminPhoto, setAdminPhoto] = useState('');
  const [uploading, setUploading] = useState(false);

  // Edit Admin States
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editAadhaar, setEditAadhaar] = useState('');
  const [editAdminPhoto, setEditAdminPhoto] = useState('');
  const [editUploading, setEditUploading] = useState(false);
  const [revealAadhaar, setRevealAadhaar] = useState(false);
  const [verifyDobInput, setVerifyDobInput] = useState('');

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/list`);
      const data = await res.json();
      if (data.success) setAdmins(data.admins);
    } catch (err) { console.error(err); }
  };

  const fetchVolunteers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/volunteers/all`);
      const data = await res.json();
      if (data.success) setVolunteers(data.volunteers);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchAdmins();
    fetchVolunteers();
  }, []);

  const handleImageUpload = async (e, setImageCallback, setLoadingCallback) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ShreeRamSewaSamiti-Images');
    
    if (setLoadingCallback) setLoadingCallback(true);
    else setUploading(true);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dp2fkeyok/image/upload`, { method: 'POST', body: formData });
      const data = await response.json();
      if (data.secure_url) setImageCallback(data.secure_url);
    } catch (error) { 
      alert('Upload failed'); 
    } finally { 
      if (setLoadingCallback) setLoadingCallback(false);
      else setUploading(false); 
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const prefix = (name ? name.replace(/[^a-zA-Z]/g, '').slice(0, 3) : 'SRSS').toUpperCase();
    const generatedAdminId = `SRSS${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = {
      adminId: generatedAdminId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      contact: sanitizeValue(contact),
      aadhaar: sanitizeValue(aadhaar),
      dob: sanitizeValue(dob),
      designation: 'Administrator',
      designationHindi: 'प्रशासक',
      photo: adminPhoto || ''
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/create-admin`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        alert(`Admin created successfully with ID: ${generatedAdminId}`);
        fetchAdmins();
        setName(''); setEmail(''); setPassword(''); setContact(''); setAadhaar(''); setDob(''); setAdminPhoto('');
      } else {
        alert(data.message || 'Failed to create admin');
      }
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this admin?')) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/delete-admin/${id}`, { method: 'DELETE' });
        fetchAdmins();
      } catch (err) { console.error(err); }
    }
  };

  // Toggle Admin Freeze / Unfreeze Status
  const handleToggleFreeze = async (adm) => {
    const targetId = adm._id || adm.id;
    const newFreezeState = !adm.isFrozen;
    const actionText = newFreezeState ? 'freeze (block)' : 'unfreeze';
    
    if (window.confirm(`Are you sure you want to ${actionText} admin ${adm.name}?`)) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/toggle-freeze/${targetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isFrozen: newFreezeState })
        });
        const data = await res.json();
        if (data.success) {
          fetchAdmins();
        } else {
          alert(data.message || 'Failed to update freeze status');
        }
      } catch (err) {
        console.error(err);
        alert('Error updating freeze status');
      }
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = prompt('Enter new password for this admin:');
    if (newPassword) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/reset-password/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword }),
        });
        alert('Password reset successfully!');
      } catch (err) { console.error(err); }
    }
  };

  const openEditModal = (adm) => {
    setEditingAdmin(adm);
    setEditName(adm.name || '');
    setEditEmail(adm.email || '');
    setEditContact(adm.contact === 'NA' ? '' : (adm.contact || ''));
    setEditAadhaar(adm.aadhaar || '');
    setEditAdminPhoto(adm.photo || '');
    setRevealAadhaar(false);
    setVerifyDobInput('');
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    if (!editingAdmin) return;
    const targetId = editingAdmin._id || editingAdmin.id;
    const payload = {
      name: editName.trim(),
      email: editEmail.trim().toLowerCase(),
      contact: sanitizeValue(editContact),
      designation: 'Administrator',
      designationHindi: 'प्रशासक',
      photo: editAdminPhoto || ''
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/update-admin/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert('Admin details updated successfully!');
        
        const currentLocalAdmin = JSON.parse(localStorage.getItem('adminInfo') || '{}');
        if (currentLocalAdmin._id === targetId || currentLocalAdmin.id === targetId || currentLocalAdmin.email === payload.email) {
          const updatedInfo = { ...currentLocalAdmin, ...data.admin };
          localStorage.setItem('adminInfo', JSON.stringify(updatedInfo));
          window.dispatchEvent(new CustomEvent('samiti_admin_updated', { detail: updatedInfo }));
        }

        setEditingAdmin(null);
        fetchAdmins();
      } else {
        alert(data.message || 'Failed to update admin');
      }
    } catch (err) { 
      console.error(err); 
    }
  };

  const openEditVolunteerModal = (vol) => {
    setEditingVolunteer(vol);
    setEditVolNameHindi(vol.nameHindi || '');
    setEditVolNameEnglish(vol.nameEnglish || '');
    setEditVolPhone(vol.phone || '');
    setEditVolEmail(vol.email || '');
    setEditVolAddress(vol.address || '');
  };

  const handleUpdateVolunteer = async (e) => {
    e.preventDefault();
    if (!editingVolunteer) return;
    const payload = {
      volunteerId: editingVolunteer.volunteerId,
      aadhaarNumber: editingVolunteer.aadhaarNumber,
      nameHindi: editVolNameHindi.trim(),
      nameEnglish: editVolNameEnglish.trim(),
      phone: editVolPhone.trim(),
      email: editVolEmail.trim(),
      address: editVolAddress.trim(),
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/volunteers/update-profile-secure`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert('Volunteer details updated successfully!');
        setEditingVolunteer(null);
        fetchVolunteers();
      } else {
        alert(data.message || 'Failed to update');
      }
    } catch (err) { 
      console.error(err); 
      alert('Error updating volunteer details');
    }
  };

  const filteredVolunteers = volunteers.filter((vol) => {
    const q = volunteerSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      (vol.nameHindi && vol.nameHindi.toLowerCase().includes(q)) ||
      (vol.nameEnglish && vol.nameEnglish.toLowerCase().includes(q)) ||
      (vol.volunteerId && vol.volunteerId.toLowerCase().includes(q)) ||
      (vol.phone && vol.phone.includes(q))
    );
  });

  const sortedAdmins = [...admins].sort((a, b) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return 0;
    const aMatch = (a.name && a.name.toLowerCase().includes(q)) || (a.email && a.email.toLowerCase().includes(q));
    const bMatch = (b.name && b.name.toLowerCase().includes(q)) || (b.email && b.email.toLowerCase().includes(q));
    if (aMatch && !bMatch) return -1; 
    if (!aMatch && bMatch) return 1;  
    return 0;
  });

  return (
    <div className="min-h-screen bg-navy pt-28 pb-20 px-6 max-w-[95rem] mx-auto text-cream">
      <div className="bg-navy-2 p-6 rounded-2xl border border-gold/10 mb-8">
        <h1 className="font-display text-3xl text-saffron flex items-center gap-2">
          <Shield size={28} /> Super Admin Control Center
        </h1>
        <p className="text-sm text-cream/60 mt-1">Manage all samiti admins, credentials, volunteers and donations in Database.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2 bg-navy-2 p-4 rounded-2xl border border-gold/15 h-fit">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gold/70 px-3 pb-2">Control Modules</h3>
          <button onClick={() => setActiveTab('admins')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${activeTab === 'admins' ? 'bg-saffron text-navy font-bold' : 'text-cream/80 hover:bg-navy hover:text-saffron'}`}>
            <Shield size={16} /> Admin Management
          </button>
          <button onClick={() => setActiveTab('volunteers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${activeTab === 'volunteers' ? 'bg-saffron text-navy font-bold' : 'text-cream/80 hover:bg-navy hover:text-saffron'}`}>
            <Users size={16} /> Volunteer Management
          </button>
          <button onClick={() => setActiveTab('donations')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${activeTab === 'donations' ? 'bg-saffron text-navy font-bold' : 'text-cream/80 hover:bg-navy hover:text-saffron'}`}>
            <HeartHandshake size={16} /> Donation Management
          </button>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'admins' && (
            <div className="space-y-6">
              {/* Create New Admin Form */}
              <form onSubmit={handleCreateAdmin} className="bg-navy-2 p-8 rounded-2xl border border-gold/20 space-y-4 shadow-xl">
                <h3 className="text-xl font-semibold text-gold">Create New Admin</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron" required />
                  <input type="email" placeholder="Admin ID / Email" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="text" placeholder="Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron" required />
                  <input type="text" placeholder="Aadhaar Number" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron font-mono" required />
                  
                  <div className="relative">
                    <input 
                      type="date" 
                      value={dob} 
                      onChange={(e) => setDob(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron cursor-pointer [color-scheme:dark]" 
                      required 
                      title="Date of Birth"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="relative">
                    <input type="text" value="Administrator" disabled className="w-full px-4 py-3 rounded-xl bg-navy/60 border border-gold/20 text-cream/70 text-sm outline-none cursor-not-allowed font-medium" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-saffron">🔒 Locked</span>
                  </div>
                  <div className="relative">
                    <input type="text" value="प्रशासक" disabled className="w-full px-4 py-3 rounded-xl bg-navy/60 border border-gold/20 text-cream/70 text-sm outline-none cursor-not-allowed font-hindi font-medium" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-saffron">🔒 Locked</span>
                  </div>
                  
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Initial Password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron" 
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream/60 hover:text-saffron transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setAdminPhoto)} className="w-full text-xs text-cream/70 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-saffron file:text-navy cursor-pointer bg-navy border border-gold/20 rounded-xl" />
                  {adminPhoto && (
                    <button type="button" onClick={() => setAdminPhoto('')} className="px-3 py-2 rounded-xl bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors cursor-pointer shrink-0">
                      Remove
                    </button>
                  )}
                </div>

                {uploading && <p className="text-xs text-saffron flex items-center gap-1"><Loader2 size={14} className="animate-spin" /> Uploading image...</p>}
                {adminPhoto && (
                  <div className="flex items-center gap-3 pt-1">
                    <img src={adminPhoto} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-saffron" />
                    <span className="text-xs text-saffron">Photo attached</span>
                  </div>
                )}

                <button type="submit" disabled={loading} className="px-8 py-3 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-semibold text-sm cursor-pointer shadow-lg">
                  {loading && <Loader2 className="animate-spin inline mr-2" size={16} />} Create & Save to Database
                </button>
              </form>

              {/* Registered Admins Table with Freeze Action Toggle */}
              <div className="bg-navy-2 p-6 rounded-2xl border border-gold/10 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-cream">Registered Admins in Database</h3>
                  <input type="text" placeholder="Search by name, email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-72 px-4 py-2 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[850px]">
                    <thead>
                      <tr className="border-b border-gold/20 text-saffron text-sm">
                        <th className="py-3 px-4">Profile</th>
                        <th className="py-3 px-4">Admin ID</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email / ID</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Aadhaar (6 Digits)</th>
                        <th className="py-3 px-4">Designation</th>
                        <th className="py-3 px-4 text-center">Action (Freeze Toggle)</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gold/10 text-cream/80">
                      {sortedAdmins.length > 0 ? (
                        sortedAdmins.map((adm) => {
                          const adminId = adm._id || adm.id;
                          const displayEng = 'Administrator';
                          const displayHindi = 'प्रशासक';
                          const maskedAdminAadhaar = formatMaskedId(adm.aadhaar);
                          const isFrozen = adm.isFrozen;

                          return (
                            <tr key={adminId} className={`hover:bg-navy/40 transition-colors ${isFrozen ? 'bg-red-950/20' : ''}`}>
                              <td className="py-3.5 px-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-navy border border-gold/30 relative">
                                  {adm.photo ? <img src={adm.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-saffron text-xs">👤</div>}
                                  {isFrozen && <span className="absolute inset-0 bg-red-600/40 flex items-center justify-center text-[10px] text-white font-bold">FROZEN</span>}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-xs text-saffron">
                                {adm.adminId || 'NA'}
                              </td>
                              <td className="py-3.5 px-4 font-medium text-cream">{adm.name}</td>
                              <td className="py-3.5 px-4 text-xs text-cream/75">{adm.email}</td>
                              <td className="py-3.5 px-4 text-xs">{adm.contact || 'NA'}</td>
                              <td className="py-3.5 px-4 font-mono text-xs text-gold font-semibold">
                                {maskedAdminAadhaar}
                              </td>
                              <td className="py-3.5 px-4 text-gold font-semibold text-xs uppercase">
                                {displayEng} <span className="font-hindi text-saffron ml-1">({displayHindi})</span>
                              </td>
                              
                              {/* Freeze Toggle Action */}
                              <td className="py-3.5 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleFreeze(adm)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 mx-auto transition-all cursor-pointer ${
                                    isFrozen 
                                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500 hover:text-white' 
                                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white'
                                  }`}
                                  title={isFrozen ? "Click to Unfreeze Admin" : "Click to Freeze Admin"}
                                >
                                  {isFrozen ? <Lock size={13} /> : <Unlock size={13} />}
                                  <span>{isFrozen ? 'Frozen' : 'Active'}</span>
                                </button>
                              </td>

                              <td className="py-3.5 px-4 flex justify-center gap-2">
                                <button onClick={() => openEditModal(adm)} className="p-2 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white cursor-pointer" title="Edit"><Edit3 size={16} /></button>
                                <button onClick={() => handleResetPassword(adminId)} className="p-2 rounded bg-gold/10 text-gold hover:bg-gold hover:text-navy cursor-pointer" title="Password"><KeyRound size={16} /></button>
                                <button onClick={() => handleDelete(adminId)} className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-white cursor-pointer" title="Delete"><Trash2 size={16} /></button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr><td colSpan="9" className="py-8 text-center text-xs text-cream/50">No admins found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'volunteers' && (
            <div className="bg-navy-2 p-6 rounded-2xl border border-gold/15 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-saffron">Volunteer Management</h3>
                  <p className="text-xs text-cream/60 mt-0.5">View and edit registered volunteers (Aadhaar & VID are frozen).</p>
                </div>
                <input type="text" placeholder="Search volunteer by name, ID..." value={volunteerSearch} onChange={(e) => setVolunteerSearch(e.target.value)} className="w-full sm:w-72 px-4 py-2 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" />
              </div>

              <div className="space-y-3">
                {filteredVolunteers.length > 0 ? (
                  filteredVolunteers.map((vol) => (
                    <div key={vol._id || vol.volunteerId} className="bg-navy p-4 rounded-xl border border-gold/15 flex items-center justify-between gap-4 shadow-md">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-navy-2 border border-gold/30 shrink-0">
                          {vol.photo ? <img src={vol.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-saffron font-bold">👤</div>}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-cream font-hindi truncate">{vol.nameHindi}</h4>
                            <span className="text-[10px] font-mono text-saffron bg-saffron/10 px-2 py-0.5 rounded">{vol.volunteerId}</span>
                            {vol.approvedBy && (
                              <span className="text-[10px] text-gold/80 bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                                Approved By: {vol.approvedBy}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-cream/50 truncate mt-0.5">Phone: {vol.phone} | Address: {vol.address}</p>
                        </div>
                      </div>
                      <button onClick={() => openEditVolunteerModal(vol)} className="px-4 py-2 rounded-xl bg-blue-500/15 text-blue-400 hover:bg-blue-500 hover:text-white text-xs font-semibold cursor-pointer shrink-0">
                        Edit
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-xs text-cream/50">No volunteers found.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="bg-navy-2 p-8 rounded-2xl border border-gold/20 space-y-6 shadow-xl">
              <div>
                <h3 className="text-xl font-semibold text-saffron flex items-center gap-2">
                  <HeartHandshake size={22} /> Donation Management
                </h3>
                <p className="text-xs text-cream/70 mt-1">
                  Manage donation records, UPI handles, bank account details, and offline contributor receipts directly from this section.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-navy border border-gold/15 space-y-3">
                  <span className="text-xs font-semibold text-saffron uppercase tracking-wider">Contribution Ledger</span>
                  <p className="text-xs text-cream/60">View all online and offline donations made to the Samiti.</p>
                  <button type="button" onClick={() => alert('Contribution ledger module active.')} className="px-4 py-2 rounded-xl bg-saffron/15 text-saffron hover:bg-saffron-deep hover:text-navy font-semibold text-xs transition-all cursor-pointer">
                    View Ledger
                  </button>
                </div>

                <div className="p-5 rounded-xl bg-navy border border-gold/15 space-y-3">
                  <span className="text-xs font-semibold text-saffron uppercase tracking-wider">Bank & UPI Settings</span>
                  <p className="text-xs text-cream/60">Configure QR codes, UPI IDs, and bank account credentials for donors.</p>
                  <button type="button" onClick={() => alert('Bank settings configuration active.')} className="px-4 py-2 rounded-xl bg-navy border border-gold/20 text-cream text-xs font-semibold hover:border-gold/50 transition-all cursor-pointer">
                    Configure Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EDIT ADMIN MODAL */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm px-4">
          <div className="relative bg-navy-2 border border-gold/25 p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-6">
            <button onClick={() => setEditingAdmin(null)} className="absolute top-5 right-5 text-cream/60 hover:text-saffron"><X size={22} /></button>
            <h3 className="text-2xl text-cream font-display">Edit Admin Details</h3>
            <form onSubmit={handleUpdateAdmin} className="space-y-4">
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none" required />
              <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none" required />
              
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={editContact} onChange={(e) => setEditContact(e.target.value)} placeholder="Contact" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none" />
                
                <div className="relative flex items-center bg-navy border border-gold/20 rounded-xl px-3 py-2">
                  <input 
                    type="text" 
                    value={revealAadhaar ? editAadhaar : formatMaskedId(editAadhaar)} 
                    readOnly 
                    placeholder="Aadhaar" 
                    className="w-full bg-transparent text-cream text-xs outline-none font-mono cursor-default" 
                  />
                  {!revealAadhaar ? (
                    <button 
                      type="button" 
                      onClick={() => {
                        const dobCheck = prompt('Enter Admin Date of Birth (YYYY-MM-DD) to reveal full Aadhaar:');
                        if (dobCheck) {
                          setVerifyDobInput(dobCheck);
                          const targetId = editingAdmin._id || editingAdmin.id;
                          fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/verify-dob/${targetId}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ dob: dobCheck })
                          })
                          .then(res => res.json())
                          .then(data => {
                            if (data.success) {
                              setEditAadhaar(data.aadhaar);
                              setRevealAadhaar(true);
                            } else {
                              alert(data.message || 'Incorrect Date of Birth!');
                            }
                          })
                          .catch(() => alert('Verification failed.'));
                        }
                      }}
                      className="text-saffron hover:text-gold shrink-0 cursor-pointer p-1"
                      title="Reveal Full Aadhaar"
                    >
                      <Lock size={15} />
                    </button>
                  ) : (
                    <span className="text-emerald-400 shrink-0 p-1" title="Revealed">
                      <Unlock size={15} />
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input type="text" value="Administrator" disabled className="w-full px-4 py-2.5 rounded-xl bg-navy/60 border border-gold/20 text-cream/70 text-xs outline-none cursor-not-allowed font-medium" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-saffron">🔒 Locked</span>
                </div>
                <div className="relative">
                  <input type="text" value="प्रशासक" disabled className="w-full px-4 py-2.5 rounded-xl bg-navy/60 border border-gold/20 text-cream/70 text-xs outline-none cursor-not-allowed font-hindi font-medium" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-saffron">🔒 Locked</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gold/80">Profile Picture</label>
                <div className="flex items-center gap-3">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setEditAdminPhoto, setEditUploading)} className="w-full text-xs text-cream/70 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-saffron file:text-navy cursor-pointer bg-navy border rounded-xl" />
                  {editAdminPhoto && <button type="button" onClick={() => setEditAdminPhoto('')} className="px-3 py-2 bg-red-500/20 text-red-400 text-xs rounded-xl">Remove</button>}
                </div>
                {editUploading && <p className="text-xs text-saffron flex items-center gap-1 mt-1"><Loader2 size={14} className="animate-spin" /> Uploading image...</p>}
                {editAdminPhoto && <img src={editAdminPhoto} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-saffron mt-2" />}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingAdmin(null)} className="flex-1 py-3 bg-navy border border-gold/20 text-cream rounded-xl text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-saffron text-navy rounded-xl text-xs font-semibold"><Save size={15} className="inline mr-1" /> Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingVolunteer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/85 backdrop-blur-sm px-4">
          <div className="relative bg-navy-2 border border-gold/25 p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-5">
            <button onClick={() => setEditingVolunteer(null)} className="absolute top-5 right-5 text-cream/60 hover:text-saffron"><X size={22} /></button>
            <h3 className="text-xl text-cream font-display">Edit Volunteer Profile</h3>
            <form onSubmit={handleUpdateVolunteer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-navy border border-gold/10">
                <div>
                  <label className="text-[10px] uppercase text-gold/60 block">Volunteer ID (Frozen)</label>
                  <input type="text" value={editingVolunteer.volunteerId || ''} disabled className="w-full bg-transparent text-cream/60 font-mono text-xs outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-gold/60 block">Aadhaar Number (Frozen)</label>
                  <input type="text" value={`******${String(editingVolunteer.aadhaarNumber || '').slice(-6)}`} disabled className="w-full bg-transparent text-cream/60 font-mono text-xs outline-none cursor-not-allowed" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={editVolNameHindi} onChange={(e) => setEditVolNameHindi(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none font-hindi" required />
                <input type="text" value={editVolNameEnglish} onChange={(e) => setEditVolNameEnglish(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={editVolPhone} onChange={(e) => setEditVolPhone(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none" required />
                <input type="text" value={editVolEmail} onChange={(e) => setEditVolEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none" />
              </div>
              <textarea value={editVolAddress} onChange={(e) => setEditVolAddress(e.target.value)} rows="2" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none resize-none font-hindi" required />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingVolunteer(null)} className="flex-1 py-3 bg-navy border border-gold/20 text-cream rounded-xl text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-saffron text-navy rounded-xl text-xs font-semibold"><Save size={15} className="inline mr-1" /> Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}