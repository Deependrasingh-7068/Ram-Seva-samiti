import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import initialEvents from '../data/events';
import initialGallery from '../data/gallery';
import initialMembers from '../data/members';
import initialSeva from '../data/seva';
import initialUpdates from '../data/updates';
import initialSettings from '../data/settings';

const AdminContext = createContext();
const API_BASE = `${import.meta.env.VITE_API_URL}/api/content`;

function getSafeStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AdminProvider({ children }) {
  const [events, setEvents] = useState(() => getSafeStorage('admin_events', initialEvents));
  const [gallery, setGallery] = useState(() => getSafeStorage('admin_gallery', initialGallery));
  const [members, setMembers] = useState(() => getSafeStorage('admin_members', initialMembers));
  const [seva, setSeva] = useState(() => getSafeStorage('admin_seva', initialSeva));
  const [updates, setUpdates] = useState(() => getSafeStorage('admin_updates', initialUpdates));
  const [settings, setSettings] = useState(() => getSafeStorage('admin_settings', initialSettings));

  const [currentAdmin, setCurrentAdmin] = useState(() => {
    return getSafeStorage('adminInfo', {});
  });

  useEffect(() => {
    const syncAdmin = (e) => {
      if (e?.detail) {
        setCurrentAdmin(e.detail);
      } else {
        setCurrentAdmin(getSafeStorage('adminInfo', {}));
      }
    };
    window.addEventListener('samiti_admin_updated', syncAdmin);
    window.addEventListener('storage', syncAdmin);
    return () => {
      window.removeEventListener('samiti_admin_updated', syncAdmin);
      window.removeEventListener('storage', syncAdmin);
    };
  }, []);

  const adminEmail = (currentAdmin?.email || '').toLowerCase().trim();
  const adminName = (currentAdmin?.name || currentAdmin?.username || '').toLowerCase().trim();
  const adminId = (currentAdmin?._id || currentAdmin?.id || currentAdmin?.adminId || '').toString().trim();

  // Public DB Sync - Real-time Fetch across all components
  const fetchPublicContent = useCallback(async () => {
    try {
      const [galRes, evRes, sevRes, memRes, updRes] = await Promise.all([
        fetch(`${API_BASE}/public-all/gallery`).catch(() => null),
        fetch(`${import.meta.env.VITE_API_URL}/api/events/all`).catch(() => null),
        fetch(`${API_BASE}/public-all/seva`).catch(() => null),
        fetch(`${API_BASE}/public-all/members`).catch(() => null),
        fetch(`${API_BASE}/public-all/updates`).catch(() => null),
      ]);

      const [gal, ev, sev, mem, upd] = await Promise.all([
        galRes && galRes.ok ? galRes.json() : { success: false },
        evRes && evRes.ok ? evRes.json() : { success: false },
        sevRes && sevRes.ok ? sevRes.json() : { success: false },
        memRes && memRes.ok ? memRes.json() : { success: false },
        updRes && updRes.ok ? updRes.json() : { success: false },
      ]);

      if (gal.success && Array.isArray(gal.items)) {
        setGallery(gal.items);
        localStorage.setItem('admin_gallery', JSON.stringify(gal.items));
      }
      if (ev.success && Array.isArray(ev.items)) {
        setEvents(ev.items);
        localStorage.setItem('admin_events', JSON.stringify(ev.items));
      }
      if (sev.success && Array.isArray(sev.items)) {
        setSeva(sev.items);
        localStorage.setItem('admin_seva', JSON.stringify(sev.items));
      }
      if (mem.success && Array.isArray(mem.items)) {
        setMembers(mem.items);
        localStorage.setItem('admin_members', JSON.stringify(mem.items));
      }
      if (upd.success && Array.isArray(upd.items)) {
        setUpdates(upd.items);
        localStorage.setItem('admin_updates', JSON.stringify(upd.items));
      }

      window.dispatchEvent(new CustomEvent('samiti_content_refreshed'));
    } catch (err) {
      console.warn('DB offline, using local store:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchPublicContent();
    const handleRealtimeSync = () => fetchPublicContent();

    window.addEventListener('focus', handleRealtimeSync);
    window.addEventListener('samiti_trigger_db_sync', handleRealtimeSync);
    window.addEventListener('storage', handleRealtimeSync);

    return () => {
      window.removeEventListener('focus', handleRealtimeSync);
      window.removeEventListener('samiti_trigger_db_sync', handleRealtimeSync);
      window.removeEventListener('storage', handleRealtimeSync);
    };
  }, [fetchPublicContent]);

  const filterForCurrentAdmin = useCallback((items) => {
    if (!Array.isArray(items)) return [];

    const isSuper = (currentAdmin?.role || '').toUpperCase() === 'SUPERADMIN' || currentAdmin?.isSuperAdmin;
    if (isSuper) return items;

    if (!adminEmail && !adminId && !adminName) return items;

    return items.filter((item) => {
      if (!item) return false;
      const creator = (item.createdBy || '').toLowerCase().trim();
      const author = (item.adminName || '').toLowerCase().trim();
      const creatorAdminId = (item.adminId || '').toString().trim();

      if (adminEmail && creator && creator === adminEmail) return true;
      if (adminId && (creatorAdminId === adminId || creator === adminId)) return true;
      if (adminName && author && (author === adminName || author.includes(adminName) || adminName.includes(author))) return true;

      if (!creator && !creatorAdminId) return true;

      return false;
    });
  }, [adminEmail, adminId, adminName, currentAdmin]);

  const myEvents = useMemo(() => filterForCurrentAdmin(events), [events, filterForCurrentAdmin]);
  const myGallery = useMemo(() => filterForCurrentAdmin(gallery), [gallery, filterForCurrentAdmin]);
  const myMembers = useMemo(() => filterForCurrentAdmin(members), [members, filterForCurrentAdmin]);
  const mySeva = useMemo(() => filterForCurrentAdmin(seva), [seva, filterForCurrentAdmin]);
  const myUpdates = useMemo(() => filterForCurrentAdmin(updates), [updates, filterForCurrentAdmin]);

  const saveItemToDB = async (rawType, item) => {
    const rawNormalized = (rawType || '').toLowerCase().trim();
    const type = rawNormalized === 'member' ? 'members' :
                 rawNormalized === 'event' ? 'events' :
                 rawNormalized === 'update' ? 'updates' : rawNormalized;

    const fallbackId = `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const targetId = item._id || item.id || fallbackId;
    const isMongoId = item._id && String(item._id).length === 24 && !String(item._id).includes('-');

    const activeAdminName = currentAdmin?.name || currentAdmin?.username || item.adminName || 'Admin';
    const activeAdminEmail = (currentAdmin?.email || item.createdBy || '').toLowerCase().trim();
    const activeAdminId = (currentAdmin?._id || currentAdmin?.id || currentAdmin?.adminId || item.adminId || '').toString().trim();

    const localPayload = {
      ...item,
      _id: targetId,
      id: targetId,
      type: type,
      createdBy: activeAdminEmail,
      adminName: activeAdminName,
      adminId: activeAdminId,
      date: item.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    if (type === 'events' || type === 'event') {
      setEvents((prev) => {
        const next = [localPayload, ...(prev || []).filter((e) => (e?._id || e?.id) !== targetId)];
        localStorage.setItem('admin_events', JSON.stringify(next));
        return next;
      });
    } else if (type === 'updates' || type === 'update') {
      setUpdates((prev) => {
        const next = [localPayload, ...(prev || []).filter((u) => (u?._id || u?.id) !== targetId)];
        localStorage.setItem('admin_updates', JSON.stringify(next));
        return next;
      });
    } else if (type === 'seva') {
      setSeva((prev) => {
        const next = [localPayload, ...(prev || []).filter((s) => (s?._id || s?.id) !== targetId)];
        localStorage.setItem('admin_seva', JSON.stringify(next));
        return next;
      });
    } else if (type === 'gallery') {
      setGallery((prev) => {
        const next = [localPayload, ...(prev || []).filter((g) => (g?._id || g?.id) !== targetId)];
        localStorage.setItem('admin_gallery', JSON.stringify(next));
        return next;
      });
    } else if (type === 'members' || type === 'member') {
      setMembers((prev) => {
        const next = [localPayload, ...(prev || []).filter((m) => (m?._id || m?.id) !== targetId)];
        localStorage.setItem('admin_members', JSON.stringify(next));
        return next;
      });
    }

    const { _id, id, ...backendPayload } = item;
    const finalBackendData = {
      ...backendPayload,
      type: type,
      createdBy: activeAdminEmail,
      adminName: activeAdminName,
      adminId: activeAdminId,
      date: item.date || new Date().toISOString().split('T')[0],
    };

    try {
      if (type === 'events' || type === 'event') {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalBackendData),
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.item && resData.item._id) {
            setEvents((prev) => {
              const next = (prev || []).map((e) => ((e?._id || e?.id) === targetId ? resData.item : e));
              localStorage.setItem('admin_events', JSON.stringify(next));
              return next;
            });
          }
        }
      } else {
        if (isMongoId) {
          await fetch(`${API_BASE}/update/${item._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalBackendData),
          });
        } else {
          const res = await fetch(`${API_BASE}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalBackendData),
          });

          if (res.ok) {
            const resData = await res.json();
            if (resData.item && resData.item._id) {
              if (type === 'updates' || type === 'update') {
                setUpdates((prev) => {
                  const next = (prev || []).map((u) => ((u?._id || u?.id) === targetId ? resData.item : u));
                  localStorage.setItem('admin_updates', JSON.stringify(next));
                  return next;
                });
              } else if (type === 'members' || type === 'member') {
                setMembers((prev) => {
                  const next = (prev || []).map((m) => ((m?._id || m?.id) === targetId ? resData.item : m));
                  localStorage.setItem('admin_members', JSON.stringify(next));
                  return next;
                });
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('Backend DB offline/error:', e.message);
    }

    window.dispatchEvent(new CustomEvent('samiti_trigger_db_sync'));
  };

  const deleteItemFromDB = async (rawType, targetId) => {
    if (!targetId) return;

    const rawNormalized = (rawType || '').toLowerCase().trim();
    const type = rawNormalized === 'member' ? 'members' :
                 rawNormalized === 'event' ? 'events' :
                 rawNormalized === 'update' ? 'updates' : rawNormalized;

    if (type === 'events' || type === 'event') {
      setEvents((prev) => {
        const next = (prev || []).filter((e) => (e?._id || e?.id) !== targetId);
        localStorage.setItem('admin_events', JSON.stringify(next));
        return next;
      });
    } else if (type === 'updates' || type === 'update') {
      setUpdates((prev) => {
        const next = (prev || []).filter((u) => (u?._id || u?.id) !== targetId);
        localStorage.setItem('admin_updates', JSON.stringify(next));
        return next;
      });
    } else if (type === 'seva') {
      setSeva((prev) => {
        const next = (prev || []).filter((s) => (s?._id || s?.id) !== targetId);
        localStorage.setItem('admin_seva', JSON.stringify(next));
        return next;
      });
    } else if (type === 'gallery') {
      setGallery((prev) => {
        const next = (prev || []).filter((g) => (g?._id || g?.id) !== targetId);
        localStorage.setItem('admin_gallery', JSON.stringify(next));
        return next;
      });
    } else if (type === 'members' || type === 'member') {
      setMembers((prev) => {
        const next = (prev || []).filter((m) => (m?._id || m?.id) !== targetId);
        localStorage.setItem('admin_members', JSON.stringify(next));
        return next;
      });
    }

    try {
      if (String(targetId).length === 24 && !String(targetId).includes('-')) {
        const deleteUrl = type === 'events' || type === 'event'
          ? `${import.meta.env.VITE_API_URL}/api/events/delete/${targetId}`
          : `${API_BASE}/delete/${targetId}`;
        await fetch(deleteUrl, { method: 'DELETE' });
      }
    } catch (e) {
      console.error('Delete from DB failed:', e);
    }

    window.dispatchEvent(new CustomEvent('samiti_trigger_db_sync'));
  };

  return (
    <AdminContext.Provider
      value={{
        events,
        gallery,
        members,
        seva,
        updates,
        settings,
        myEvents,
        myGallery,
        myMembers,
        mySeva,
        myUpdates,
        saveItemToDB,
        deleteItemFromDB,
        currentAdmin,
        fetchPublicContent,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);