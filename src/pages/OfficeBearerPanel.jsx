import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Crown, LogOut, FileText, CheckCircle2, UserCheck, Menu, X, Upload, Loader2, PlusCircle, Shield, Calendar, Image as ImageIcon, Megaphone, Trash2, Save, ArrowLeft, Award, Sparkles, ShieldCheck, Clock, Edit3, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { getEventStatus, formatTimeRange } from '../utils/eventStatus';

const formatMaskedId = (idStr) => {
  if (!idStr || idStr === 'NA') return 'NA';
  const cleanStr = String(idStr).trim();
  if (cleanStr.length <= 6) return cleanStr;
  const lastSix = cleanStr.slice(-6);
  return `******${lastSix}`;
};

export default function OfficeBearerPanel() {
  const navigate = useNavigate();
  const [bearer, setBearer] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [itemsList, setItemsList] = useState([]);
  const [fetchingList, setFetchingList] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
    const [isFrozen, setIsFrozen] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [shortExcerpt, setShortExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [selectIcon, setSelectIcon] = useState('Join Hand / Prarthana (Default)');
    const [date, setDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');

  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem('officeBearerAuth') || 'null');
      if (!session || !session.token) {
  navigate('/office-bearer/login');
  return;
}
      setBearer(session.bearerInfo);
    } catch (err) {
      navigate('/office-bearer/login');
    }
  }, [navigate]);

  // Live freeze-status watch: catches a freeze applied by Super Admin during an active session
  useEffect(() => {
    const bearerId = bearer?._id || bearer?.id;
    if (!bearerId) return;

    let cancelled = false;

    const checkStatus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/office-bearers/status/${bearerId}`);
        if (cancelled) return;
        if (res.data?.success && res.data.isFrozen) {
          setIsFrozen(true);
        }
      } catch (err) {
        // Silent fail: don't block the dashboard on a transient network issue
      } finally {
        if (!cancelled) setCheckingStatus(false);
      }
    };

    checkStatus();
    const intervalId = setInterval(checkStatus, 20000);
    window.addEventListener('focus', checkStatus);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      window.removeEventListener('focus', checkStatus);
    };
  }, [bearer]);

  useEffect(() => {
    if (isFrozen) return;
    if (['seva', 'events', 'updates', 'gallery'].includes(activeTab)) {
      fetchItems(activeTab);
      setShowAddModal(false);
    }
  }, [activeTab, isFrozen]);
  const fetchItems = async (type) => {
    setFetchingList(true);
    try {
      const endpoint = type === 'events'
        ? '/api/events/all'
        : `/api/content/public-all/${type}`;

      const res = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`);
      if (res.data) {
        const dataList = res.data.items || [];
        setItemsList(Array.isArray(dataList) ? dataList : []);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
      setItemsList([]);
    } finally {
      setFetchingList(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('officeBearerAuth');
    navigate('/office-bearer/login');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'ram_sewa_samiti/office_bearers');
    
    setUploadingImage(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData);
      if (res.data && (res.data.url || res.data.secure_url)) {
        setImageUrl(res.data.url || res.data.secure_url);
      } else {
        throw new Error(res.data?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      alert(`Image upload failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      let payload = {
        postedByRole: 'OFFICE_BEARER',
        bearerDesignation: bearer?.designation || 'Leader',
        authorName: bearer?.nameHindi || 'Office Bearer',
        createdBy: bearer?.email || bearer?.bearerId || 'officebearer',
        adminName: bearer?.nameHindi || 'Office Bearer'
      };

      if (activeTab === 'seva') {
        payload = {
          ...payload,
          title,
          category: category || 'RELIGIOUS',
          titleHindi: title,
          subtitleEnglish: subtitle,
          description,
          selectIcon,
          image: imageUrl
        };
            } else if (activeTab === 'events') {
        const finalDate = date || new Date().toISOString().split('T')[0];
        payload = {
          ...payload,
          title,
          category: category || 'RELIGIOUS',
          date: finalDate,
          startTime: eventStartTime,
          endTime: eventEndTime,
          time: formatTimeRange(eventStartTime, eventEndTime),
          status: getEventStatus({ date: finalDate, startTime: eventStartTime, endTime: eventEndTime }),
          location,
          image: imageUrl
        };
      } else if (activeTab === 'updates') {
        payload = {
          ...payload,
          title,
          category: category || 'NOTICE',
          date: date || new Date().toISOString().split('T')[0],
          shortExcerpt,
          description,
          image: imageUrl
        };
      } else if (activeTab === 'gallery') {
        payload = {
          ...payload,
          title,
          category: category || 'FESTIVAL',
          date: date || new Date().toISOString().split('T')[0],
          image: imageUrl
        };
      }

            const isEdit = Boolean(editingId);

      const endpoint = isEdit
        ? (activeTab === 'events' ? `/api/events/${editingId}` : `/api/content/update/${editingId}`)
        : (activeTab === 'events' ? '/api/events/save' : '/api/content/add');

      if (activeTab !== 'events') {
        payload.type = activeTab;
      }

      const res = isEdit
        ? await axios.put(`${import.meta.env.VITE_API_URL}${endpoint}`, payload)
        : await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, payload);

      if (res.data.success || res.status === 201 || res.data.item) {
        setSuccessMsg(isEdit ? 'Record updated successfully!' : 'Published successfully with high priority!');
        setEditingId(null);
        setSubtitle('');
        setDescription('');
        setShortExcerpt('');
        setImageUrl('');
        setDate('');
               setEventStartTime('');
        setEventEndTime('');
        setTitle('');
        setCategory('');
        setLocation('');
        fetchItems(activeTab);
        setTimeout(() => {
          setShowAddModal(false);
          setSuccessMsg('');
        }, 1000);
      }
    } catch (err) {
      console.error('Publish Error:', err);
      alert(err.response?.data?.message || 'Failed to publish post.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (item) => {
    const itemId = item._id || item.id;
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      const endpoint = activeTab === 'events'
        ? `/api/events/delete/${itemId}`
        : `/api/content/delete/${itemId}`;

      const res = await axios.delete(`${import.meta.env.VITE_API_URL}${endpoint}`);
      if (res.data.success) {
        fetchItems(activeTab);
      }
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Failed to delete post.');
    }
  };

  const startCreate = () => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setShortExcerpt('');
    setCategory('');
    
    setDate('');
            setEventStartTime('');
        setEventEndTime('');
    setLocation('');
    setImageUrl('');
    setSuccessMsg('');
    setShowAddModal(true);
  };
  const startEdit = (item) => {
  setTitle(item.title || '');
  setSubtitle(item.subtitleEnglish || item.subtitle || '');
  setDescription(item.description || '');
  setShortExcerpt(item.shortExcerpt || '');
  setCategory(item.category || '');
  setDate(item.date ? item.date.split('T')[0] : '');
  setLocation(item.location || '');
  setImageUrl(item.image || '');
    setEventStartTime(item.startTime || '');
  setEventEndTime(item.endTime || '');
  setEditingId(item._id || item.id);
  setSuccessMsg('');
  setShowAddModal(true);
};
  if (!bearer) return null;

  // BLOCK ENTIRE DASHBOARD WHEN SUPER ADMIN HAS FROZEN THIS ACCOUNT
  if (isFrozen) {
    return (
      <div className="min-h-screen bg-navy text-cream flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-navy-2 border border-red-500/30 rounded-3xl shadow-[0_0_40px_rgba(239,68,68,0.15)] p-6 sm:p-8 space-y-5 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/15 flex items-center justify-center">
            <Shield size={30} className="text-red-400" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl text-cream font-bold">Account Frozen</h1>
            <p className="text-sm text-red-300 font-hindi mt-2">
              आपका खाता सुपर एडमिन द्वारा फ्रीज़ (निलंबित) कर दिया गया है। जब तक इसे अनफ्रीज़ नहीं किया जाता, तब तक आप डैशबोर्ड का उपयोग नहीं कर सकते।
            </p>
            <p className="text-xs text-cream/50 mt-2">
              This account has been frozen by the Super Admin. You cannot access the dashboard or post any content until it is unfrozen. Your existing posts are also temporarily hidden from the public site.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy text-cream flex flex-col w-full">
      
      <header className="w-full bg-navy-2 border-b border-gold/20 py-4 px-6 md:px-10 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-navy border border-gold/40 shadow-inner shrink-0">
            {bearer.photo ? <img src={bearer.photo} alt="" className="w-full h-full object-cover" /> : <Crown size={24} className="text-saffron m-3" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-saffron uppercase tracking-widest bg-saffron/10 px-2.5 py-0.5 rounded border border-saffron/20">
                {bearer.designation} ({bearer.designationHindi})
              </span>
              <span className="text-xs font-mono text-gold/70 hidden sm:inline">{bearer.bearerId}</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold font-hindi text-cream">
              {bearer.nameHindi}
            </h1>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-2 bg-navy p-1.5 rounded-2xl border border-gold/15">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'overview' ? 'bg-saffron text-navy shadow-md' : 'text-cream/80 hover:text-saffron'}`}><Shield size={14} /> Overview & Patron Details</button>
          <button onClick={() => setActiveTab('seva')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'seva' ? 'bg-saffron text-navy shadow-md' : 'text-cream/80 hover:text-saffron'}`}>Seva Management</button>
          <button onClick={() => setActiveTab('events')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'events' ? 'bg-saffron text-navy shadow-md' : 'text-cream/80 hover:text-saffron'}`}>Events Management</button>
          <button onClick={() => setActiveTab('updates')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'updates' ? 'bg-saffron text-navy shadow-md' : 'text-cream/80 hover:text-saffron'}`}>Updates & Notices</button>
          <button onClick={() => setActiveTab('gallery')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'gallery' ? 'bg-saffron text-navy shadow-md' : 'text-cream/80 hover:text-saffron'}`}>Gallery Management</button>
          
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer">
            <LogOut size={15} /> <span className="hidden sm:inline">Logout</span>
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="xl:hidden p-2 rounded-xl bg-navy border border-gold/20 text-cream cursor-pointer">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="xl:hidden bg-navy-2 border-b border-gold/20 p-4 space-y-2 sticky top-[73px] z-30 shadow-2xl">
          <button onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold ${activeTab === 'overview' ? 'bg-saffron text-navy' : 'text-cream'}`}>Overview & Patron Details</button>
          <button onClick={() => { setActiveTab('seva'); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold ${activeTab === 'seva' ? 'bg-saffron text-navy' : 'text-cream'}`}>Seva Management</button>
          <button onClick={() => { setActiveTab('events'); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold ${activeTab === 'events' ? 'bg-saffron text-navy' : 'text-cream'}`}>Events Management</button>
          <button onClick={() => { setActiveTab('updates'); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold ${activeTab === 'updates' ? 'bg-saffron text-navy' : 'text-cream'}`}>Updates & Notices</button>
          <button onClick={() => { setActiveTab('gallery'); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold ${activeTab === 'gallery' ? 'bg-saffron text-navy' : 'text-cream'}`}>Gallery Management</button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-2 text-left px-4 py-2.5 rounded-xl text-xs font-bold text-cream border-t border-gold/10 mt-2 pt-3">
  <ExternalLink size={14} /> View Website
</a>
        </div>
      )}

      <main className="w-full flex-1 p-6 md:px-12 lg:px-16 py-8 max-w-[100rem] mx-auto">
        
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="w-full bg-gradient-to-r from-navy-2 via-navy to-navy-2 p-8 md:p-10 rounded-3xl border border-gold/35 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden bg-navy-2 border-2 border-gold/50 shrink-0 shadow-2xl">
                  {bearer.photo ? <img src={bearer.photo} alt="" className="w-full h-full object-cover" /> : <Crown size={48} className="text-saffron m-8" />}
                </div>
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-saffron/20 border border-saffron/40 text-saffron font-bold text-xs uppercase tracking-wider">
                    <Award size={14} /> {bearer.designation} — {bearer.designationHindi}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-display font-bold text-cream font-hindi">{bearer.nameHindi}</h2>
                  <p className="text-xs md:text-sm text-gold/80 font-mono">Bearer ID: {bearer.bearerId}</p>
                </div>
              </div>

              <div className="bg-navy p-6 rounded-2xl border border-gold/25 w-full md:w-80 space-y-3 relative z-10 shadow-inner">
                <h3 className="text-xs font-bold text-saffron uppercase tracking-widest flex items-center gap-1.5 border-b border-gold/15 pb-2">
                  <ShieldCheck size={16} /> Verified Credentials
                </h3>
                <div className="text-xs space-y-2 text-cream/80">
                  <p className="flex justify-between"><span>Email ID:</span> <strong className="text-gold truncate max-w-[160px]">{bearer.email}</strong></p>
                  <p className="flex justify-between"><span>Contact:</span> <strong className="text-gold">{bearer.contact}</strong></p>
                  <p className="flex justify-between"><span>Aadhaar Verification:</span> <strong className="font-mono text-emerald-400">{formatMaskedId(bearer.aadhaarNumber)}</strong></p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-navy-2 p-8 rounded-3xl border border-gold/20 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-saffron/15 text-saffron flex items-center justify-center shadow-inner"><Crown size={24} /></div>
                <h3 className="font-display text-xl text-cream font-bold">उच्च श्रेणी सर्वोच्च अधिकार (Supreme Leadership Powers)</h3>
                <p className="text-xs text-cream/70 leading-relaxed font-hindi">
                  श्री राम सेवा समिति के अंतर्गत <strong>{bearer.designationHindi} ({bearer.designation})</strong> पद को संस्था के सर्वोच्च मार्गदर्शन, नीति निर्धारण और कल्याणकारी कार्यों की स्वीकृति का पूर्ण अधिकार प्राप्त है। आपके द्वारा जारी किए गए निर्देश व पोस्ट्स संस्था के सभी सदस्यों व स्वयंसेवकों के लिए सर्वोपरि होते हैं।
                </p>
              </div>

              <div className="bg-navy-2 p-8 rounded-3xl border border-gold/20 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-saffron/15 text-saffron flex items-center justify-center shadow-inner"><Sparkles size={24} /></div>
                <h3 className="font-display text-xl text-cream font-bold">स्वचालित उच्च प्राथमिकता बैज (Automatic High-Priority Badge)</h3>
                <p className="text-xs text-cream/70 leading-relaxed font-hindi">
                  जब आप इस पैनल के माध्यम से Seva, Events, Updates या Gallery में कोई पोस्ट प्रकाशित करते हैं, तो सिस्टम स्वचालित रूप से उस पर <strong>"Samiti Official Leadership Post"</strong> का स्वर्णिम राजकीय बैज जोड़ देता है, जिससे वेबसाइट पर उसकी प्रामाणिकता तुरंत नजर आती है।
                </p>
              </div>

              <div className="bg-navy-2 p-8 rounded-3xl border border-gold/20 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-saffron/15 text-saffron flex items-center justify-center shadow-inner"><ShieldCheck size={24} /></div>
                <h3 className="font-display text-xl text-cream font-bold">सुरक्षा एवं रिकॉर्ड प्रबंधन (Secure Record Management)</h3>
                <p className="text-xs text-cream/70 leading-relaxed font-hindi">
                  यह डिजिटल नियंत्रण कक्ष पूर्णतः एन्क्रिप्टेड है। आप किसी भी समय अपने प्रकाशित किए गए रिकॉर्ड्स को मैनेज कर सकते हैं। आपके समस्त कार्य समिति के केंद्रीय डेटाबेस में सुरक्षित रूप से संरक्षित किए जाते हैं।
                </p>
              </div>
            </div>
          </div>
        )}

        {['seva', 'events', 'updates', 'gallery'].includes(activeTab) && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            <div className="w-full bg-navy-2 p-6 md:p-8 rounded-3xl border border-gold/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
              <div>
                <h2 className="font-display text-2xl text-saffron font-bold capitalize flex items-center gap-2">
                  <Crown size={22} /> {activeTab} Management Dashboard
                </h2>
                <p className="text-xs text-cream/60 mt-1 font-hindi">
                  श्री राम सेवा समिति के अंतर्गत सभी आधिकारिक {activeTab} रिकॉर्ड्स यहाँ प्रबंधित किए जाते हैं।
                </p>
              </div>

              <button onClick={startCreate} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy font-bold text-xs shadow-lg transition-all cursor-pointer">
                <PlusCircle size={18} /> Add New {activeTab === 'updates' ? 'Notice' : activeTab.slice(0, -1)}
              </button>
            </div>

            <div className="w-full bg-navy-2 p-6 md:p-8 rounded-3xl border border-gold/20 space-y-6 shadow-xl">
              <h3 className="text-xs font-bold text-gold uppercase tracking-widest border-b border-gold/15 pb-3">Existing {activeTab.toUpperCase()} Records</h3>
              
              {fetchingList ? (
                <div className="py-20 text-center text-xs text-cream/50 flex items-center justify-center gap-3">
                  <Loader2 size={20} className="animate-spin text-saffron" /> Loading database records...
                </div>
              ) : itemsList.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {itemsList.map((item) => {
                    const itemId = item._id || item.id;
                    const liveStatus = activeTab === 'events' ? getEventStatus(item) : null;
const isOngoing = liveStatus === 'ongoing';
                    return (
                      <div key={itemId} className="w-full p-5 rounded-2xl bg-navy border border-gold/20 hover:border-gold/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all shadow-md">
                        <div className="flex items-center gap-5 min-w-0">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-navy-2 border border-gold/30 shrink-0 shadow-inner">
                            {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-saffron text-base font-bold">🏛️</div>}
                          </div>
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-saffron bg-saffron/10 px-2.5 py-0.5 rounded border border-saffron/20 inline-block">
                                {item.date ? item.date.split('T')[0] : 'Official Post'}
                              </span>
                              {liveStatus && (
  <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${isOngoing ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-gold/10 text-gold'}`}>
    {liveStatus}
  </span>
)}
                            </div>
                            <h4 className="text-base font-bold text-cream font-hindi truncate">{item.title || item.titleHindi}</h4>
                            <p className="text-xs text-cream/60 line-clamp-1 font-hindi">{item.description || item.shortExcerpt}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end pt-3 md:pt-0 border-t border-gold/10 md:border-0">
                        <button onClick={() => startEdit(item)} className="p-2.5 rounded-xl bg-saffron/10 text-saffron hover:bg-saffron hover:text-navy cursor-pointer transition-all shadow-sm" title="Edit Record">
  <Edit3 size={16} />
</button>
                          <button onClick={() => handleDeletePost(item)} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer transition-all shadow-sm" title="Delete Record">
                           
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center text-xs text-cream/50">No records found in this section. Click "Add New" button above to publish your first post.</div>
              )}
            </div>

          </div>
        )}

      </main>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/85 backdrop-blur-md px-4 py-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative bg-navy-2 border border-gold/35 p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            
            <button onClick={() => setShowAddModal(false)} className="absolute top-5 right-5 text-cream/60 hover:text-saffron transition-colors cursor-pointer">
              <X size={22} />
            </button>

            <div>
                            <h3 className="font-display text-xl text-cream font-bold">
                {activeTab === 'seva' && `${editingId ? 'Edit' : 'Add New'} Seva Card`}
                {activeTab === 'events' && `${editingId ? 'Edit' : 'Add New'} Event`}
                {activeTab === 'updates' && (editingId ? 'Edit Notice' : 'Publish New Notice')}
                {activeTab === 'gallery' && (editingId ? 'Edit Gallery Photo' : 'Add Photo to Gallery')}
              </h3>
              <p className="text-xs text-gold/80 mt-1 font-hindi">Publishing as: {bearer.nameHindi}</p>
            </div>

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-4">
              
              {activeTab === 'seva' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">Category</label>
                      <input type="text" value={category || 'RELIGIOUS'} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none focus:border-saffron" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">Select Icon</label>
                      <select value={selectIcon} onChange={(e) => setSelectIcon(e.target.value)} className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none focus:border-saffron cursor-pointer">
                        <option value="Join Hand / Prarthana (Default)">Join Hand / Prarthana (Default)</option>
                        <option value="Food / Annadan (Utensils)">Food / Annadan (Utensils)</option>
                        <option value="Yagya / Puja (Flame)">Yagya / Puja (Flame)</option>
                        <option value="Water / Jal Seva (Droplet)">Water / Jal Seva (Droplet)</option>
                        <option value="Environment / Tree (Sprout)">Environment / Tree (Sprout)</option>
                        <option value="Education / Vidya (Book)">Education / Vidya (Book)</option>
                        <option value="Care / Medical (Heart)">Care / Medical (Heart)</option>
                        <option value="Special / Utsav (Sparkles)">Special / Utsav (Sparkles)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">Title in Hindi</label>
                      <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="धार्मिक सेवा" className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none font-hindi" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">English Title</label>
                      <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Religious Service" className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-cream/80 uppercase">Description</label>
                    <textarea rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Service description..." className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none font-hindi resize-none" />
                  </div>
                </>
              )}

              {activeTab === 'events' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-cream/80 uppercase">Event Title</label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="राम नवमी महोत्सव" className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none font-hindi" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">Category</label>
                      <input type="text" value={category || 'RELIGIOUS'} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">Date</label>
                      <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none [color-scheme:dark]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase flex items-center gap-1">
                        <Clock size={12} className="text-saffron" /> Start Time
                      </label>
                      <input
                        type="time"
                        required
                        value={eventStartTime}
                        onChange={(e) => setEventStartTime(e.target.value)}
                        className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase flex items-center gap-1">
                        <Clock size={12} className="text-saffron" /> End Time
                      </label>
                      <input
                        type="time"
                        required
                        value={eventEndTime}
                        onChange={(e) => setEventEndTime(e.target.value)}
                        className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-cream/80 uppercase">Location</label>
                    <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="श्री राम मंदिर प्रांगण" className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none font-hindi" />
                  </div>
                </>
              )}

              {activeTab === 'updates' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-cream/80 uppercase">Notice Title *</label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="वार्षिक साधारण सभा की सूचना" className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none font-hindi" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">Category</label>
                      <select value={category || 'NOTICE'} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none cursor-pointer">
                        <option value="NOTICE">NOTICE</option>
                        <option value="UPDATE">UPDATE</option>
                        <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">Publish Date</label>
                      <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none [color-scheme:dark]" />
                    </div>
                  </div>

            

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-cream/80 uppercase">Full Description *</label>
                    <textarea rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="विस्तृत विवरण..." className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none font-hindi resize-none" />
                  </div>
                </>
              )}

              {activeTab === 'gallery' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-cream/80 uppercase">Photo Title / Caption</label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="श्री राम जन्मोत्सव शोभायात्रा" className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none font-hindi" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">Category</label>
                      <select value={category || 'FESTIVAL'} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none cursor-pointer">
                        <option value="FESTIVAL">FESTIVAL</option>
                        <option value="SEVA">SEVA</option>
                        <option value="MEETING">MEETING</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-cream/80 uppercase">Date</label>
                      <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 bg-navy border border-gold/25 rounded-xl text-cream text-xs outline-none [color-scheme:dark]" />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-semibold text-cream/80 uppercase">Card Image / Banner</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-navy border border-gold/25 hover:border-saffron rounded-xl text-cream text-xs cursor-pointer transition-all">
                    <Upload size={16} className="text-saffron" />
                    <span className="truncate font-semibold">{imageUrl ? 'File Chosen' : 'Choose file'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {imageUrl && (
                    <button type="button" onClick={() => setImageUrl('')} className="px-3 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold shrink-0">
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {uploadingImage && (
                <div className="text-xs text-saffron flex items-center gap-1.5 py-1">
                  <Loader2 size={14} className="animate-spin" /> Uploading image...
                </div>
              )}

              {imageUrl && (
                <div className="flex items-center gap-3 pt-1 bg-navy p-3 rounded-xl border border-gold/15">
                  <img src={imageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-saffron" />
                  <span className="text-xs text-emerald-400 font-bold">Image attached!</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-3 border-t border-gold/15">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-xl bg-navy border border-gold/25 text-cream font-bold text-xs hover:border-gold/50 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={loading || uploadingImage} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
                                    {loading ? <span>Saving...</span> : <><Save size={16} /><span>{editingId ? 'Update' : 'Publish'}</span></>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/85 backdrop-blur-md px-4">
          <div className="relative bg-navy-2 border border-gold/30 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <LogOut size={28} />
            </div>
            <div>
              <h3 className="text-xl text-cream font-display font-bold">Confirm Session Logout?</h3>
              <p className="text-xs text-cream/60 mt-2 font-hindi">क्या आप वास्तव में पदाधिकारी नियंत्रण कक्ष से बाहर निकलना चाहते हैं?</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 px-5 py-3 rounded-2xl bg-navy border border-gold/20 text-cream text-xs font-bold cursor-pointer">No, Stay</button>
              <button onClick={handleLogout} className="flex-1 px-5 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold cursor-pointer">Yes, Logout</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function HeartHandshakeIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/>
      <path d="m18 15-2-2"/>
      <path d="m15 18-2-2"/>
    </svg>
  );
}