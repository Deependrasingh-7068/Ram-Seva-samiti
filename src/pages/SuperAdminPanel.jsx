import { useState, useEffect } from 'react';
import { UserPlus, Shield, Trash2, KeyRound, Loader2, Search, Edit3, X, Save, Users, HeartHandshake, Image as ImageIcon, Eye, EyeOff, Lock, Unlock, ToggleLeft, ToggleRight, LogOut, Crown, CalendarClock, ClipboardList, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('admins');

  // Helper to grab token for API calls
  const getToken = () => {
    const authData = JSON.parse(localStorage.getItem('superAdminAuth') || '{}');
    return authData.token || '';
  };

  // Super Admin logout — session clear karke login page pe bhej dega
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmSuperAdminLogout = () => {
    localStorage.removeItem('superAdminAuth');
    navigate('/superadmin/login');
  };
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerSearch, setVolunteerSearch] = useState('');
  
  // Office Bearers States
  const [officeBearers, setOfficeBearers] = useState([]);
  const [obDesignation, setObDesignation] = useState('');
  const [obNameHindi, setObNameHindi] = useState('');
  const [obNameEnglish, setObNameEnglish] = useState('');
  const [obEmail, setObEmail] = useState('');
  const [obPassword, setObPassword] = useState('');
  const [obContact, setObContact] = useState('');
  const [obAadhaar, setObAadhaar] = useState('');
  const [obDob, setObDob] = useState('');
  const [obPhoto, setObPhoto] = useState('');
  const [obQuote, setObQuote] = useState('');
  const [obUploading, setObUploading] = useState(false);
  const [obLoading, setObLoading] = useState(false);

  // Edit Office Bearer Modal States
  const [editingBearer, setEditingBearer] = useState(null);
  const [editObNameHindi, setEditObNameHindi] = useState('');
  const [editObNameEnglish, setEditObNameEnglish] = useState('');
  const [editObEmail, setEditObEmail] = useState('');
  const [editObContact, setEditObContact] = useState('');
  const [editObAadhaar, setEditObAadhaar] = useState('');
  const [editObPhoto, setEditObPhoto] = useState('');
  const [editObQuote, setEditObQuote] = useState('');
  const [editObUploading, setEditObUploading] = useState(false);
  const [revealObAadhaar, setRevealObAadhaar] = useState(false);

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/list`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) setAdmins(data.admins);
    } catch (err) { console.error(err); }
  };

  const fetchVolunteers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/volunteers/all`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) setVolunteers(data.volunteers);
    } catch (err) { console.error(err); }
  };

  const fetchOfficeBearers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/office-bearers/all`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) setOfficeBearers(data.officeBearers);
    } catch (err) { console.error(err); }
  };

    const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [donationSearch, setDonationSearch] = useState('');
    const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [campaignStart, setCampaignStart] = useState('');
  const [campaignEnd, setCampaignEnd] = useState('');
  const [creatingCampaign, setCreatingCampaign] = useState(false);

  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [registrationSearch, setRegistrationSearch] = useState('');

  const filteredRegistrations = registrations.filter((r) =>
    (r.name || '').toLowerCase().includes(registrationSearch.trim().toLowerCase())
  );
    const [ads, setAds] = useState([]);
  const [adsLoading, setAdsLoading] = useState(false);
  const [adImage, setAdImage] = useState('');
  const [adUploading, setAdUploading] = useState(false);
  const [adTitle, setAdTitle] = useState('');
  const [adLink, setAdLink] = useState('');
  const [adStart, setAdStart] = useState('');
  const [adEnd, setAdEnd] = useState('');
  const [creatingAd, setCreatingAd] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
  const [editAdTitle, setEditAdTitle] = useState('');
  const [editAdImage, setEditAdImage] = useState('');
  const [editAdUploading, setEditAdUploading] = useState(false);
  const [editAdLink, setEditAdLink] = useState('');
  const [editAdStart, setEditAdStart] = useState('');
  const [editAdEnd, setEditAdEnd] = useState('');
  const [updatingAd, setUpdatingAd] = useState(false);

  // ISO date string ko <input type="datetime-local"> ke format (YYYY-MM-DDTHH:mm) mein badalta hai
  const toDatetimeLocal = (isoStr) => {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const openEditAdModal = (ad) => {
    setEditingAd(ad);
    setEditAdTitle(ad.title || '');
    setEditAdImage(ad.image || '');
    setEditAdLink(ad.link || '');
    setEditAdStart(toDatetimeLocal(ad.startDate));
    setEditAdEnd(toDatetimeLocal(ad.endDate));
  };

  const handleUpdateAd = async (e) => {
    e.preventDefault();
    if (!editingAd) return;
    setUpdatingAd(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ads/${editingAd._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editAdTitle,
          image: editAdImage,
          link: editAdLink,
          startDate: editAdStart || null,
          endDate: editAdEnd || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingAd(null);
        fetchAds();
      } else {
        alert(data.message || 'Ad update nahi ho payi.');
      }
    } catch (err) {
      alert('Server error: could not reach the backend.');
    } finally {
      setUpdatingAd(false);
    }
  };

  const fetchAds = async () => {
    setAdsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ads/all`);
      const data = await res.json();
      if (data.success) setAds(data.ads);
    } catch (err) { console.error(err); }
    finally { setAdsLoading(false); }
  };

  const handleCreateAd = async (e) => {
    e.preventDefault();
    if (!adImage) {
      alert('Kripya pehle ad image upload karein.');
      return;
    }
    setCreatingAd(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ads/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: adTitle,
          image: adImage,
          link: adLink,
          startDate: adStart || null,
          endDate: adEnd || null,
          isActive: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAdTitle(''); setAdImage(''); setAdLink(''); setAdStart(''); setAdEnd('');
        fetchAds();
        alert('Ad ban gayi aur website par live ho gayi hai!');
      } else {
        alert(data.message || 'Ad create nahi ho payi.');
      }
    } catch (err) {
      alert('Server error: could not reach the backend.');
    } finally {
      setCreatingAd(false);
    }
  };

  const handleToggleAd = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ads/${id}/toggle`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) fetchAds();
    } catch (err) { console.error(err); }
  };

  const handleDeleteAd = async (id) => {
    if (!window.confirm('Ye ad delete karni hai?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ads/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchAds();
    } catch (err) { console.error(err); }
  };
  const fetchCampaigns = async () => {
    setCampaignsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations/campaigns`);
      const data = await res.json();
      if (data.success) setCampaigns(data.campaigns);
    } catch (err) { console.error(err); }
    finally { setCampaignsLoading(false); }
  };

  const fetchRegistrations = async () => {
    setRegistrationsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations/list`);
      const data = await res.json();
      if (data.success) setRegistrations(data.registrations);
    } catch (err) { console.error(err); }
    finally { setRegistrationsLoading(false); }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setCreatingCampaign(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations/campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: campaignTitle,
          bannerMessage: campaignMessage,
          startDate: campaignStart || null,
          endDate: campaignEnd || null,
          isActive: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCampaignTitle('');
        setCampaignMessage('');
        setCampaignStart('');
        setCampaignEnd('');
        fetchCampaigns();
        alert('Registration campaign ban gayi aur banner par live ho gayi hai!');
      } else {
        alert(data.message || 'Campaign create nahi ho payi.');
      }
    } catch (err) {
      alert('Server error: could not reach the backend.');
    } finally {
      setCreatingCampaign(false);
    }
  };

  const handleToggleCampaign = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations/campaign/${id}/toggle`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) fetchCampaigns();
    } catch (err) { console.error(err); }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Ye campaign delete karni hai? Ye undo nahi hogi.')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations/campaign/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchCampaigns();
    } catch (err) { console.error(err); }
  };

  const handleExportRegistrations = () => {
    window.open(`${import.meta.env.VITE_API_URL}/api/registrations/export`, '_blank');
  };
  

  const fetchDonations = async () => {
    setDonationsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/donations/list`);
      const data = await res.json();
      if (data.success) setDonations(data.donations);
    } catch (err) { console.error(err); }
    finally { setDonationsLoading(false); }
  };

  const handleExportDonations = () => {
    window.open(`${import.meta.env.VITE_API_URL}/api/donations/export`, '_blank');
  };

  const totalDonationAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const filteredDonations = donations.filter((d) =>
    (d.name || '').toLowerCase().includes(donationSearch.trim().toLowerCase())
  );

  useEffect(() => {
    fetchAdmins();
    fetchVolunteers();
    fetchOfficeBearers();
    fetchDonations();
    fetchCampaigns();
    fetchRegistrations();
    fetchAds();
  }, []);

  const handleImageUpload = async (e, setImageCallback, setLoadingCallback) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'ram_sewa_samiti/admins');
    
    if (setLoadingCallback) setLoadingCallback(true);
    else setUploading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData 
      });
      const data = await response.json();
      if (data.success && data.url) {
        setImageCallback(data.url);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) { 
      console.error('Backend Upload Error:', error);
      alert(`Image upload failed: ${error.message}`); 
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/create-admin`, { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }, 
        body: JSON.stringify(payload) 
      });
      const data = await res.json();
      if (data.success) {
        alert(`Admin created successfully with ID: ${generatedAdminId}`);
        fetchAdmins();
        setName(''); setEmail(''); setPassword(''); setContact(''); setAadhaar(''); setDob(''); setAdminPhoto('');
      } else {
        alert(data.message || 'Failed to create admin');
      }
    } catch (error) {
      alert('Server error: could not reach the backend. Please check your connection or try again.');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this admin?')) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/delete-admin/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        fetchAdmins();
      } catch (err) { console.error(err); }
    }
  };

  const handleToggleFreeze = async (adm) => {
    const targetId = adm._id || adm.id;
    const newFreezeState = !adm.isFrozen;
    const actionText = newFreezeState ? 'freeze (block)' : 'unfreeze';
    
    if (window.confirm(`Are you sure you want to ${actionText} admin ${adm.name}?`)) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/toggle-freeze/${targetId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
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
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
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

  const handleCreateOfficeBearer = async (e) => {
    e.preventDefault();
    if (!obDesignation) {
      alert('Please select a designation.');
      return;
    }

    const designationMap = {
      'Patron': 'संरक्षक',
      'President': 'अध्यक्ष',
      'General Secretary': 'महासचिव',
      'Treasurer': 'कोषाध्यक्ष',
      'Media In-charge': 'मीडिया प्रभारी'
    };

    setObLoading(true);
    const payload = {
      designation: obDesignation,
      designationHindi: designationMap[obDesignation] || 'पदाधिकारी',
      nameHindi: obNameHindi.trim(),
      nameEnglish: obNameEnglish.trim(),
      email: obEmail.trim().toLowerCase(),
      password: obPassword,
      contact: sanitizeValue(obContact),
      aadhaarNumber: sanitizeValue(obAadhaar),
      dob: sanitizeValue(obDob),
      photo: obPhoto || '',
      quote: obQuote
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/office-bearers/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchOfficeBearers();
        setObDesignation(''); setObNameHindi(''); setObNameEnglish(''); setObEmail(''); setObPassword(''); setObContact(''); setObAadhaar(''); setObDob(''); setObPhoto(''),setObQuote('');
      } else {
        alert(data.message || 'Failed to create Office Bearer');
      }
    } catch (err) {
      console.error(err);
      alert('Server error during Office Bearer creation.');
    } finally {
      setObLoading(false);
    }
  };

  const handleToggleFreezeBearer = async (bearer) => {
    const targetId = bearer._id || bearer.id;
    const newFreezeState = !bearer.isFrozen;
    const actionText = newFreezeState ? 'freeze' : 'unfreeze';

    if (window.confirm(`Are you sure you want to ${actionText} Office Bearer ${bearer.nameHindi}?`)) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/office-bearers/freeze/${targetId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify({ isFrozen: newFreezeState })
        });
        const data = await res.json();
        if (data.success) {
          fetchOfficeBearers();
        } else {
          alert(data.message || 'Failed to update freeze status');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteBearer = async (bearer) => {
    const targetId = bearer._id || bearer.id;
    if (window.confirm(`Are you sure you want to permanently remove Office Bearer ${bearer.nameHindi}?`)) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/office-bearers/remove/${targetId}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        fetchOfficeBearers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openEditBearerModal = (bearer) => {
    setEditingBearer(bearer);
    setEditObNameHindi(bearer.nameHindi || '');
    setEditObNameEnglish(bearer.nameEnglish || '');
    setEditObEmail(bearer.email || '');
    setEditObContact(bearer.contact === 'NA' ? '' : (bearer.contact || ''));
    setEditObAadhaar(bearer.aadhaarNumber || '');
    setEditObPhoto(bearer.photo || '');
    setEditObQuote(bearer.quote || '');
    setRevealObAadhaar(false);
  };

  const handleUpdateOfficeBearer = async (e) => {
    e.preventDefault();
    if (!editingBearer) return;
    const targetId = editingBearer._id || editingBearer.id;
    const payload = {
      nameHindi: editObNameHindi.trim(),
      nameEnglish: editObNameEnglish.trim(),
      email: editObEmail.trim().toLowerCase(),
      contact: sanitizeValue(editObContact),
      photo: editObPhoto || '',
      quote: editObQuote
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/office-bearers/update/${targetId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert('Office Bearer profile updated successfully!');
        setEditingBearer(null);
        fetchOfficeBearers();
      } else {
        alert(data.message || 'Failed to update');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFreezeVolunteer = async (vol) => {
    const targetId = vol._id || vol.id;
    const newFreezeState = !vol.isFrozen;
    const actionText = newFreezeState ? 'freeze (block)' : 'unfreeze';

    if (window.confirm(`Are you sure you want to ${actionText} volunteer ${vol.nameHindi}?`)) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/volunteers/toggle-freeze/${targetId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify({ isFrozen: newFreezeState })
        });
        const data = await res.json();
        if (data.success) {
          fetchVolunteers();
        } else {
          alert(data.message || 'Failed to update freeze status');
        }
      } catch (err) {
        console.error(err);
        alert('Error updating volunteer freeze status');
      }
    }
  };

  const handleDeleteVolunteer = async (vol) => {
    const targetId = vol._id || vol.id;
    if (window.confirm(`Are you sure you want to permanently delete volunteer ${vol.nameHindi}? This cannot be undone.`)) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/volunteers/remove/${targetId}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        fetchVolunteers();
      } catch (err) {
        console.error(err);
        alert('Error deleting volunteer');
      }
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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
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

  const allDesignations = [
    { value: 'Patron', labelEng: 'Patron', labelHindi: 'संरक्षक' },
    { value: 'President', labelEng: 'President', labelHindi: 'अध्यक्ष' },
    { value: 'General Secretary', labelEng: 'General Secretary', labelHindi: 'महासचिव' },
    { value: 'Treasurer', labelEng: 'Treasurer', labelHindi: 'कोषाध्यक्ष' },
    { value: 'Media In-charge', labelEng: 'Media In-charge', labelHindi: 'मीडिया प्रभारी' }
  ];

  const assignedDesignations = officeBearers.map(b => b.designation);
  const availableDesignations = allDesignations.filter(d => !assignedDesignations.includes(d.value));

  return (
    <div className="min-h-screen bg-navy pt-28 pb-20 px-6 max-w-[95rem] mx-auto text-cream">
       <div className="bg-navy-2 p-6 rounded-2xl border border-gold/10 mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-saffron flex items-center gap-2">
            <Shield size={28} /> Super Admin Control Center
          </h1>
          <p className="text-sm text-cream/60 mt-1">Manage all samiti admins, credentials, volunteers and donations in Database.</p>
        </div>

        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          title="Logout"
          aria-label="Logout"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer shrink-0"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2 bg-navy-2 p-4 rounded-2xl border border-gold/15 h-fit">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gold/70 px-3 pb-2">Control Modules</h3>
          <button onClick={() => setActiveTab('admins')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${activeTab === 'admins' ? 'bg-saffron text-navy font-bold' : 'text-cream/80 hover:bg-navy hover:text-saffron'}`}>
            <Shield size={16} /> Admin Management
          </button>
          <button onClick={() => setActiveTab('officeBearers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${activeTab === 'officeBearers' ? 'bg-saffron text-navy font-bold' : 'text-cream/80 hover:bg-navy hover:text-saffron'}`}>
            <Crown size={16} /> Office Bearer 👑
          </button>
          <button onClick={() => setActiveTab('volunteers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${activeTab === 'volunteers' ? 'bg-saffron text-navy font-bold' : 'text-cream/80 hover:bg-navy hover:text-saffron'}`}>
            <Users size={16} /> Volunteer Management
          </button>
          <button onClick={() => setActiveTab('donations')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${activeTab === 'donations' ? 'bg-saffron text-navy font-bold' : 'text-cream/80 hover:bg-navy hover:text-saffron'}`}>
            <HeartHandshake size={16} /> Donation Management
          </button>
          <button onClick={() => setActiveTab('registrations')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${activeTab === 'registrations' ? 'bg-saffron text-navy font-bold' : 'text-cream/80 hover:bg-navy hover:text-saffron'}`}>
            <ClipboardList size={16} /> Registration Management
          </button>
          <button onClick={() => setActiveTab('ads')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${activeTab === 'ads' ? 'bg-saffron text-navy font-bold' : 'text-cream/80 hover:bg-navy hover:text-saffron'}`}>
            <Megaphone size={16} /> Ads Management
          </button>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'admins' && (
            <div className="space-y-6">
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

                {uploading && <p className="text-xs text-saffron flex items-center gap-1"><Loader2 size={14} className="animate-spin" /> Uploading & optimizing image...</p>}
                {adminPhoto && (
                  <div className="flex items-center gap-3 pt-1">
                    <img src={adminPhoto} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-saffron" />
                    <span className="text-xs text-saffron">Photo attached & optimized</span>
                  </div>
                )}

                <button type="submit" disabled={loading} className="px-8 py-3 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-semibold text-sm cursor-pointer shadow-lg">
                  {loading && <Loader2 className="animate-spin inline mr-2" size={16} />} Create & Save to Database
                </button>
              </form>

              {/* Registered Admins Table */}
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

          {/* OFFICE BEARER MANAGEMENT TAB */}
          {activeTab === 'officeBearers' && (
            <div className="space-y-6">
              <form onSubmit={handleCreateOfficeBearer} className="bg-navy-2 p-8 rounded-2xl border border-gold/20 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gold flex items-center gap-2">
                    <Crown size={20} /> Create / Assign Office Bearer (पदाधिकारी)
                  </h3>
                  <span className="text-[11px] text-saffron bg-saffron/10 px-3 py-1 rounded-full border border-saffron/30">
                    Strictly 1 active holder per designation
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gold/80">Select Designation (पद)</label>
                    <select
                      value={obDesignation}
                      onChange={(e) => setObDesignation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron cursor-pointer"
                      required
                    >
                      <option value="">-- Choose Designation --</option>
                      {availableDesignations.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.labelEng} ({d.labelHindi})
                        </option>
                      ))}
                    </select>
                    {availableDesignations.length === 0 && (
                      <p className="text-[11px] text-amber-400">All 4 Office Bearer positions are currently filled!</p>
                    )}
                  </div>

                  <input 
                    type="text" 
                    placeholder="Full Name (Hindi) e.g. आचार्य राम कुमार" 
                    value={obNameHindi} 
                    onChange={(e) => setObNameHindi(e.target.value)} 
                    className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron font-hindi self-end" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="text" placeholder="Full Name (English)" value={obNameEnglish} onChange={(e) => setObNameEnglish(e.target.value)} className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron" />
                  <input type="email" placeholder="Email / Login ID" value={obEmail} onChange={(e) => setObEmail(e.target.value)} className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron" required />
                  <input type="text" placeholder="Contact Number" value={obContact} onChange={(e) => setObContact(e.target.value)} className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="text" placeholder="Aadhaar Number (12 digits)" value={obAadhaar} onChange={(e) => setObAadhaar(e.target.value)} className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron font-mono" required />
                  <input type="text" placeholder="Date of Birth (DDMMYYYY)" maxLength={8} value={obDob} onChange={(e) => setObDob(e.target.value)} className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron tracking-widest" required />
                  <input type="password" placeholder="Initial Login Password" value={obPassword} onChange={(e) => setObPassword(e.target.value)} className="px-4 py-3 rounded-xl bg-navy border border-gold/20 text-cream text-sm outline-none focus:border-saffron" required />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gold/80">Quote / Description (optional)</label>
                  <textarea
                    value={obQuote}
                    onChange={(e) => setObQuote(e.target.value)}
                    rows={2}
                    placeholder="Optional Quote / Description (e.g. वर्षों से समिति के साथ जुड़े, सेवा और समाजहित के लिए निरंतर समर्पित)"
                    className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none focus:border-saffron font-hindi resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setObPhoto, setObUploading)} className="w-full text-xs text-cream/70 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-saffron file:text-navy cursor-pointer bg-navy border border-gold/20 rounded-xl" />
                  {obPhoto && (
                    <button type="button" onClick={() => setObPhoto('')} className="px-3 py-2 rounded-xl bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors cursor-pointer shrink-0">
                      Remove
                    </button>
                  )}
                </div>

                {obUploading && <p className="text-xs text-saffron flex items-center gap-1"><Loader2 size={14} className="animate-spin" /> Uploading & optimizing image...</p>}
                {obPhoto && (
                  <div className="flex items-center gap-3 pt-1">
                    <img src={obPhoto} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-saffron" />
                    <span className="text-xs text-saffron">Photo attached & optimized</span>
                  </div>
                )}

                <button type="submit" disabled={obLoading || availableDesignations.length === 0} className="px-8 py-3 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-semibold text-sm cursor-pointer shadow-lg disabled:opacity-50">
                  {obLoading && <Loader2 className="animate-spin inline mr-2" size={16} />} Create Office Bearer
                </button>
              </form>

              {/* Registered Office Bearers Table */}
              <div className="bg-navy-2 p-6 rounded-2xl border border-gold/10 space-y-4">
                <h3 className="text-xl font-semibold text-cream flex items-center gap-2">
                  <Crown size={18} className="text-saffron" /> Active Office Bearers in Samiti
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[850px]">
                    <thead>
                      <tr className="border-b border-gold/20 text-saffron text-sm">
                        <th className="py-3 px-4">Profile</th>
                        <th className="py-3 px-4">Bearer ID</th>
                        <th className="py-3 px-4">Designation</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email / ID</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Aadhaar (6 Digits)</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gold/10 text-cream/80">
                      {officeBearers.length > 0 ? (
                        officeBearers.map((bearer) => {
                          const bearerId = bearer._id || bearer.id;
                          const maskedAadhaar = formatMaskedId(bearer.aadhaarNumber);
                          const isFrozen = bearer.isFrozen;

                          return (
                            <tr key={bearerId} className={`hover:bg-navy/40 transition-colors ${isFrozen ? 'bg-red-950/20' : ''}`}>
                              <td className="py-3.5 px-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-navy border border-gold/30 relative">
                                  {bearer.photo ? <img src={bearer.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-saffron text-xs">👑</div>}
                                  {isFrozen && <span className="absolute inset-0 bg-red-600/40 flex items-center justify-center text-[10px] text-white font-bold">FROZEN</span>}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-xs text-saffron">{bearer.bearerId}</td>
                              <td className="py-3.5 px-4 text-gold font-bold text-xs">
                                {bearer.designation} <span className="font-hindi text-saffron block text-[11px]">({bearer.designationHindi})</span>
                              </td>
                              <td className="py-3.5 px-4 font-medium text-cream font-hindi">{bearer.nameHindi}</td>
                              <td className="py-3.5 px-4 text-xs text-cream/75">{bearer.email}</td>
                              <td className="py-3.5 px-4 text-xs">{bearer.contact || 'NA'}</td>
                              <td className="py-3.5 px-4 font-mono text-xs text-gold font-semibold">{maskedAadhaar}</td>
                              <td className="py-3.5 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleFreezeBearer(bearer)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 mx-auto transition-all cursor-pointer ${
                                    isFrozen 
                                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500 hover:text-white' 
                                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white'
                                  }`}
                                >
                                  {isFrozen ? <Lock size={13} /> : <Unlock size={13} />}
                                  <span>{isFrozen ? 'Frozen' : 'Active'}</span>
                                </button>
                              </td>
                              <td className="py-3.5 px-4 flex justify-center gap-2">
                                <button onClick={() => openEditBearerModal(bearer)} className="p-2 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white cursor-pointer" title="Edit"><Edit3 size={16} /></button>
                                <button onClick={() => handleDeleteBearer(bearer)} className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-white cursor-pointer" title="Remove"><Trash2 size={16} /></button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr><td colSpan="9" className="py-8 text-center text-xs text-cream/50">No Office Bearers assigned yet.</td></tr>
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
                  filteredVolunteers.map((vol) => {
                    const isVolFrozen = vol.isFrozen;
                    return (
                      <div key={vol._id || vol.volunteerId} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md ${isVolFrozen ? 'bg-red-950/20 border-red-500/30' : 'bg-navy border-gold/15'}`}>
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-navy-2 border border-gold/30 shrink-0 relative">
                            {vol.photo ? <img src={vol.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-saffron font-bold">👤</div>}
                            {isVolFrozen && <span className="absolute inset-0 bg-red-600/50 flex items-center justify-center text-[8px] text-white font-bold">FROZEN</span>}
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
                              {isVolFrozen && (
                                <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30 font-semibold">
                                  FROZEN
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-cream/50 truncate mt-0.5">Phone: {vol.phone} | Address: {vol.address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto overflow-x-auto pt-3 sm:pt-0 border-t border-gold/10 sm:border-0">
                          <button
                            type="button"
                            onClick={() => handleToggleFreezeVolunteer(vol)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                              isVolFrozen
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500 hover:text-white'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white'
                            }`}
                            title={isVolFrozen ? 'Click to Unfreeze Volunteer' : 'Click to Freeze Volunteer'}
                          >
                            {isVolFrozen ? <Lock size={13} /> : <Unlock size={13} />}
                            <span>{isVolFrozen ? 'Frozen' : 'Active'}</span>
                          </button>
                          <button onClick={() => openEditVolunteerModal(vol)} className="px-4 py-2 rounded-xl bg-blue-500/15 text-blue-400 hover:bg-blue-500 hover:text-white text-xs font-semibold cursor-pointer">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteVolunteer(vol)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-white cursor-pointer" title="Delete Volunteer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-xs text-cream/50">No volunteers found.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="bg-navy-2 p-6 sm:p-8 rounded-2xl border border-gold/20 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-saffron flex items-center gap-2">
                    <HeartHandshake size={22} /> Donation Management
                  </h3>
                  <p className="text-xs text-cream/70 mt-1">
                    Only successful (paid) donations are visible here. Total collected: <span className="text-saffron font-semibold">₹{totalDonationAmount.toLocaleString('en-IN')}</span> ({donations.length} donations)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportDonations}
                  disabled={donations.length === 0}
                  className="px-4 py-2.5 rounded-xl bg-saffron hover:bg-saffron-deep disabled:opacity-40 disabled:cursor-not-allowed text-navy font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shrink-0"
                >
                  Download Excel Sheet
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={donationSearch}
                  onChange={(e) => setDonationSearch(e.target.value)}
                  placeholder="Search donor by name..."
                  className="w-full sm:max-w-xs px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs placeholder:text-cream/30 focus:border-saffron outline-none transition-colors"
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-gold/15">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead className="bg-navy text-saffron uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {donationsLoading ? (
                      <tr><td colSpan="5" className="py-8 text-center text-cream/50"><Loader2 className="animate-spin inline mr-2" size={16} /> Loading...</td></tr>
                    ) : filteredDonations.length === 0 ? (
                      <tr><td colSpan="5" className="py-8 text-center text-cream/50">{donationSearch ? 'Is naam se koi donor nahi mila.' : 'Abhi tak koi successful donation nahi hui hai.'}</td></tr>
                    ) : (
                      filteredDonations.map((d) => (
                        <tr key={d._id} className="text-cream/80 hover:bg-navy/40">
                          <td className="px-4 py-3 font-medium text-cream">{d.name}</td>
                          <td className="px-4 py-3">{d.mobile}</td>
                          <td className="px-4 py-3">{d.email || 'N/A'}</td>
                          <td className="px-4 py-3 text-saffron font-semibold">₹{d.amount.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3">{new Date(d.createdAt).toLocaleString('en-IN')}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'registrations' && (
            <div className="space-y-6">
              {/* NAYI CAMPAIGN BANANE KA FORM */}
              <div className="bg-navy-2 p-6 sm:p-8 rounded-2xl border border-gold/20 space-y-5 shadow-xl">
                <div>
                  <h3 className="text-xl font-semibold text-saffron flex items-center gap-2">
                    <ClipboardList size={22} /> Registration Management
                  </h3>
                  <p className="text-xs text-cream/70 mt-1">
                    Nayi registration banayenge to ye banner par turant live ho jaayegi aur website pe /register form khul jaayega. Jab tak koi active nahi hogi, banner hidden rahega.
                  </p>
                </div>

                <form onSubmit={handleCreateCampaign} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">Campaign Title</label>
                      <input type="text" required value={campaignTitle} onChange={(e) => setCampaignTitle(e.target.value)} placeholder="राम नवमी महोत्सव 2026" className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none focus:border-saffron" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">Banner Message</label>
                      <input type="text" required value={campaignMessage} onChange={(e) => setCampaignMessage(e.target.value)} placeholder="राम नवमी महोत्सव हेतु पंजीकरण प्रारंभ हो चुका है।" className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none focus:border-saffron font-hindi" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">Start Date (optional)</label>
                      <input type="date" value={campaignStart} onChange={(e) => setCampaignStart(e.target.value)} className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none [color-scheme:dark]" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">End Date (optional)</label>
                      <input type="date" value={campaignEnd} onChange={(e) => setCampaignEnd(e.target.value)} className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none [color-scheme:dark]" />
                    </div>
                  </div>
                  <button type="submit" disabled={creatingCampaign} className="px-5 py-3 rounded-xl bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2">
                    {creatingCampaign ? <Loader2 size={16} className="animate-spin" /> : <CalendarClock size={16} />}
                    {creatingCampaign ? 'Creating...' : 'Create & Make Live'}
                  </button>
                </form>
              </div>

              {/* SAARI CAMPAIGNS KI LIST */}
              <div className="bg-navy-2 p-6 sm:p-8 rounded-2xl border border-gold/20 space-y-4 shadow-xl">
                <h3 className="text-xs font-bold text-gold uppercase tracking-widest border-b border-gold/15 pb-3">All Campaigns</h3>
                {campaignsLoading ? (
                  <div className="py-8 text-center text-cream/50 text-xs"><Loader2 className="animate-spin inline mr-2" size={16} /> Loading...</div>
                ) : campaigns.length === 0 ? (
                  <div className="py-8 text-center text-cream/50 text-xs">Abhi tak koi campaign nahi banayi gayi.</div>
                ) : (
                  <div className="space-y-3">
                    {campaigns.map((c) => (
                      <div key={c._id} className="p-4 rounded-xl bg-navy border border-gold/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-cream">{c.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-gold/10 text-gold'}`}>
                              {c.isActive ? 'LIVE' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-xs text-cream/60 font-hindi mt-1">{c.bannerMessage}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => handleToggleCampaign(c._id)} className={`px-3 py-2 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${c.isActive ? 'bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-white'}`}>
                            {c.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button onClick={() => handleDeleteCampaign(c._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SAARI REGISTRATIONS + SEARCH + EXCEL EXPORT */}
              <div className="bg-navy-2 p-6 sm:p-8 rounded-2xl border border-gold/20 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-gold uppercase tracking-widest">All Registrations ({registrations.length})</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportRegistrations}
                    disabled={registrations.length === 0}
                    className="px-4 py-2.5 rounded-xl bg-saffron hover:bg-saffron-deep disabled:opacity-40 disabled:cursor-not-allowed text-navy font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shrink-0"
                  >
                    Download Excel Sheet
                  </button>
                </div>

                <input
                  type="text"
                  value={registrationSearch}
                  onChange={(e) => setRegistrationSearch(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full sm:max-w-xs px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs placeholder:text-cream/30 focus:border-saffron outline-none transition-colors"
                />

                <div className="overflow-x-auto rounded-xl border border-gold/15">
                  <table className="w-full text-left text-xs min-w-[650px]">
                    <thead className="bg-navy text-saffron uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Contact</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Campaign</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10">
                      {registrationsLoading ? (
                        <tr><td colSpan="5" className="py-8 text-center text-cream/50"><Loader2 className="animate-spin inline mr-2" size={16} /> Loading...</td></tr>
                      ) : filteredRegistrations.length === 0 ? (
                        <tr><td colSpan="5" className="py-8 text-center text-cream/50">{registrationSearch ? 'Is naam se koi registration nahi mili.' : 'Abhi tak koi registration nahi hui hai.'}</td></tr>
                      ) : (
                        filteredRegistrations.map((r) => (
                          <tr key={r._id} className="text-cream/80 hover:bg-navy/40">
                            <td className="px-4 py-3 font-medium text-cream">{r.name}</td>
                            <td className="px-4 py-3">{r.mobile}</td>
                            <td className="px-4 py-3">{r.email || 'N/A'}</td>
                            <td className="px-4 py-3">{r.campaignTitle || 'N/A'}</td>
                            <td className="px-4 py-3">{new Date(r.createdAt).toLocaleString('en-IN')}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
                    {activeTab === 'ads' && (
            <div className="space-y-6">
              {/* NAYI AD BANANE KA FORM */}
              <div className="bg-navy-2 p-6 sm:p-8 rounded-2xl border border-gold/20 space-y-5 shadow-xl">
                <div>
                  <h3 className="text-xl font-semibold text-saffron flex items-center gap-2">
                    <Megaphone size={22} /> Ads Management
                  </h3>
                  <p className="text-xs text-cream/70 mt-1">
                    Ad create karte hi ye website ke corner mein (bottom-right) sabhi visitors ko dikhne lagegi. Image landscape ho ya portrait, dono support hain — image apne natural shape mein hi dikhegi.
                  </p>
                </div>

                <form onSubmit={handleCreateAd} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">Ad Title (internal reference, optional)</label>
                      <input type="text" value={adTitle} onChange={(e) => setAdTitle(e.target.value)} placeholder="e.g. Diwali Sponsor Ad" className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none focus:border-saffron" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">Click Link (optional)</label>
                      <input type="text" value={adLink} onChange={(e) => setAdLink(e.target.value)} placeholder="https://example.com" className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none focus:border-saffron" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">Start Date & Time (optional)</label>
                      <input type="datetime-local" value={adStart} onChange={(e) => setAdStart(e.target.value)} className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none [color-scheme:dark]" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">End Date & Time (optional)</label>
                      <input type="datetime-local" value={adEnd} onChange={(e) => setAdEnd(e.target.value)} className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none [color-scheme:dark]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-cream/80 uppercase">Ad Image (landscape ya portrait, dono chalega)</label>
                    <div className="flex items-center gap-2">
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setAdImage, setAdUploading)} className="w-full text-xs text-cream/70 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-saffron file:text-navy cursor-pointer bg-navy border border-gold/20 rounded-xl" />
                      {adImage && (
                        <button type="button" onClick={() => setAdImage('')} className="px-3 py-2 rounded-xl bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors cursor-pointer shrink-0">
                          Remove
                        </button>
                      )}
                    </div>
                    {adUploading && <p className="text-xs text-saffron flex items-center gap-1 mt-1"><Loader2 size={14} className="animate-spin" /> Uploading...</p>}
                    {adImage && (
                      <div className="mt-2 p-3 bg-navy rounded-xl border border-gold/15 inline-block">
                        <img src={adImage} alt="Preview" className="max-w-[180px] max-h-[240px] w-auto h-auto object-contain rounded-lg" />
                      </div>
                    )}
                  </div>

                  <button type="submit" disabled={creatingAd || adUploading} className="px-5 py-3 rounded-xl bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2">
                    {creatingAd ? <Loader2 size={16} className="animate-spin" /> : <Megaphone size={16} />}
                    {creatingAd ? 'Creating...' : 'Create & Make Live'}
                  </button>
                </form>
              </div>

              {/* SAARI ADS KI LIST */}
              <div className="bg-navy-2 p-6 sm:p-8 rounded-2xl border border-gold/20 space-y-4 shadow-xl">
                <h3 className="text-xs font-bold text-gold uppercase tracking-widest border-b border-gold/15 pb-3">All Ads</h3>
                {adsLoading ? (
                  <div className="py-8 text-center text-cream/50 text-xs"><Loader2 className="animate-spin inline mr-2" size={16} /> Loading...</div>
                ) : ads.length === 0 ? (
                  <div className="py-8 text-center text-cream/50 text-xs">Abhi tak koi ad nahi banayi gayi.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ads.map((a) => (
                      <div key={a._id} className="p-4 rounded-xl bg-navy border border-gold/15 space-y-3">
                        <div className="w-full h-32 rounded-lg overflow-hidden bg-navy-2 flex items-center justify-center">
                          <img src={a.image} alt={a.title || 'Ad'} className="max-w-full max-h-full w-auto h-auto object-contain" />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-cream truncate">{a.title || 'Untitled Ad'}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${a.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-gold/10 text-gold'}`}>
                            {a.isActive ? 'LIVE' : 'Inactive'}
                          </span>
                        </div>
                        <div className="text-[10px] text-cream/50 space-y-0.5">
                          <p>
                            <span className="text-gold/70">From:</span>{' '}
                            {a.startDate ? new Date(a.startDate).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Anytime'}
                          </p>
                          <p>
                            <span className="text-gold/70">Till:</span>{' '}
                            {a.endDate ? new Date(a.endDate).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No end date'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggleAd(a._id)} className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${a.isActive ? 'bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-white'}`}>
                            {a.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button onClick={() => openEditAdModal(a)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white cursor-pointer transition-all">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => handleDeleteAd(a._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SUPER ADMIN LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm px-4">
          <div className="relative bg-navy-2 border border-gold/25 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <LogOut size={26} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-xl text-cream font-display font-bold">Logout Confirm?</h3>
              <p className="text-xs text-cream/60 mt-1.5">Kya aap sach mein Super Admin Panel se logout karna chahte hain?</p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-5 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-sm font-semibold hover:border-gold/50 transition-all cursor-pointer"
              >
                No
              </button>
              <button
                type="button"
                onClick={confirmSuperAdminLogout}
                className="flex-1 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all cursor-pointer"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

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
                        const dobCheck = prompt('Enter Admin Date of Birth (YYYY-MM-DD) to reveal full ID:');
                        if (dobCheck) {
                          setVerifyDobInput(dobCheck);
                          const targetId = editingAdmin._id || editingAdmin.id;
                          fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/verify-dob/${targetId}`, {
                            method: 'POST',
                            headers: { 
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${getToken()}`
                            },
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
                      title="Reveal Full ID"
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
                {editUploading && <p className="text-xs text-saffron flex items-center gap-1 mt-1"><Loader2 size={14} className="animate-spin" /> Uploading & optimizing image...</p>}
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

      {/* EDIT OFFICE BEARER MODAL */}
      {editingBearer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm px-4">
          <div className="relative bg-navy-2 border border-gold/25 p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-6">
            <button onClick={() => setEditingBearer(null)} className="absolute top-5 right-5 text-cream/60 hover:text-saffron"><X size={22} /></button>
            <h3 className="text-2xl text-cream font-display">Edit Office Bearer Profile</h3>
            <form onSubmit={handleUpdateOfficeBearer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={editObNameHindi} onChange={(e) => setEditObNameHindi(e.target.value)} placeholder="Name (Hindi)" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none font-hindi" required />
                <input type="text" value={editObNameEnglish} onChange={(e) => setEditObNameEnglish(e.target.value)} placeholder="Name (English)" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="email" value={editObEmail} onChange={(e) => setEditObEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none" required />
                <input type="text" value={editObContact} onChange={(e) => setEditObContact(e.target.value)} placeholder="Contact" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none" />
              </div>

              <div className="relative flex items-center bg-navy border border-gold/20 rounded-xl px-3 py-2">
                <input 
                  type="text" 
                  value={revealObAadhaar ? editObAadhaar : formatMaskedId(editObAadhaar)} 
                  readOnly 
                  placeholder="Aadhaar" 
                  className="w-full bg-transparent text-cream text-xs outline-none font-mono cursor-default" 
                />
                {!revealObAadhaar ? (
                  <button 
                    type="button" 
                    onClick={() => {
                      const dobCheck = prompt('Enter Bearer Date of Birth (DDMMYYYY) to reveal full ID:');
                      if (dobCheck) {
                        const targetId = editingBearer._id || editingBearer.id;
                        fetch(`${import.meta.env.VITE_API_URL}/api/office-bearers/verify-dob/${targetId}`, {
                          method: 'POST',
                          headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getToken()}`
                          },
                          body: JSON.stringify({ dob: dobCheck })
                        })
                        .then(res => res.json())
                        .then(data => {
                          if (data.success) {
                            setEditObAadhaar(data.aadhaar);
                            setRevealObAadhaar(true);
                          } else {
                            alert(data.message || 'Incorrect Date of Birth!');
                          }
                        })
                        .catch(() => alert('Verification failed.'));
                      }
                    }}
                    className="text-saffron hover:text-gold shrink-0 cursor-pointer p-1"
                    title="Reveal Full ID"
                  >
                    <Lock size={15} />
                  </button>
                ) : (
                  <span className="text-emerald-400 shrink-0 p-1" title="Revealed">
                    <Unlock size={15} />
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gold/85">Quote / Description (optional)</label>
                <textarea
                  value={editObQuote}
                  onChange={(e) => setEditObQuote(e.target.value)}
                  rows={3}
                  placeholder="वर्षों से समिति के साथ जुड़े, सेवा और समाजहित के लिए निरंतर समर्पित"
                  className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron font-hindi resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gold/85">Profile Picture</label>
                <div className="flex items-center gap-3">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setEditObPhoto, setEditObUploading)} className="w-full text-xs text-cream/70 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-saffron file:text-navy cursor-pointer bg-navy border rounded-xl" />
                  {editObPhoto && <button type="button" onClick={() => setEditObPhoto('')} className="px-3 py-2 bg-red-500/20 text-red-400 text-xs rounded-xl">Remove</button>}
                </div>
                {editObUploading && <p className="text-xs text-saffron flex items-center gap-1 mt-1"><Loader2 size={14} className="animate-spin" /> Uploading & optimizing image...</p>}
                {editObPhoto && <img src={editObPhoto} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-saffron mt-2" />}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingBearer(null)} className="flex-1 py-3 bg-navy border border-gold/20 text-cream rounded-xl text-xs">Cancel</button>
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
                  <label className="text-[10px] uppercase text-gold/60 block">ID Reference (Frozen)</label>
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
            {editingAd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/85 backdrop-blur-sm px-4">
          <div className="relative bg-navy-2 border border-gold/25 p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-5">
            <button onClick={() => setEditingAd(null)} className="absolute top-5 right-5 text-cream/60 hover:text-saffron"><X size={22} /></button>
            <h3 className="text-xl text-cream font-display">Edit Ad</h3>
            <form onSubmit={handleUpdateAd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" value={editAdTitle} onChange={(e) => setEditAdTitle(e.target.value)} placeholder="Ad Title" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none" />
                <input type="text" value={editAdLink} onChange={(e) => setEditAdLink(e.target.value)} placeholder="Click Link" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-cream/80 uppercase">Start Date & Time</label>
                  <input type="datetime-local" value={editAdStart} onChange={(e) => setEditAdStart(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none [color-scheme:dark]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-cream/80 uppercase">End Date & Time</label>
                  <input type="datetime-local" value={editAdEnd} onChange={(e) => setEditAdEnd(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none [color-scheme:dark]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gold/85">Ad Image</label>
                <div className="flex items-center gap-3">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setEditAdImage, setEditAdUploading)} className="w-full text-xs text-cream/70 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-saffron file:text-navy cursor-pointer bg-navy border rounded-xl" />
                </div>
                {editAdUploading && <p className="text-xs text-saffron flex items-center gap-1 mt-1"><Loader2 size={14} className="animate-spin" /> Uploading...</p>}
                {editAdImage && (
                  <div className="mt-2 p-3 bg-navy rounded-xl border border-gold/15 inline-block">
                    <img src={editAdImage} alt="Preview" className="max-w-[180px] max-h-[240px] w-auto h-auto object-contain rounded-lg" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingAd(null)} className="flex-1 py-3 bg-navy border border-gold/20 text-cream rounded-xl text-xs">Cancel</button>
                <button type="submit" disabled={updatingAd || editAdUploading} className="flex-1 py-3 bg-saffron text-navy rounded-xl text-xs font-semibold disabled:opacity-50">
                  {updatingAd ? 'Saving...' : <><Save size={15} className="inline mr-1" /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}