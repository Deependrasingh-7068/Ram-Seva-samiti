import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useLocation } from 'react-router-dom';
import { 
  Plus, Trash2, Edit2, HeartHandshake, Calendar, X, MapPin, Clock, 
  Loader2, Image as ImageIcon, Flame, Utensils, Droplet, Sprout, 
  BookOpen, HandHeart, Heart, Sparkles, ImagePlus, Users, 
  BellRing, UserCheck, ShieldCheck, CheckCircle2, XCircle, Search, Lock
} from 'lucide-react';

const SEVA_ICONS = [
  { id: 'hand-heart', label: 'Join Hand / Prarthana (Default)', icon: HandHeart },
  { id: 'utensils', label: 'Food / Annadan (Utensils)', icon: Utensils },
  { id: 'flame', label: 'Yagya / Puja (Flame)', icon: Flame },
  { id: 'droplet', label: 'Water / Jal Seva (Droplet)', icon: Droplet },
  { id: 'sprout', label: 'Environment / Tree (Sprout)', icon: Sprout },
  { id: 'book-open', label: 'Education / Vidya (Book)', icon: BookOpen },
  { id: 'heart', label: 'Care / Medical (Heart)', icon: Heart },
  { id: 'sparkles', label: 'Special / Utsav (Sparkles)', icon: Sparkles },
];

const GALLERY_CATEGORIES = ['ALL', 'FESTIVAL', 'SEVA', 'TEMPLE', 'COMMUNITY'];

// Allowed multiple-person member roles with Hindi mapping
const ALLOWED_MEMBER_ROLES = [
  { english: 'Vice President', hindi: 'उपाध्यक्ष' },
  { english: 'Secretary', hindi: 'सचिव' },
  { english: 'Organization Secretary', hindi: 'संगठन मंत्री' },
  { english: 'Joint Secretary', hindi: 'संयुक्त सचिव' },
  { english: 'Executive Member', hindi: 'कार्यकारिणी सदस्य' },
  { english: 'Senior Member', hindi: 'वरिष्ठ सदस्य' },
  { english: 'Member', hindi: 'सदस्य' },
  { english: 'Volunteer', hindi: 'स्वयंसेवक' }
];

function getInitialLetter(nameHindi, nameEnglish) {
  if (nameEnglish && nameEnglish.trim().length > 0) {
    return nameEnglish.trim().charAt(0).toUpperCase();
  }
  if (nameHindi && nameHindi.trim().length > 0) {
    return nameHindi.trim().charAt(0);
  }
  return 'R';
}

function formatDescription(desc) {
  if (!desc || typeof desc !== 'string') return '';
  const trimmed = desc.trim().replace(/^["“']+|["”']+$/g, '');
  return `“${trimmed}”`;
};

// Helper to mask Aadhar (show only last 6 digits)
const getMaskedAadhar = (val) => {
  if (!val) return '******000000';
  const clean = val.toString().replace(/\D/g, '');
  if (clean.length <= 6) return '******' + clean;
  return '*'.repeat(Math.max(0, clean.length - 6)) + clean.slice(-6);
};

export default function AdminDashboard() {
  const { 
    mySeva = [], 
    myEvents = [], 
    myGallery = [], 
    myMembers = [], 
    myUpdates = [], 
    saveItemToDB, 
    deleteItemFromDB,
    currentAdmin
  } = useAdmin();

  const displaySeva = mySeva;
  const displayEvents = myEvents;
  const displayGallery = myGallery;
  const displayMembers = myMembers;
  const displayUpdates = myUpdates;

  const loggedAdminName = currentAdmin?.name || currentAdmin?.username || 'Admin';
  const loggedAdminEmail = (currentAdmin?.email || '').toLowerCase().trim();
  
  const isSuperAdmin = (currentAdmin?.role || '').toUpperCase() === 'SUPERADMIN' || currentAdmin?.isSuperAdmin;

  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const activeSection = pathSegments[pathSegments.length - 1] === 'admin' ? 'dashboard' : pathSegments[pathSegments.length - 1];

  // ================= SEVA STATES =================
  const [sevaModalOpen, setSevaModalOpen] = useState(false);
  const [editingSeva, setEditingSeva] = useState(null);
  const [sevaTitle, setSevaTitle] = useState('');
  const [sevaCategory, setSevaCategory] = useState('');
  const [sevaSubtitle, setSevaSubtitle] = useState('');
  const [sevaDescription, setSevaDescription] = useState('');
  const [sevaIcon, setSevaIcon] = useState('hand-heart');
  const [sevaImage, setSevaImage] = useState('');

  // ================= EVENT STATES =================
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStatus, setEventStatus] = useState('Upcoming');
  const [eventImage, setEventImage] = useState('');

  // ================= GALLERY STATES =================
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('FESTIVAL');
  const [galleryDate, setGalleryDate] = useState('');
  const [galleryImage, setGalleryImage] = useState('');
  const [galleryFilter, setGalleryFilter] = useState('ALL');

  // ================= MEMBERS STATES =================
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberNameHindi, setMemberNameHindi] = useState('');
  const [memberNameEnglish, setMemberNameEnglish] = useState('');
  const [memberRoleEnglish, setMemberRoleEnglish] = useState('Member');
  const [memberRoleHindi, setMemberRoleHindi] = useState('सदस्य');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberAadhar, setMemberAadhar] = useState('');
  const [memberDob, setMemberDob] = useState('');
  const [memberBio, setMemberBio] = useState('');
  const [memberImage, setMemberImage] = useState('');
  
  // Member Aadhar Security / Eye Toggle / Unlock States
  const [showCreateAadhar, setShowCreateAadhar] = useState(false);
  const [enteredDobCheck, setEnteredDobCheck] = useState('');
  const [isAadharUnlocked, setIsAadharUnlocked] = useState(false);

  // ================= UPDATES / NOTICES STATES =================
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateCategory, setUpdateCategory] = useState('NOTICE');
  const [updateDate, setUpdateDate] = useState('');
  const [updateExcerpt, setUpdateExcerpt] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');

  // ================= VOLUNTEER STATES =================
  const [volunteersList, setVolunteersList] = useState([]);
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [volunteersLoading, setVolunteersLoading] = useState(false);
  const [deleteConfirmVolunteer, setDeleteConfirmVolunteer] = useState(null);

  // ================= DELETE & UPLOAD STATES =================
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ================= FETCH VOLUNTEERS =================
  const fetchVolunteers = async () => {
    try {
      setVolunteersLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/volunteers/all`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.volunteers)) {
          setVolunteersList(data.volunteers);
        }
      }
    } catch {
      const fallback = JSON.parse(localStorage.getItem('samiti_volunteers') || '[]');
      setVolunteersList(fallback);
    } finally {
      setVolunteersLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
    const handleSync = () => fetchVolunteers();
    window.addEventListener('samiti_new_notification', handleSync);
    window.addEventListener('samiti_trigger_db_sync', handleSync);
    return () => {
      window.removeEventListener('samiti_new_notification', handleSync);
      window.removeEventListener('samiti_trigger_db_sync', handleSync);
    };
  }, []);

  const handleUpdateVolunteerStatus = async (id, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/volunteers/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminName: loggedAdminName,
          adminEmail: loggedAdminEmail,
        }),
      });

      if (res.ok) {
        setVolunteersList((prev) =>
          prev.map((v) =>
            v._id === id
              ? {
                  ...v,
                  status,
                  approvedBy: status === 'ACCEPTED' || status === 'REJECTED' ? loggedAdminName : v.approvedBy,
                  approvedByEmail: status === 'ACCEPTED' || status === 'REJECTED' ? loggedAdminEmail : v.approvedByEmail,
                }
              : v
          )
        );
        triggerNotification('volunteer', `Volunteer application status updated to ${status} for ${id}`);
      }
    } catch (err) {
      console.error('Failed to update volunteer status:', err);
    }
  };

  const handlePermanentRemoveVolunteer = async () => {
    if (!deleteConfirmVolunteer) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/volunteers/remove/${deleteConfirmVolunteer._id}`, {
        method: 'DELETE',
      });
      setVolunteersList((prev) => prev.filter((v) => v._id !== deleteConfirmVolunteer._id));
      triggerNotification('volunteer', `Volunteer ${deleteConfirmVolunteer.volunteerId} permanently removed by SuperAdmin`);
      setDeleteConfirmVolunteer(null);
    } catch (err) {
      console.error('Permanent remove failed:', err);
    }
  };

  const triggerNotification = async (section, message) => {
    const notifPayload = {
      section,
      message,
      adminName: loggedAdminName,
      adminEmail: loggedAdminEmail,
      timestamp: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('samiti_notifications') || '[]');
    const localNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...notifPayload,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    
    const updated = [localNotif, ...existing];
    localStorage.setItem('samiti_notifications', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('samiti_new_notification', { detail: localNotif }));

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifPayload),
      });
    } catch {
      // Offline fallback
    }
  };

  const handleImageUpload = async (e, setImageCallback) => {
    const file = e.target.files[0];
    if (!file) return;

    const CLOUD_NAME = 'dp2fkeyok';
    const UPLOAD_PRESET = 'ShreeRamSewaSamiti-Images';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    setUploading(true);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      if (data.secure_url) {
        setImageCallback(data.secure_url);
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      alert(`Image upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleOpenAddSeva = () => {
    setEditingSeva(null);
    setSevaTitle('');
    setSevaCategory('');
    setSevaSubtitle('');
    setSevaDescription('');
    setSevaIcon('hand-heart');
    setSevaImage('');
    setSevaModalOpen(true);
  };

  const handleOpenEditSeva = (item) => {
    setEditingSeva(item);
    setSevaTitle(item.title || '');
    setSevaCategory(item.category || '');
    setSevaSubtitle(item.subtitle || item.titleEnglish || '');
    setSevaDescription(item.description || '');
    setSevaIcon(item.icon || 'hand-heart');
    setSevaImage(item.image || '');
    setSevaModalOpen(true);
  };

  const handleSaveSeva = async (e) => {
    e.preventDefault();
    const payload = {
      title: sevaTitle,
      category: sevaCategory,
      subtitle: sevaSubtitle,
      titleEnglish: sevaSubtitle,
      description: sevaDescription,
      icon: sevaIcon,
      image: sevaImage,
      adminName: loggedAdminName,
      createdBy: loggedAdminEmail
    };

    if (editingSeva) {
      const targetId = editingSeva._id || editingSeva.id;
      await saveItemToDB('seva', { ...payload, _id: targetId, id: targetId });
      triggerNotification('seva', `Seva activity updated: ${sevaTitle}`);
    } else {
      await saveItemToDB('seva', payload);
      triggerNotification('seva', `New Seva activity added: ${sevaTitle}`);
    }
    setSevaModalOpen(false);
  };

  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setEventTitle('');
    setEventCategory('');
    setEventDate('');
    setEventTime('');
    setEventLocation('');
    setEventStatus('Upcoming');
    setEventImage('');
    setEventModalOpen(true);
  };

  const handleOpenEditEvent = (ev) => {
    setEditingEvent(ev);
    setEventTitle(ev.title || '');
    setEventCategory(ev.category || '');
    setEventDate(ev.date || '');
    setEventTime(ev.time || '');
    setEventLocation(ev.location || '');
    setEventStatus(ev.status || 'Upcoming');
    setEventImage(ev.image || '');
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const payload = {
      title: eventTitle,
      category: eventCategory,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      status: eventStatus,
      image: eventImage,
      adminName: loggedAdminName,
      createdBy: loggedAdminEmail
    };

    if (editingEvent) {
      const targetId = editingEvent._id || editingEvent.id;
      await saveItemToDB('events', { ...payload, _id: targetId, id: targetId });
      triggerNotification('events', `Event details updated: ${eventTitle}`);
    } else {
      await saveItemToDB('events', payload);
      triggerNotification('events', `New event announced: ${eventTitle}`);
    }
    setEventModalOpen(false);
  };

  const handleOpenAddGallery = () => {
    setEditingGallery(null);
    setGalleryTitle('');
    setGalleryCategory('FESTIVAL');
    setGalleryDate(new Date().toISOString().split('T')[0]);
    setGalleryImage('');
    setGalleryModalOpen(true);
  };

  const handleOpenEditGallery = (item) => {
    setEditingGallery(item);
    setGalleryTitle(item.title || '');
    setGalleryCategory(item.category || 'FESTIVAL');
    setGalleryDate(item.date || '');
    setGalleryImage(item.image || '');
    setGalleryModalOpen(true);
  };

  const handleSaveGallery = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: galleryTitle,
        category: galleryCategory,
        date: galleryDate,
        image: galleryImage,
        adminName: loggedAdminName,
        createdBy: loggedAdminEmail
      };

      if (editingGallery) {
        const targetId = editingGallery._id || editingGallery.id;
        await saveItemToDB('gallery', { ...payload, _id: targetId, id: targetId });
        triggerNotification('gallery', `Gallery photo updated: ${galleryTitle}`);
      } else {
        await saveItemToDB('gallery', payload);
        triggerNotification('gallery', `New photo added to gallery: ${galleryTitle}`);
      }
    } catch (err) {
      console.error('Failed to save gallery item:', err);
    } finally {
      setGalleryModalOpen(false);
      setEditingGallery(null);
    }
  };

  const handleOpenAddMember = () => {
    setEditingMember(null);
    setMemberNameHindi('');
    setMemberNameEnglish('');
    setMemberRoleEnglish('Member');
    setMemberRoleHindi('सदस्य');
    setMemberPhone('');
    setMemberEmail('');
    setMemberAadhar('');
    setMemberDob('');
    setMemberBio('');
    setMemberImage('');
    setShowCreateAadhar(false);
    setEnteredDobCheck('');
    setIsAadharUnlocked(false);
    setMemberModalOpen(true);
  };

  const handleOpenEditMember = (m) => {
    setEditingMember(m);
    setMemberNameHindi(m.nameHindi || m.name || m.title || '');
    setMemberNameEnglish(m.nameEnglish || (m.name !== m.nameHindi ? m.name : ''));
    const currentRole = m.roleEnglish || m.role || m.designation || 'Member';
    setMemberRoleEnglish(currentRole);
    const matchedRole = ALLOWED_MEMBER_ROLES.find(r => r.english === currentRole);
    setMemberRoleHindi(m.roleHindi || m.designationHindi || (matchedRole ? matchedRole.hindi : 'सदस्य'));
    setMemberPhone(m.phone || '');
    setMemberEmail(m.email || '');
    setMemberAadhar(m.aadhar || '');
    setMemberDob(m.dob || '');
    setMemberBio(m.bio || m.description || '');
    setMemberImage(m.image || m.photo || '');
    setShowCreateAadhar(false);
    setEnteredDobCheck('');
    setIsAadharUnlocked(false);
    setMemberModalOpen(true);
  };

  const handleRoleChange = (selectedEnglishRole) => {
    setMemberRoleEnglish(selectedEnglishRole);
    const found = ALLOWED_MEMBER_ROLES.find(r => r.english === selectedEnglishRole);
    if (found) {
      setMemberRoleHindi(found.hindi);
    }
  };

  const handleUnlockAadhar = () => {
    if (enteredDobCheck.trim() === (memberDob || '').trim()) {
      setIsAadharUnlocked(true);
    } else {
      alert('गलत जन्मतिथि (DOB)! कृपया सही Date of Birth दर्ज करें।');
    }
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    try {
      const finalNameHindi = (memberNameHindi || '').trim();
      const finalNameEnglish = (memberNameEnglish || '').trim();
      const primaryName = finalNameHindi || finalNameEnglish || 'समिति सदस्य';
      const finalRoleEnglish = memberRoleEnglish || 'Member';
      const finalRoleHindi = memberRoleHindi || 'सदस्य';

      // Security validation: Prevent reserved roles from being submitted from Members Management
      const reservedRoles = ['Patron', 'President', 'General Secretary', 'Treasurer'];
      if (reservedRoles.includes(finalRoleEnglish)) {
        alert('This designation is reserved for Committee Leadership and cannot be assigned from Members Management.');
        return;
      }

      // Required fields check for Aadhar & DOB
      if (!memberAadhar || !memberDob) {
        alert('Aadhar Number and Date of Birth (DOB) are required.');
        return;
      }

      const payload = {
        title: primaryName,
        name: finalNameEnglish || finalNameHindi,
        nameHindi: finalNameHindi || primaryName,
        nameEnglish: finalNameEnglish,
        category: 'MEMBERS',
        roleHindi: finalRoleHindi,
        roleEnglish: finalRoleEnglish,
        role: finalRoleEnglish,
        designation: finalRoleEnglish,
        designationHindi: finalRoleHindi,
        phone: memberPhone,
        email: memberEmail,
        aadhar: memberAadhar,
        dob: memberDob,
        bio: (memberBio || '').trim(),
        description: (memberBio || '').trim(),
        image: memberImage || '',
        photo: memberImage || '',
        adminName: loggedAdminName,
        createdBy: loggedAdminEmail
      };

      if (editingMember) {
        const targetId = editingMember._id || editingMember.id;
        await saveItemToDB('members', { ...payload, _id: targetId, id: targetId });
        triggerNotification('members', `Member updated: ${primaryName}`);
      } else {
        await saveItemToDB('members', payload);
        triggerNotification('members', `New member added: ${primaryName}`);
      }
    } catch (err) {
      console.error('Failed to save member:', err);
    } finally {
      setMemberModalOpen(false);
      setEditingMember(null);
      setMemberNameHindi('');
      setMemberNameEnglish('');
      setMemberRoleEnglish('Member');
      setMemberRoleHindi('सदस्य');
      setMemberPhone('');
      setMemberEmail('');
      setMemberAadhar('');
      setMemberDob('');
      setMemberBio('');
      setMemberImage('');
    }
  };

  const handleOpenAddUpdate = () => {
    setEditingUpdate(null);
    setUpdateTitle('');
    setUpdateCategory('NOTICE');
    setUpdateDate(new Date().toISOString().split('T')[0]);
    setUpdateExcerpt('');
    setUpdateDescription('');
    setUpdateModalOpen(true);
  };

  const handleOpenEditUpdate = (item) => {
    setEditingUpdate(item);
    setUpdateTitle(item.title || '');
    setUpdateCategory(item.category || 'NOTICE');
    setUpdateDate(item.date ? String(item.date).split('T')[0] : new Date().toISOString().split('T')[0]);
    setUpdateExcerpt(item.excerpt || '');
    setUpdateDescription(item.description || item.content || '');
    setUpdateModalOpen(true);
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    try {
      const finalDesc = updateDescription || updateExcerpt;
      const finalExcerpt = updateExcerpt || updateDescription;

      const payload = {
        title: updateTitle,
        category: updateCategory || 'NOTICE',
        date: updateDate || new Date().toISOString().split('T')[0],
        excerpt: finalExcerpt,
        description: finalDesc,
        content: finalDesc,
        slug: updateTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `notice-${Date.now()}`,
        adminName: loggedAdminName,
        createdBy: loggedAdminEmail,
      };

      if (editingUpdate) {
        const targetId = editingUpdate._id || editingUpdate.id;
        await saveItemToDB('updates', { ...payload, _id: targetId, id: targetId });
        triggerNotification('updates', `Notice updated: ${updateTitle}`);
      } else {
        await saveItemToDB('updates', payload);
        triggerNotification('updates', `New notice published: ${updateTitle}`);
      }
    } catch (err) {
      console.error('Failed to save update:', err);
    } finally {
      setUpdateModalOpen(false);
      setEditingUpdate(null);
      setUpdateTitle('');
      setUpdateExcerpt('');
      setUpdateDescription('');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id || deleteTarget._id;
    const targetType = deleteTarget.type === 'event' ? 'events' : deleteTarget.type;

    await deleteItemFromDB(targetType, targetId);
    setDeleteTarget(null);
  };

  const filteredGallery = galleryFilter === 'ALL' 
    ? displayGallery 
    : displayGallery.filter((item) => item.category?.toUpperCase() === galleryFilter);

  const filteredVolunteers = volunteersList.filter((vol) => {
    const query = volunteerSearch.toLowerCase().trim();
    if (!query) return true;
    const nameH = (vol.nameHindi || '').toLowerCase();
    const nameE = (vol.nameEnglish || '').toLowerCase();
    const id = (vol.volunteerId || '').toLowerCase();
    const phone = (vol.phone || '').toLowerCase();

    return (
      nameH.includes(query) ||
      nameE.includes(query) ||
      id.includes(query) ||
      phone.includes(query)
    );
  });

  return (
    <div className="space-y-6 w-full pb-16">

      {/* DASHBOARD WELCOME SECTION WITH RAM MANDIR BACKGROUND */}
      {(activeSection === 'dashboard' || activeSection === '') && (
        <div className="relative w-full h-[90vh] rounded-3xl overflow-hidden border border-gold/25 shadow-2xl flex items-center justify-center p-6 text-center">
          {/* Background Ram Mandir Image with Opacity/Fade */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
            style={{ backgroundImage: `url('https://res.cloudinary.com/dp2fkeyok/image/upload/v1787346508/nddusvge44uofhrls8qs.png')` }}
          />
          {/* Gradient Overlay for Fade Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-transparent" />

          {/* Content Box */}
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-saffron/15 border border-saffron/40 flex items-center justify-center text-saffron shadow-inner animate-pulse">
              <ShieldCheck size={36} />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-gold font-bold">
                Shree Ram Sewa Samiti Portal
              </span>
              <h1 className="font-display text-3xl md:text-5xl text-cream tracking-wide drop-shadow-md font-hindi">
                जय श्री राम
              </h1>
              <h2 className="font-display text-2xl md:text-3xl text-saffron font-bold tracking-wider drop-shadow-md">
                Jai Shree Ram
              </h2>
            </div>

            <p className="text-xs md:text-sm text-cream/80 max-w-lg mx-auto leading-relaxed pt-2">
              Welcome back, <strong className="text-cream">{loggedAdminName}</strong>! You are logged into the secure administrative control panel. Select a management section from the sidebar to proceed.
            </p>
          </div>
        </div>
      )}

      {/* SEVA SECTION */}
      {activeSection === 'seva' && (
        <div className="space-y-6">
          <div className="bg-navy-2 p-6 rounded-2xl border border-gold/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display text-2xl text-saffron flex items-center gap-2">
                <HeartHandshake size={24} /> Seva Activities Management
              </h1>
              <p className="text-xs text-cream/60 mt-1">Add, edit, or remove card details shown on the user Seva page.</p>
            </div>
            <button onClick={handleOpenAddSeva} className="px-4 py-2 rounded-xl bg-saffron text-navy font-semibold text-xs flex items-center gap-2 hover:bg-saffron-deep transition-all cursor-pointer shadow-lg">
              <Plus size={16} /> Add New Seva Card
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displaySeva && displaySeva.length > 0 ? (
              displaySeva.map((item) => {
                const IconObj = SEVA_ICONS.find(i => i.id === item.icon) || SEVA_ICONS[0];
                const ItemIcon = IconObj.icon;
                const itemId = item._id || item.id;
                const author = item.adminName || (item.createdBy ? item.createdBy.split('@')[0] : 'Admin');
                return (
                  <div key={itemId} className="bg-navy-2 rounded-2xl border border-gold/20 flex flex-col justify-between overflow-hidden shadow-xl max-w-sm mx-auto w-full">
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-saffron/10 flex items-center justify-center text-saffron">
                            <ItemIcon size={14} />
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-saffron/15 text-saffron uppercase font-medium tracking-wider">
                            {item.category || 'General'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleOpenEditSeva(item)} className="p-1.5 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors cursor-pointer" title="Edit Card">
                            <Edit2 size={13} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setDeleteTarget({ id: itemId, _id: itemId, type: 'seva', title: item.title })} 
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer" 
                            title="Delete Card"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                       
                      <h3 className="text-base font-display text-cream">{item.title}</h3>
                      <p className="text-[11px] text-gold/80 font-medium">{item.subtitle || item.titleEnglish}</p>
                      <p className="text-xs text-cream/70 line-clamp-3 leading-relaxed">{item.description}</p>

                      {item.image && (
                        <div className="w-full h-28 rounded-xl overflow-hidden border border-gold/15 mt-2">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    {/* Footer without wrap text */}
                    <div className="px-4 py-2.5 border-t border-gold/10 bg-navy/40 flex items-center justify-between text-[11px] text-cream/70 whitespace-nowrap">
                      <span className="truncate">श्री राम सेवा समिति</span>
                      <span className="font-semibold text-saffron truncate ml-2">
                        By Admin: {author}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-xs text-cream/50 bg-navy-2 rounded-2xl border border-gold/10">
                No Seva activities found for your account.
              </div>
            )}
          </div>

          {sevaModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm px-4">
              <div className="bg-navy-2 border border-gold/25 p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
                <button onClick={() => setSevaModalOpen(false)} className="absolute top-5 right-5 text-cream/60 hover:text-saffron transition-colors cursor-pointer">
                  <X size={22} />
                </button>
                <h3 className="font-display text-xl text-cream">{editingSeva ? 'Edit Seva Card' : 'Add New Seva Card'}</h3>
                 
                <form onSubmit={handleSaveSeva} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Category</label>
                      <input type="text" value={sevaCategory} onChange={(e) => setSevaCategory(e.target.value)} placeholder="RELIGIOUS" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" required />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Select Icon</label>
                      <select 
                        value={sevaIcon} 
                        onChange={(e) => setSevaIcon(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron cursor-pointer"
                      >
                        {SEVA_ICONS.map((ic) => (
                          <option key={ic.id} value={ic.id}>{ic.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">Title in Hindi</label>
                    <input type="text" value={sevaTitle} onChange={(e) => setSevaTitle(e.target.value)} placeholder="धार्मिक सेवा" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">Subtitle / English Title</label>
                    <input type="text" value={sevaSubtitle} onChange={(e) => setSevaSubtitle(e.target.value)} placeholder="Religious Service" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">Description</label>
                    <textarea value={sevaDescription} onChange={(e) => setSevaDescription(e.target.value)} rows="3" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron resize-none" required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">Card Image (Cloudinary)</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setSevaImage)} className="w-full text-xs text-cream/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-saffron file:text-navy hover:file:bg-saffron-deep cursor-pointer" />
                    {uploading && <p className="text-[10px] text-saffron flex items-center gap-1 mt-1"><Loader2 size={12} className="animate-spin" /> Uploading to Cloudinary...</p>}
                    {sevaImage && (
                      <div className="mt-2 flex items-center gap-2">
                        <img src={sevaImage} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-gold/20" />
                        <button type="button" onClick={() => setSevaImage('')} className="text-[10px] text-red-400 hover:underline">Remove Image</button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    {editingSeva && (
                      <button 
                        type="button" 
                        onClick={() => setDeleteTarget({ id: editingSeva._id || editingSeva.id, type: 'seva', title: sevaTitle })}
                        className="py-2.5 px-4 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Delete Card"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                    <button type="button" onClick={() => setSevaModalOpen(false)} className="flex-1 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs font-semibold cursor-pointer">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-saffron hover:bg-saffron-deep text-navy text-xs font-semibold shadow-lg cursor-pointer">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EVENTS SECTION */}
      {activeSection === 'events' && (
        <div className="space-y-6">
          <div className="bg-navy-2 p-6 rounded-2xl border border-gold/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display text-2xl text-saffron flex items-center gap-2">
                <Calendar size={24} /> Events Management
              </h1>
              <p className="text-xs text-cream/60 mt-1">Manage upcoming and past events shown on the user Events page.</p>
            </div>
            <button onClick={handleOpenAddEvent} className="px-4 py-2 rounded-xl bg-saffron text-navy font-semibold text-xs flex items-center gap-2 hover:bg-saffron-deep transition-all cursor-pointer shadow-lg">
              <Plus size={16} /> Add New Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayEvents && displayEvents.length > 0 ? (
              displayEvents.map((ev) => {
                const eventId = ev._id || ev.id;
                return (
                  <div key={eventId} className="bg-navy-2 rounded-2xl border border-gold/20 flex flex-col justify-between overflow-hidden shadow-xl">
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-saffron/15 text-saffron uppercase font-medium tracking-wider">
                          {ev.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleOpenEditEvent(ev)} className="p-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors cursor-pointer" title="Edit Event">
                            <Edit2 size={14} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setDeleteTarget({ id: eventId, _id: eventId, type: 'events', title: ev.title })} 
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer" 
                            title="Delete Event"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                       
                      <h3 className="text-lg font-display text-cream">{ev.title}</h3>
                       
                      <div className="space-y-1 text-xs text-cream/75 pt-1">
                        <p className="flex items-center gap-1.5"><Calendar size={13} className="text-saffron" /> {ev.date}</p>
                        <p className="flex items-center gap-1.5"><Clock size={13} className="text-saffron" /> {ev.time}</p>
                        <p className="flex items-center gap-1.5"><MapPin size={13} className="text-saffron" /> {ev.location}</p>
                      </div>

                      {ev.image ? (
                        <div className="w-full h-36 rounded-xl overflow-hidden border border-gold/15 mt-3">
                          <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-full h-24 rounded-xl border border-dashed border-gold/20 flex items-center justify-center text-xs text-cream/40 mt-3 gap-2">
                          <ImageIcon size={16} /> No Image Uploaded
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-xs text-cream/50 bg-navy-2 rounded-2xl border border-gold/10">
                No events found for your account.
              </div>
            )}
          </div>

          {eventModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm px-4">
              <div className="bg-navy-2 border border-gold/25 p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
                <button onClick={() => setEventModalOpen(false)} className="absolute top-5 right-5 text-cream/60 hover:text-saffron transition-colors cursor-pointer">
                  <X size={22} />
                </button>
                <h3 className="font-display text-xl text-cream">{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>

                <form onSubmit={handleSaveEvent} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">Event Title</label>
                    <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="राम नवमी महोत्सव" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Category</label>
                      <input type="text" value={eventCategory} onChange={(e) => setEventCategory(e.target.value)} placeholder="RELIGIOUS" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Status</label>
                      <select value={eventStatus} onChange={(e) => setEventStatus(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron cursor-pointer">
                        <option value="Upcoming">Upcoming</option>
                        <option value="Past">Past</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Date</label>
                      <input 
                        type="date" 
                        value={eventDate} 
                        onChange={(e) => setEventDate(e.target.value)} 
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron cursor-pointer [color-scheme:dark]" 
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Time</label>
                      <input type="text" value={eventTime} onChange={(e) => setEventTime(e.target.value)} placeholder="प्रातः 6:00 बजे" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" required />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">Location</label>
                    <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="श्री राम मंदिर प्रांगण" className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">Event Banner (Cloudinary)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, setEventImage)} 
                      className="w-full text-xs text-cream/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-saffron file:text-navy hover:file:bg-saffron-deep cursor-pointer" 
                    />
                    {uploading && <p className="text-[10px] text-saffron flex items-center gap-1 mt-1"><Loader2 size={12} className="animate-spin" /> Uploading to Cloudinary...</p>}
                    {eventImage && (
                      <div className="mt-2 flex items-center gap-2">
                        <img src={eventImage} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-gold/20" />
                        <button type="button" onClick={() => setEventImage('')} className="text-[10px] text-red-400 hover:underline">Remove Image</button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    {editingEvent && (
                      <button 
                        type="button" 
                        onClick={() => setDeleteTarget({ id: editingEvent._id || editingEvent.id, type: 'events', title: eventTitle })}
                        className="py-2.5 px-4 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                    <button type="button" onClick={() => setEventModalOpen(false)} className="flex-1 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs font-semibold cursor-pointer">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-saffron hover:bg-saffron-deep text-navy text-xs font-semibold shadow-lg cursor-pointer">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GALLERY SECTION */}
      {activeSection === 'gallery' && (
        <div className="space-y-6">
          <div className="bg-navy-2 p-6 rounded-2xl border border-gold/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display text-2xl text-saffron flex items-center gap-2">
                <ImagePlus size={24} /> Gallery Management
              </h1>
              <p className="text-xs text-cream/60 mt-1">Upload and organize pictures for the public Gallery page.</p>
            </div>
            <button 
              onClick={handleOpenAddGallery} 
              className="px-4 py-2 rounded-xl bg-saffron text-navy font-semibold text-xs flex items-center gap-2 hover:bg-saffron-deep transition-all cursor-pointer shadow-lg"
            >
              <Plus size={16} /> Add Photo
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setGalleryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  galleryFilter === cat
                    ? 'bg-saffron text-navy font-semibold'
                    : 'bg-navy-2 border border-gold/20 text-cream/70 hover:border-gold/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredGallery && filteredGallery.length > 0 ? (
              filteredGallery.map((item) => {
                const galleryId = item._id || item.id;
                return (
                  <div key={galleryId} className="bg-navy-2 rounded-2xl border border-gold/20 overflow-hidden shadow-xl flex flex-col justify-between group">
                    <div className="relative aspect-[4/3] bg-navy overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-cream/40">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <span className="absolute top-2.5 left-2.5 text-[10px] px-2 py-0.5 rounded-full bg-navy/80 backdrop-blur-md text-saffron uppercase font-semibold border border-gold/20">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-semibold text-cream truncate">{item.title}</h3>
                      {item.date && (
                        <p className="text-[11px] text-cream/50 flex items-center gap-1">
                          <Calendar size={12} className="text-saffron" /> {item.date}
                        </p>
                      )}

                      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gold/10">
                        <button 
                          onClick={() => handleOpenEditGallery(item)} 
                          className="p-1.5 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors cursor-pointer" 
                          title="Edit Photo"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => setDeleteTarget({ id: galleryId, _id: galleryId, type: 'gallery', title: item.title })} 
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer" 
                          title="Delete Photo"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-xs text-cream/50 bg-navy-2 rounded-2xl border border-gold/10">
                No images found for your account.
              </div>
            )}
          </div>

          {galleryModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm px-4">
              <div className="bg-navy-2 border border-gold/25 p-7 rounded-3xl max-w-md w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
                <button onClick={() => setGalleryModalOpen(false)} className="absolute top-5 right-5 text-cream/60 hover:text-saffron transition-colors cursor-pointer">
                  <X size={20} />
                </button>
                <h3 className="font-display text-xl text-cream">{editingGallery ? 'Edit Gallery Item' : 'Add Photo to Gallery'}</h3>

                <form onSubmit={handleSaveGallery} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">Photo Title / Caption</label>
                    <input 
                      type="text" 
                      value={galleryTitle} 
                      onChange={(e) => setGalleryTitle(e.target.value)} 
                      placeholder="श्री राम जन्मोत्सव शोभायात्रा" 
                      className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" 
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Category</label>
                      <select 
                        value={galleryCategory} 
                        onChange={(e) => setGalleryCategory(e.target.value)} 
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron cursor-pointer"
                      >
                        <option value="FESTIVAL">FESTIVAL</option>
                        <option value="SEVA">SEVA</option>
                        <option value="TEMPLE">TEMPLE</option>
                        <option value="COMMUNITY">COMMUNITY</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Date</label>
                      <input 
                        type="date" 
                        value={galleryDate} 
                        onChange={(e) => setGalleryDate(e.target.value)} 
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron cursor-pointer [color-scheme:dark]" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">Upload Photo (Cloudinary)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, setGalleryImage)} 
                      className="w-full text-xs text-cream/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-saffron file:text-navy hover:file:bg-saffron-deep cursor-pointer" 
                      required={!galleryImage}
                    />
                    {uploading && <p className="text-[10px] text-saffron flex items-center gap-1 mt-1"><Loader2 size={12} className="animate-spin" /> Uploading to Cloudinary...</p>}
                    {galleryImage && (
                      <div className="mt-2 relative w-full h-36 rounded-xl overflow-hidden border border-gold/20">
                        <img src={galleryImage} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setGalleryImage('')} className="absolute top-2 right-2 p-1 rounded-full bg-navy/80 text-red-400 hover:bg-navy text-[10px]">Remove</button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    {editingGallery && (
                      <button 
                        type="button" 
                        onClick={() => setDeleteTarget({ id: editingGallery._id || editingGallery.id, type: 'gallery', title: galleryTitle })}
                        className="py-2.5 px-4 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Delete Photo"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                    <button type="button" onClick={() => setGalleryModalOpen(false)} className="flex-1 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs font-semibold cursor-pointer">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-saffron hover:bg-saffron-deep text-navy text-xs font-semibold shadow-lg cursor-pointer">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MEMBERS SECTION */}
      {activeSection === 'members' && (
        <div className="space-y-6">
          <div className="bg-navy-2 p-6 rounded-2xl border border-gold/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display text-2xl text-saffron flex items-center gap-2">
                <Users size={24} /> Members Management
              </h1>
              <p className="text-xs text-cream/60 mt-1">Add, edit, or remove committee members displayed on the Members page.</p>
            </div>
            <button 
              onClick={handleOpenAddMember} 
              className="px-4 py-2 rounded-xl bg-saffron text-navy font-semibold text-xs flex items-center gap-2 hover:bg-saffron-deep transition-all cursor-pointer shadow-lg"
            >
              <Plus size={16} /> Add Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayMembers && displayMembers.length > 0 ? (
              displayMembers.map((m) => {
                const memberId = m._id || m.id;
                const memberName = m.nameHindi || m.name || m.title || '';
                const memberEnglishName = m.nameEnglish || (m.name !== m.nameHindi ? m.name : '');
                const memberBioText = m.bio || m.description || '';
                const authorName = m.adminName || (m.createdBy ? m.createdBy.split('@')[0] : 'Admin');
                const initial = getInitialLetter(memberName, memberEnglishName);

                return (
                  <div key={memberId} className="bg-navy-2 rounded-2xl border border-gold/20 p-5 flex flex-col justify-between overflow-hidden shadow-xl space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full border border-gold/40 p-0.5 flex items-center justify-center bg-navy flex-shrink-0">
                          {(m.image || m.photo) && (m.image || m.photo).trim().length > 0 ? (
                            <img src={m.image || m.photo} alt={memberName} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <div className="w-full h-full rounded-full bg-saffron/15 text-saffron font-display text-xl font-bold flex items-center justify-center uppercase">
                              {initial}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-cream font-hindi">{memberName}</h3>
                          {memberEnglishName && (
                            <p className="text-[11px] text-gold/80 font-medium">{memberEnglishName}</p>
                          )}
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-saffron/15 text-saffron uppercase font-semibold mt-1 inline-block">
                            {m.roleEnglish || m.role || m.designation || 'Member'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => handleOpenEditMember(m)} 
                          className="p-1.5 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors cursor-pointer" 
                          title="Edit Member"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setDeleteTarget({ id: memberId, _id: memberId, type: 'members', title: memberName })} 
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer" 
                          title="Delete Member"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {memberBioText && (
                      <p className="text-xs text-cream/70 font-hindi line-clamp-2 leading-relaxed italic">
                        "{memberBioText}"
                      </p>
                    )}

                    <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-[10px] text-cream/50">
                      <span>Posted by: <b className="text-gold/80">{authorName}</b></span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-xs text-cream/50 bg-navy-2 rounded-2xl border border-gold/10">
                No members found for your account.
              </div>
            )}
          </div>

          {memberModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm px-4">
              <div className="bg-navy-2 border border-gold/25 p-7 rounded-3xl max-w-xl w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
                <button onClick={() => setMemberModalOpen(false)} className="absolute top-5 right-5 text-cream/60 hover:text-saffron transition-colors cursor-pointer">
                  <X size={20} />
                </button>
                <h3 className="font-display text-xl text-cream">{editingMember ? 'Edit Member Profile' : 'Add New Member'}</h3>

                <form onSubmit={handleSaveMember} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Name (Hindi) *</label>
                      <input 
                        type="text" 
                        value={memberNameHindi} 
                        onChange={(e) => setMemberNameHindi(e.target.value)} 
                        placeholder="श्री रामेश्वर तिवारी" 
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" 
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Name (English)</label>
                      <input 
                        type="text" 
                        value={memberNameEnglish} 
                        onChange={(e) => setMemberNameEnglish(e.target.value)} 
                        placeholder="Rameshwar Tiwari" 
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" 
                      />
                    </div>
                  </div>

                  {/* Controlled Role / Designation Dropdown without reserved leadership roles */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">Role / Designation *</label>
                    <select
                      value={memberRoleEnglish}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron cursor-pointer"
                      required
                    >
                      {ALLOWED_MEMBER_ROLES.map((role) => (
                        <option key={role.english} value={role.english}>
                          {role.english} ({role.hindi})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Contact Number</label>
                      <input 
                        type="text" 
                        value={memberPhone} 
                        onChange={(e) => setMemberPhone(e.target.value)} 
                        placeholder="10-digit mobile number" 
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        value={memberEmail} 
                        onChange={(e) => setMemberEmail(e.target.value)} 
                        placeholder="email@example.com" 
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Date of Birth (DOB) */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Date of Birth (DOB) *</label>
                      <input 
                        type="date" 
                        value={memberDob} 
                        onChange={(e) => setMemberDob(e.target.value)} 
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron cursor-pointer [color-scheme:dark]" 
                        required 
                      />
                    </div>

                    {/* Aadhar Number with Create Eye Toggle / Edit Lock Logic */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Aadhar Number *</label>
                      {editingMember ? (
                        <div>
                          {isAadharUnlocked ? (
                            <input 
                              type="text" 
                              value={memberAadhar} 
                              onChange={(e) => setMemberAadhar(e.target.value)} 
                              className="w-full px-4 py-2 rounded-xl bg-navy border border-gold/40 text-cream text-xs outline-none focus:border-saffron" 
                            />
                          ) : (
                            <div className="flex items-center justify-between bg-navy/80 border border-gold/20 rounded-xl px-3 py-2 text-cream/70 text-xs">
                              <span>🔒 {getMaskedAadhar(memberAadhar)}</span>
                              <span className="text-[9px] text-saffron font-semibold bg-saffron/10 px-2 py-0.5 rounded">Locked</span>
                            </div>
                          )}

                          {!isAadharUnlocked && (
                            <div className="mt-2 flex items-center gap-2">
                              <input 
                                type="date" 
                                value={enteredDobCheck} 
                                onChange={(e) => setEnteredDobCheck(e.target.value)} 
                                className="bg-navy border border-gold/30 rounded px-2 py-1 text-xs text-cream [color-scheme:dark]" 
                                placeholder="Enter DOB to unlock"
                              />
                              <button 
                                type="button" 
                                onClick={handleUnlockAadhar}
                                className="px-3 py-1 bg-saffron text-navy text-xs font-bold rounded hover:bg-saffron-deep transition-colors cursor-pointer"
                              >
                                Unlock
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          <input 
                            type={showCreateAadhar ? "text" : "password"} 
                            value={memberAadhar} 
                            onChange={(e) => setMemberAadhar(e.target.value)} 
                            placeholder="Enter 12-digit number" 
                            className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron pr-14" 
                            required 
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowCreateAadhar(!showCreateAadhar)}
                            className="absolute right-3 top-2.5 text-xs text-cream/60 hover:text-saffron cursor-pointer font-medium"
                          >
                            {showCreateAadhar ? "Hide" : "Show"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">Short Bio / Introduction (UI Only)</label>
                    <textarea 
                      value={memberBio} 
                      onChange={(e) => setMemberBio(e.target.value)} 
                      rows="2" 
                      placeholder="समिति के संस्थापक सदस्यों में से एक..." 
                      className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron resize-none" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">Member Photo (Cloudinary - Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, setMemberImage)} 
                      className="w-full text-xs text-cream/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-saffron file:text-navy hover:file:bg-saffron-deep cursor-pointer" 
                    />
                    {uploading && <p className="text-[10px] text-saffron flex items-center gap-1 mt-1"><Loader2 size={12} className="animate-spin" /> Uploading to Cloudinary...</p>}
                    {memberImage && (
                      <div className="mt-2 flex items-center gap-3">
                        <img src={memberImage} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-gold/30" />
                        <button type="button" onClick={() => setMemberImage('')} className="text-xs text-red-400 hover:underline">Remove Photo</button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    {editingMember && (
                      <button 
                        type="button" 
                        onClick={() => setDeleteTarget({ id: editingMember._id || editingMember.id, type: 'members', title: memberNameHindi || memberNameEnglish })}
                        className="py-2.5 px-4 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Delete Member"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                    <button type="button" onClick={() => setMemberModalOpen(false)} className="flex-1 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs font-semibold cursor-pointer">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-saffron hover:bg-saffron-deep text-navy text-xs font-semibold shadow-lg cursor-pointer">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* UPDATES & NOTICES SECTION */}
      {activeSection === 'updates' && (
        <div className="space-y-6">
          <div className="bg-navy-2 p-6 rounded-2xl border border-gold/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display text-2xl text-saffron flex items-center gap-2">
                <BellRing size={24} /> Notices & Updates Management
              </h1>
              <p className="text-xs text-cream/60 mt-1">Publish circulars, announcements, and important updates for users.</p>
            </div>
            <button 
              onClick={handleOpenAddUpdate} 
              className="px-4 py-2 rounded-xl bg-saffron text-navy font-semibold text-xs flex items-center gap-2 hover:bg-saffron-deep transition-all cursor-pointer shadow-lg"
            >
              <Plus size={16} /> Publish New Notice
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayUpdates && displayUpdates.length > 0 ? (
              displayUpdates.map((item) => {
                const updateId = item._id || item.id;
                const author = item.adminName || (item.createdBy ? item.createdBy.split('@')[0] : 'Admin');
                const rawDesc = item.description || item.content || item.excerpt;

                return (
                  <div key={updateId} className="group bg-navy-2 rounded-2xl border border-gold/20 p-5 flex flex-col justify-between overflow-hidden shadow-xl h-[250px] relative">
                    <div className="flex flex-col min-h-0">
                      <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-saffron/15 text-saffron uppercase tracking-widest border border-gold/20">
                          {item.category || 'NOTICE'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => handleOpenEditUpdate(item)} 
                            className="p-1.5 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors cursor-pointer" 
                            title="Edit Notice"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setDeleteTarget({ id: updateId, _id: updateId, type: 'updates', title: item.title })} 
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer" 
                            title="Delete Notice"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-base font-display text-cream font-semibold truncate shrink-0 mb-1.5">{item.title}</h3>
                       
                      {rawDesc && (
                        <div className="relative w-full h-16 shrink-0">
                          <div className="h-full overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            <p className="text-xs text-cream/70 leading-relaxed italic break-words">
                              {formatDescription(rawDesc)}
                            </p>
                          </div>
                          <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-navy-2 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-300" />
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gold/10 flex items-center justify-between text-[11px] shrink-0">
                      {item.date ? (
                        <div className="flex items-center gap-1.5 text-cream/55">
                          <Calendar size={12} className="text-saffron shrink-0" />
                          <span>{item.date}</span>
                        </div>
                      ) : <div />}

                      <span className="flex items-center gap-1 text-gold font-medium bg-saffron/10 px-2 py-0.5 rounded-md border border-gold/20 text-[10px]">
                        <UserCheck size={11} className="text-saffron shrink-0" /> By: {author}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-xs text-cream/50 bg-navy-2 rounded-2xl border border-gold/10">
                No notices published by your account.
              </div>
            )}
          </div>

          {updateModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm px-4">
              <div className="bg-navy-2 border border-gold/25 p-7 rounded-3xl max-w-lg w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                  <div>
                    <h3 className="font-display text-xl text-cream">{editingUpdate ? 'Edit Notice' : 'Publish New Notice'}</h3>
                    <p className="text-xs text-gold/80 mt-0.5 flex items-center gap-1">
                      <UserCheck size={12} className="text-saffron" /> Publishing as: {loggedAdminName}
                    </p>
                  </div>
                  <button onClick={() => setUpdateModalOpen(false)} className="text-cream/60 hover:text-saffron transition-colors cursor-pointer">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveUpdate} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">Notice / Update Title (शीर्षक) *</label>
                    <input 
                      type="text" 
                      value={updateTitle} 
                      onChange={(e) => setUpdateTitle(e.target.value)} 
                      placeholder="वार्षिक साधारण सभा की सूचना" 
                      className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" 
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Category</label>
                      <select 
                        value={updateCategory} 
                        onChange={(e) => setUpdateCategory(e.target.value)} 
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron cursor-pointer"
                      >
                        <option value="NOTICE">NOTICE</option>
                        <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                        <option value="SEVA">SEVA</option>
                        <option value="EDUCATION">EDUCATION</option>
                        <option value="EVENT">EVENT</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Publish Date</label>
                      <input 
                        type="date" 
                        value={updateDate} 
                        onChange={(e) => setUpdateDate(e.target.value)} 
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron cursor-pointer [color-scheme:dark]" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">Short Excerpt (संक्षिप्त विवरण)</label>
                    <input 
                      type="text" 
                      value={updateExcerpt} 
                      onChange={(e) => setUpdateExcerpt(e.target.value)} 
                      placeholder="कार्ड पर दिखने वाला 1-2 लाइन का संक्षिप्त विवरण" 
                      className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">Full Content / Description (विस्तृत विवरण) *</label>
                    <textarea 
                      value={updateDescription} 
                      onChange={(e) => setUpdateDescription(e.target.value)} 
                      rows="4" 
                      placeholder="समस्त पदाधिकारियों एवं सदस्यों को सूचित किया जाता है कि..." 
                      className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron resize-none" 
                      required 
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    {editingUpdate && (
                      <button 
                        type="button" 
                        onClick={() => setDeleteTarget({ id: editingUpdate._id || editingUpdate.id, type: 'updates', title: updateTitle })}
                        className="py-2.5 px-4 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Delete Notice"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                    <button type="button" onClick={() => setUpdateModalOpen(false)} className="flex-1 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs font-semibold cursor-pointer">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-saffron hover:bg-saffron-deep text-navy text-xs font-semibold shadow-lg cursor-pointer">
                      {editingUpdate ? 'Save Changes' : 'Publish Notice'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VOLUNTEER REQUESTS SECTION */}
      {(activeSection === 'volunteer-requests' || activeSection === 'volunteer') && (
        <div className="space-y-6">
          <div className="bg-navy-2 p-6 rounded-2xl border border-gold/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display text-2xl text-saffron flex items-center gap-2">
                <Users size={24} /> Volunteer Requests
              </h1>
              <p className="text-xs text-cream/60 mt-1">Review incoming volunteer applications. Accept or Reject requests with auto-attribution.</p>
            </div>
             
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
                <input
                  type="text"
                  value={volunteerSearch}
                  onChange={(e) => setVolunteerSearch(e.target.value)}
                  placeholder="Search by Name, ID..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron shadow-inner"
                />
              </div>
              <span className="px-3.5 py-2 bg-saffron/15 text-saffron border border-gold/25 rounded-xl text-xs font-bold font-mono shrink-0">
                {filteredVolunteers.length} Found
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {volunteersLoading ? (
              <div className="py-16 text-center text-xs text-cream/50 flex flex-col items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin text-saffron" />
                Loading volunteer requests...
              </div>
            ) : filteredVolunteers.length > 0 ? (
              filteredVolunteers.map((vol) => {
                const isFrozen = vol.isFrozen; // SuperAdmin freeze flag

                const statusColor = 
                  isFrozen ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                  vol.status === 'ACCEPTED' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                  vol.status === 'REJECTED' ? 'bg-red-500/15 text-red-400 border-red-500/30' :
                  'bg-amber-500/15 text-amber-300 border-amber-500/30';

                const isFinalized = vol.status === 'ACCEPTED' || vol.status === 'REJECTED';
                const isApprovedByMe = vol.approvedBy && vol.approvedBy.toLowerCase() === loggedAdminName.toLowerCase();

                return (
                  <div
                    key={vol._id || vol.volunteerId}
                    className={`bg-navy-2 border rounded-2xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-xl transition-all ${
                      isFrozen 
                        ? 'border-red-500/40 opacity-50 bg-navy/40 grayscale pointer-events-none select-none' 
                        : 'border-gold/20 hover:border-gold/40'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold/40 bg-navy shrink-0 shadow-md relative">
                        {vol.photo ? (
                          <img src={vol.photo} alt={vol.nameHindi} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-cream/40 bg-navy-2">
                            No Photo
                          </div>
                        )}
                        {isFrozen && (
                          <div className="absolute inset-0 bg-red-950/70 flex items-center justify-center text-white font-bold text-[10px]">
                            FROZEN
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-hindi text-base font-bold text-cream leading-tight">
                            {vol.nameHindi}
                          </h3>
                          {vol.nameEnglish && (
                            <span className="text-xs text-cream/60">({vol.nameEnglish})</span>
                          )}
                          <span className="text-[10px] font-mono font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded border border-gold/20">
                            {vol.volunteerId}
                          </span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase border flex items-center gap-1 ${statusColor}`}>
                            {isFrozen && <Lock size={10} />}
                            {isFrozen ? 'FROZEN BY SUPERADMIN' : (vol.status || 'PENDING')}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-cream/75 flex-wrap">
                          <span>Phone: <b className="text-cream">{vol.phone}</b></span>
                          <span>DOB: <b className="font-mono text-saffron">{vol.dob}</b></span>
                          {vol.bloodGroup && vol.bloodGroup !== 'N/A' && (
                            <span>Blood Group: <b className="text-cream">{vol.bloodGroup}</b></span>
                          )}
                        </div>

                        <p className="text-xs text-cream/60 font-hindi line-clamp-1">
                          पता: {vol.address}
                        </p>

                        {vol.approvedBy && (
                          <p className="text-[11px] text-gold/80 flex items-center gap-1">
                            <UserCheck size={12} className="text-saffron shrink-0" />
                            {vol.status === 'ACCEPTED' ? 'Approved By:' : 'Rejected By:'}{' '}
                            <b className="text-saffron">
                              {isApprovedByMe ? 'YOU' : vol.approvedBy}
                            </b>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
                      {isFrozen ? (
                        <div className="px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-xs font-semibold text-red-400 flex items-center gap-2">
                          <Lock size={14} />
                          <span>Account Frozen</span>
                        </div>
                      ) : isFinalized ? (
                        <div className="px-4 py-2 rounded-xl bg-navy border border-gold/20 text-xs font-semibold text-gold flex items-center gap-2 shadow-inner">
                          <UserCheck size={14} className="text-saffron" />
                          <span>
                            {vol.status === 'ACCEPTED' ? 'Approved By:' : 'Rejected By:'}{' '}
                            <b className="text-cream">
                              {isApprovedByMe ? 'YOU' : (vol.approvedBy || 'Admin')}
                            </b>
                          </span>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleUpdateVolunteerStatus(vol._id, 'REJECTED')}
                            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                          >
                            <XCircle size={14} /> Reject
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUpdateVolunteerStatus(vol._id, 'ACCEPTED')}
                            className="px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white cursor-pointer"
                          >
                            <CheckCircle2 size={14} /> Accept
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center text-xs text-cream/50 bg-navy-2 rounded-2xl border border-gold/10">
                {volunteerSearch ? 'No matching volunteer requests found.' : 'No volunteer requests received yet.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SRSS VOLUNTEERS MASTER LEDGER (SUPERADMIN ONLY) */}
      {activeSection === 'srss-volunteers' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="bg-navy-2 p-6 rounded-2xl border border-gold/15 flex justify-between items-center">
            <div>
              <h1 className="font-display text-2xl text-saffron flex items-center gap-2">
                <ShieldCheck size={24} /> SRSS Volunteers Master Ledger
              </h1>
              <p className="text-xs text-cream/60 mt-1">SuperAdmin permanent records, freeze control, and permanent removal authority.</p>
            </div>
            <span className="px-3.5 py-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold font-mono">
              {volunteersList.filter((v) => v.status === 'ACCEPTED').length} Active Volunteers
            </span>
          </div>

          <div className="space-y-3">
            {volunteersList.map((vol) => {
              const isApprovedByMe = vol.approvedBy && vol.approvedBy.toLowerCase() === loggedAdminName.toLowerCase();
              const isFrozen = vol.isFrozen;

              return (
                <div
                  key={vol._id || vol.volunteerId}
                  className={`bg-navy-2 border rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xl transition-all ${
                    isFrozen ? 'border-red-500/40 opacity-75 bg-navy/50' : 'border-gold/20'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gold/30 bg-navy shrink-0 relative">
                      <img src={vol.photo || '/avatar.png'} alt="" className="w-full h-full object-cover" />
                      {isFrozen && <div className="absolute inset-0 bg-red-600/50 flex items-center justify-center text-[8px] text-white font-bold">FROZEN</div>}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-saffron font-bold text-xs">{vol.volunteerId}</span>
                        <h4 className="font-hindi font-bold text-cream text-sm truncate">{vol.nameHindi}</h4>
                        <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-semibold ${isFrozen ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-saffron/10 text-gold'}`}>
                          {isFrozen ? 'FROZEN' : vol.status}
                        </span>
                      </div>
                      <p className="text-xs text-cream/50 mt-0.5 truncate">
                        Approved By: <b className="text-gold">{isApprovedByMe ? 'YOU' : (vol.approvedBy || 'Pending')}</b> | Mobile: {vol.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* SuperAdmin Freeze / Unfreeze Toggle for Volunteer */}
                    <button
                      type="button"
                      onClick={async () => {
                        const newFreezeState = !isFrozen;
                        try {
                          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/volunteers/freeze/${vol._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ isFrozen: newFreezeState })
                          });
                          const data = await res.json();
                          if (data.success) {
                            setVolunteersList(prev => prev.map(v => v._id === vol._id ? { ...v, isFrozen: newFreezeState } : v));
                          } else {
                            alert(data.message || 'Failed to update volunteer status');
                          }
                        } catch (err) {
                          console.error(err);
                          alert('Error connecting to server');
                        }
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isFrozen 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500 hover:text-white' 
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white'
                      }`}
                      title={isFrozen ? "Unfreeze Volunteer" : "Freeze Volunteer"}
                    >
                      {isFrozen ? <Lock size={13} /> : <Unlock size={13} />}
                      <span>{isFrozen ? 'Frozen' : 'Active'}</span>
                    </button>

                    {/* Permanent Delete Button */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmVolunteer(vol)}
                      className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUPERADMIN VOLUNTEER REMOVE CONFIRMATION MODAL */}
      {deleteConfirmVolunteer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/90 backdrop-blur-sm px-4">
          <div className="bg-navy-2 border border-red-500/30 p-7 rounded-3xl max-w-sm w-full shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
              <Trash2 size={26} />
            </div>
            <div>
              <h3 className="text-lg font-display text-cream font-bold">Remove Volunteer</h3>
              <p className="text-xs text-cream/60 mt-2 leading-relaxed">
                Are you sure you want to permanently remove <b className="text-saffron">{deleteConfirmVolunteer.volunteerId} ({deleteConfirmVolunteer.nameHindi})</b> from the database? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmVolunteer(null)}
                className="flex-1 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePermanentRemoveVolunteer}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg cursor-pointer"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/90 backdrop-blur-sm px-4">
          <div className="bg-navy-2 border border-red-500/30 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={32} />
            </div>
            <div>
              <h3 className="text-lg font-display text-cream">Delete Confirmation</h3>
              <p className="text-xs text-cream/60 mt-2">
                Are you sure you want to delete <span className="text-saffron font-semibold">"{deleteTarget.title || deleteTarget.type}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => setDeleteTarget(null)} 
                className="flex-1 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs font-semibold cursor-pointer" 
              >
                No, Cancel
              </button>
              <button 
                type="button" 
                onClick={confirmDelete} 
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg cursor-pointer" 
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FALLBACK FOR REMAINING SECTIONS */}
      {activeSection !== 'seva' && 
       activeSection !== 'events' && 
       activeSection !== 'gallery' && 
       activeSection !== 'members' && 
       activeSection !== 'updates' && 
       activeSection !== 'dashboard' && 
       activeSection !== 'volunteer-requests' && 
       activeSection !== 'volunteer' && 
       activeSection !== 'srss-volunteers' && (
        <div className="bg-navy-2 p-8 rounded-2xl border border-gold/10 min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-2 text-cream/60">
            <h3 className="text-lg font-medium text-cream capitalize">Managing {activeSection} Section</h3>
            <p className="text-xs">Content management for this section will appear here.</p>
          </div>
        </div>
      )}

    </div>
  );
}