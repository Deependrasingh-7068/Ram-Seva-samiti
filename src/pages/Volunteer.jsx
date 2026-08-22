import React, { useState } from 'react';
import { 
  ShieldCheck, UploadCloud, Loader2, CheckCircle2, Search, 
  Download, Copy, Check, Phone, ArrowRight, AlertCircle, RefreshCw,
  Clock, Hourglass, XCircle, CreditCard
} from 'lucide-react';
import VolunteerIdCard from '../components/VolunteerIdCard';

export default function Volunteer() {
  const [tab, setTab] = useState('register'); // 'register' | 'download'

  // Registration Form State
  const [nameHindi, setNameHindi] = useState('');
  const [nameEnglish, setNameEnglish] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState(''); // Mandatory 12 Digits
  const [dob, setDob] = useState(''); // Format: DDMMYYYY
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [photo, setPhoto] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [registeredVolunteer, setRegisteredVolunteer] = useState(null);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [copied, setCopied] = useState(false);

  // Download Verification State (Aadhaar / ID + DOB)
  const [loginId, setLoginId] = useState('');
  const [loginDob, setLoginDob] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Cloudinary Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const CLOUD_NAME = 'dp2fkeyok';
    const UPLOAD_PRESET = 'ShreeRamSewaSamiti-Images';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    setUploading(true);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setPhoto(data.secure_url);
      }
    } catch {
      alert('Photo upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Submit Application
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const cleanAadhaar = aadhaarNumber.replace(/\D/g, '').trim();
    const cleanDob = dob.replace(/\D/g, '').trim();
    const cleanPhone = phone.replace(/\D/g, '').trim();

    if (cleanAadhaar.length !== 12) {
      alert('कृपया 12 अंकों का वैध आधार नंबर दर्ज करें।');
      setSubmitting(false);
      return;
    }

    if (cleanDob.length !== 8) {
      alert('कृपया 8 अंकों की जन्मतिथि (DDMMYYYY) दर्ज करें।');
      setSubmitting(false);
      return;
    }

    const payload = {
      nameHindi: nameHindi.trim(),
      nameEnglish: nameEnglish.trim(),
      aadhaarNumber: cleanAadhaar,
      dob: cleanDob,
      phone: cleanPhone,
      email: email.trim(),
      address: address.trim(),
      bloodGroup: bloodGroup.trim() || 'N/A',
      photo,
    };

    try {
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/volunteers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.volunteer) {
        setRegisteredVolunteer(data.volunteer);
        setIsExistingUser(Boolean(data.isExisting));

        window.dispatchEvent(
          new CustomEvent('samiti_new_notification', {
            detail: {
              section: 'volunteer',
              message: data.isExisting 
                ? `Existing Volunteer: ${nameHindi} (${data.volunteer.volunteerId})`
                : `New Volunteer Application: ${nameHindi} (${data.volunteer.volunteerId})`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          })
        );
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      alert(err.message || 'Server connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  // Verify Credentials for Download
  const handleVerifyDownload = async (e) => {
    e.preventDefault();
    setSearching(true);
    setSearchError('');
    setSearchResult(null);

    const cleanInput = loginId.trim();
    const cleanDob = loginDob.replace(/\D/g, '').trim();

    if (!cleanInput) {
      setSearchError('कृपया आधार नंबर या Volunteer ID दर्ज करें।');
      setSearching(false);
      return;
    }

    if (cleanDob.length !== 8) {
      setSearchError('कृपया 8 अंकों की सही जन्मतिथि (DDMMYYYY) दर्ज करें।');
      setSearching(false);
      return;
    }

    try {
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/volunteers/verify-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: cleanInput,
          dob: cleanDob,
        }),
      });

      const data = await res.json();
      if (data.success && data.volunteer) {
        setSearchResult(data.volunteer);
      } else {
        setSearchError(data.message || 'Invalid Aadhaar / Volunteer ID or Date of Birth. Details not found.');
      }
    } catch {
      setSearchError('Server connection error. Please verify backend server is running.');
    } finally {
      setSearching(false);
    }
  };

  const handleCopyId = () => {
    if (!registeredVolunteer?.volunteerId) return;
    navigator.clipboard.writeText(registeredVolunteer.volunteerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetForm = () => {
    setNameHindi('');
    setNameEnglish('');
    setAadhaarNumber('');
    setDob('');
    setPhone('');
    setEmail('');
    setAddress('');
    setBloodGroup('');
    setPhoto('');
    setRegisteredVolunteer(null);
    setIsExistingUser(false);
  };

  return (
    <div className="pt-28 pb-20 bg-navy min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Page Header */}
        <header className="text-center max-w-xl mx-auto mb-8">
          <p className="font-hindi text-lg text-saffron mb-1">श्री राम सेवा समिति</p>
          <h1 className="font-display text-3xl md:text-4xl text-cream font-bold">Volunteer Portal</h1>
          <p className="text-xs text-cream/60 mt-2">
            समिति से जुड़ें, समाज सेवा में योगदान दें और अपना डिजिटल पहचान पत्र (ID Card) प्राप्त करें।
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => { 
                setTab('register'); 
                setSearchResult(null); 
                setSearchError('');
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                tab === 'register' ? 'bg-saffron text-navy shadow-lg' : 'bg-navy-2 text-cream/70 border border-gold/20'
              }`}
            >
              Join as Volunteer (नया आवेदन)
            </button>
            <button
              onClick={() => { 
                setTab('download'); 
                setSearchResult(null); 
                setSearchError('');
                setRegisteredVolunteer(null); 
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                tab === 'download' ? 'bg-saffron text-navy shadow-lg' : 'bg-navy-2 text-cream/70 border border-gold/20'
              }`}
            >
              Download ID Card (पहचान पत्र डाउनलोड)
            </button>
          </div>
        </header>

        {/* ================= TAB 1: JOIN AS VOLUNTEER ================= */}
        {tab === 'register' && (
          <div>
            {registeredVolunteer ? (
              <div className="bg-navy-2 border border-gold/30 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 shadow-inner">
                  <CheckCircle2 size={36} />
                </div>

                <div className="space-y-2">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${
                    isExistingUser 
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
                      : 'bg-saffron/15 text-saffron border-gold/20'
                  }`}>
                    {isExistingUser ? 'Already Registered Volunteer' : 'Application Submitted to Admin'}
                  </span>

                  <h2 className="font-hindi text-2xl sm:text-3xl text-cream font-bold pt-1">
                    {isExistingUser 
                      ? 'आप पहले से पंजीकृत (Registered) हैं!' 
                      : 'आवेदन सफलतापूर्वक जमा हो गया है!'}
                  </h2>
                  <p className="text-xs text-cream/70 leading-relaxed max-w-md mx-auto">
                    प्रिय <b>{registeredVolunteer.nameHindi || registeredVolunteer.nameEnglish}</b>, 
                    {isExistingUser 
                      ? ' आपका आधार नंबर डेटाबेस में पहले से मौजूद है। आपकी निर्धारित पहचान संख्या (Volunteer ID) नीचे दी गई है।'
                      : ' आपका स्वयंसेवक आवेदन समिति के एडमिन पैनल पर समीक्षा के लिए भेज दिया गया है।'}
                  </p>
                </div>

                <div className="bg-navy border-2 border-dashed border-gold/40 rounded-2xl p-5 space-y-3 shadow-inner">
                  <p className="text-xs uppercase font-semibold tracking-wider text-gold/90">
                    Assigned Volunteer ID (पहचान संख्या)
                  </p>
                  
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-saffron tracking-wider bg-navy-2 px-4 py-2 rounded-xl border border-gold/30 select-all">
                      {registeredVolunteer.volunteerId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="p-2.5 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                      title="Copy Volunteer ID"
                    >
                      {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-amber-300/90 font-medium">
                    ⚠️ <b>कृपया अपनी Volunteer ID नोट कर लें।</b> कार्ड डाउनलोड करने के लिए आप अपने 12-अंकों के आधार नंबर और जन्मतिथि (DOB) का उपयोग कर सकते हैं।
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full sm:flex-1 py-3 rounded-xl bg-navy border border-gold/25 text-cream hover:bg-navy-2 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={14} /> Submit Another Form
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginId(registeredVolunteer.aadhaarNumber || registeredVolunteer.volunteerId);
                      setLoginDob(registeredVolunteer.dob || '');
                      setTab('download');
                      setRegisteredVolunteer(null);
                    }}
                    className="w-full sm:flex-1 py-3 rounded-xl bg-saffron hover:bg-saffron-deep text-navy font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Check Card Status / Download <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              /* REGISTRATION INPUT FORM */
              <div className="bg-navy-2 border border-gold/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">पूरा नाम (हिंदी में) *</label>
                      <input
                        type="text"
                        value={nameHindi}
                        onChange={(e) => setNameHindi(e.target.value)}
                        placeholder="राहुल कुमार"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron font-hindi"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Full Name (English)</label>
                      <input
                        type="text"
                        value={nameEnglish}
                        onChange={(e) => setNameEnglish(e.target.value)}
                        placeholder="Rahul Kumar"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Mandatory Unique Aadhaar Input */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1 flex items-center gap-1">
                        <CreditCard size={12} className="text-saffron" /> आधार नंबर (12 Digits) *
                      </label>
                      <input
                        type="text"
                        maxLength="12"
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="12-digit Aadhaar Number"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron font-mono tracking-wider"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Date of Birth (DDMMYYYY) *</label>
                      <input
                        type="text"
                        maxLength="8"
                        value={dob}
                        onChange={(e) => setDob(e.target.value.replace(/\D/g, ''))}
                        placeholder="10032004"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">मोबाइल नंबर (WhatsApp) *</label>
                      <input
                        type="tel"
                        maxLength="10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9123456789"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">Blood Group (Optional)</label>
                      <input
                        type="text"
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        placeholder="B+ / O+"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gold/80 ml-1">ईमेल पता (Optional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul@gmail.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">पूरा पता (Address) *</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows="2"
                      placeholder="रामपुर, पोस्ट – माधोगंज, जनपद – हरदोई, उत्तर प्रदेश – 241302"
                      className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron resize-none font-hindi"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gold/80 ml-1">पासपोर्ट साइज फोटो (Cloudinary) *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-xs text-cream/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-saffron file:text-navy hover:file:bg-saffron-deep cursor-pointer"
                      required={!photo}
                    />
                    {uploading && (
                      <p className="text-[10px] text-saffron flex items-center gap-1 mt-1">
                        <Loader2 size={12} className="animate-spin" /> Uploading photo...
                      </p>
                    )}
                    {photo && (
                      <div className="mt-2 flex items-center gap-3">
                        <img src={photo} alt="Preview" className="w-12 h-14 rounded-lg object-cover border border-gold/40 shadow-md" />
                        <span className="text-xs text-emerald-400 font-medium">Photo Attached Successfully</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="w-full py-3 rounded-xl bg-saffron hover:bg-saffron-deep text-navy font-bold text-xs shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                    {submitting ? 'Submitting Application...' : 'Submit Application & Get SRSS Volunteer ID'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: DOWNLOAD ID CARD ================= */}
        {tab === 'download' && (
          <div className="space-y-6">
            <div className="bg-navy-2 border border-gold/20 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-lg mx-auto">
              <h3 className="font-display text-lg text-cream font-bold text-center mb-1">
                Volunteer ID Card Verification & Download
              </h3>
              <p className="text-xs text-cream/60 text-center mb-4">
                Enter your 12-digit Aadhaar Number & continuous DOB to access your card.
              </p>

              <form onSubmit={handleVerifyDownload} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gold/80 ml-1">आधार नंबर (Aadhaar) या Volunteer ID *</label>
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="12-digit Aadhaar or SRSS202684801"
                    className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gold/80 ml-1">Date of Birth (Password format: DDMMYYYY) *</label>
                  <input
                    type="text"
                    maxLength="8"
                    value={loginDob}
                    onChange={(e) => setLoginDob(e.target.value.replace(/\D/g, ''))}
                    placeholder="10032004"
                    className="w-full px-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron font-mono"
                    required
                  />
                </div>

                {searchError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center flex items-center justify-center gap-2">
                    <XCircle size={15} />
                    <span>{searchError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={searching}
                  className="w-full py-2.5 rounded-xl bg-saffron hover:bg-saffron-deep text-navy font-bold text-xs shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  {searching ? 'Verifying Credentials...' : 'Search & View ID Card'}
                </button>
              </form>
            </div>

            {/* VERIFICATION RESULT PREVIEW */}
            {searchResult && (
              <div className="bg-navy-2 border border-gold/25 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in fade-in duration-300">
                {searchResult.status === 'ACCEPTED' && (
                  <>
                    <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 py-1.5 px-4 rounded-full border border-emerald-500/20 w-fit mx-auto">
                      <CheckCircle2 size={16} /> Verified Active Volunteer
                    </div>
                    <VolunteerIdCard volunteer={searchResult} />
                  </>
                )}

                {searchResult.status === 'PENDING' && (
                  <div className="py-6 px-4 max-w-lg mx-auto bg-navy border border-amber-500/30 rounded-2xl space-y-4 text-center shadow-lg">
                    <div className="w-14 h-14 bg-amber-500/15 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
                      <Hourglass size={28} className="animate-pulse" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        Status: PENDING (Admin Review Pending)
                      </span>
                      <h4 className="font-hindi text-lg text-cream font-bold pt-2">
                        आपका आवेदन समीक्षा में है
                      </h4>
                    </div>

                    <p className="text-xs text-cream/75 leading-relaxed">
                      समिति के Admin Panel पर आपका आधार विवरण प्राप्त हो चुका है। एडमिन द्वारा स्वीकृत (Accept) होने के 24 घंटे के भीतर आपका ID कार्ड यहाँ उपलब्ध हो जाएगा।
                    </p>
                  </div>
                )}

                {searchResult.status === 'REJECTED' && (
                  <div className="py-6 px-4 max-w-lg mx-auto bg-navy border border-red-500/30 rounded-2xl space-y-3 text-center">
                    <div className="w-12 h-12 bg-red-500/15 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
                      <XCircle size={24} />
                    </div>
                    <h4 className="font-hindi text-base text-cream font-bold">
                      आवेदन अस्वीकृत (Application Rejected)
                    </h4>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}