import React, { useRef, useState, useEffect } from 'react';
import { Download, Loader2, Printer } from 'lucide-react';

const LOGO_SRC = '/assets/gallery/ram_sewa_samiti_logo_transparent_1.png';
const LOGO_FALLBACK = '/ram_sewa_samiti_logo_transparent_1.png';

function formatDisplayDob(val) {
  if (!val) return '';
  const digits = String(val).replace(/\D/g, '');
  if (digits.length === 8) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }
  return val;
}

// Pure SVG Golden Ayodhya Mandir Silhouette
function GoldenTempleArtwork() {
  return (
    <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-30">
      <defs>
        <linearGradient id="mandirGlowFixed" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#d97706" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#b45309" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect x="10" y="148" width="380" height="12" fill="url(#mandirGlowFixed)" />
      <rect x="25" y="140" width="350" height="8" fill="url(#mandirGlowFixed)" />
      <rect x="40" y="132" width="320" height="8" fill="url(#mandirGlowFixed)" />
      
      <path d="M200 12 L225 132 L175 132 Z" fill="url(#mandirGlowFixed)" stroke="#FFAE34" strokeWidth="1" />
      <line x1="200" y1="2" x2="200" y2="12" stroke="#FFAE34" strokeWidth="2" />
      <polygon points="200,2 216,7 200,12" fill="#FFAE34" />
      
      <path d="M150 45 L170 132 L130 132 Z" fill="url(#mandirGlowFixed)" stroke="#FFAE34" strokeWidth="0.8" />
      <polygon points="150,38 160,42 150,45" fill="#FFAE34" />
      <path d="M250 45 L270 132 L230 132 Z" fill="url(#mandirGlowFixed)" stroke="#FFAE34" strokeWidth="0.8" />
      <polygon points="250,38 260,42 250,45" fill="#FFAE34" />

      <path d="M100 68 L122 132 L78 132 Z" fill="url(#mandirGlowFixed)" />
      <polygon points="100,62 108,65 100,68" fill="#FFAE34" />
      <path d="M300 68 L322 132 L278 132 Z" fill="url(#mandirGlowFixed)" />
      <polygon points="300,62 308,65 300,68" fill="#FFAE34" />

      <path d="M55 92 L72 132 L38 132 Z" fill="url(#mandirGlowFixed)" />
      <path d="M345 92 L362 132 L328 132 Z" fill="url(#mandirGlowFixed)" />

      {[...Array(19)].map((_, i) => (
        <rect key={i} x={45 + i * 17} y="132" width="4.5" height="16" fill="#FFAE34" opacity="0.6" />
      ))}
    </svg>
  );
}

function GoldFlourishDivider() {
  return (
    <div className="flex items-center justify-center gap-2 my-1 select-none">
      <div className="h-[1.5px] w-12 bg-gradient-to-r from-transparent to-[#e6a838]" />
      <div className="w-1.5 h-1.5 rotate-45 bg-[#f5b338]" />
      <p className="text-[10.5px] font-hindi tracking-widest text-[#f5b338] font-bold px-1" style={{ lineHeight: '1.2' }}>
        सेवा ही परम धर्म
      </p>
      <div className="w-1.5 h-1.5 rotate-45 bg-[#f5b338]" />
      <div className="h-[1.5px] w-12 bg-gradient-to-l from-transparent to-[#e6a838]" />
    </div>
  );
}

function OfficialSamitiStamp() {
  return (
    <div className="relative w-[84px] h-[84px] flex items-center justify-center select-none shrink-0">
      <svg viewBox="0 0 160 160" className="w-full h-full">
        <defs>
          <path id="topTextArcFix" d="M 22,80 A 58,58 0 1,1 138,80" fill="none" />
          <path id="bottomTextArcFix" d="M 138,80 A 58,58 0 0,1 22,80" fill="none" />
        </defs>

        <circle cx="80" cy="80" r="76" stroke="#FFAE34" strokeWidth="2.5" fill="none" />
        <circle cx="80" cy="80" r="71" stroke="#FFAE34" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
        <circle cx="80" cy="80" r="48" stroke="#FFAE34" strokeWidth="1.8" fill="none" />

        <text className="font-hindi font-extrabold fill-[#FFAE34] text-[13.5px] tracking-wider">
          <textPath href="#topTextArcFix" startOffset="50%" textAnchor="middle">
            ★ श्री राम सेवा समिति ★
          </textPath>
        </text>

        <text className="font-hindi font-bold fill-[#FFE29F] text-[12.5px] tracking-widest">
          <textPath href="#bottomTextArcFix" startOffset="50%" textAnchor="middle">
            ❖ उत्तर प्रदेश ❖
          </textPath>
        </text>
      </svg>

      <div className="absolute inset-0 m-auto w-[44px] h-[44px] rounded-full overflow-hidden flex items-center justify-center p-0.5 bg-[#071329] border border-[#f5b338]/60">
        <img 
          src={LOGO_SRC} 
          alt="" 
          className="w-full h-full object-contain filter brightness-110"
          onError={(e) => {
            if (e.target.src !== window.location.origin + LOGO_FALLBACK) {
              e.target.src = LOGO_FALLBACK;
            } else {
              e.target.style.display = 'none';
            }
          }}
        />
      </div>
    </div>
  );
}

export default function VolunteerIdCard({ volunteer }) {
  const cardContainerRef = useRef(null);
  const frontCardRef = useRef(null);
  const backCardRef = useRef(null);
  const printableSheetRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [presidentBearer, setPresidentBearer] = useState(null);

  // Live President ka data fetch karo (Office Bearer panel se jo bhi active President hai)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/office-bearers/all`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.officeBearers)) {
          const found = data.officeBearers.find((b) => b.designation === 'President' && !b.isFrozen);
          if (found) setPresidentBearer(found);
        }
      })
      .catch(() => {});
  }, []);

  if (!volunteer) return null;

  const presidentNameEnglish = presidentBearer?.nameEnglish || presidentBearer?.nameHindi || 'NA';
  const presidentNameHindi = presidentBearer?.nameHindi || 'NA';

  const volunteerId = volunteer.volunteerId || 'SRSS202684801';
  const nameHindi = volunteer.nameHindi || 'राहुल कुमार';
  const nameEnglish = volunteer.nameEnglish || 'Rahul Kumar';
  const roleHindi = volunteer.roleHindi || 'स्वयंसेवक';
  const roleEnglish = volunteer.roleEnglish || 'Volunteer';
  const displayDob = formatDisplayDob(volunteer.dob) || '10/03/2004';
  const phone = volunteer.phone || '9123456789';
  const email = volunteer.email || '';
  const address = volunteer.address || 'रामपुर, पोस्ट – माधोगंज, जनपद – हरदोई, उत्तर प्रदेश – 241302';
  const bloodGroup = volunteer.bloodGroup && volunteer.bloodGroup !== 'N/A' ? volunteer.bloodGroup : 'N/A';
  const membershipSince = volunteer.membershipSince || new Date().toLocaleDateString('en-IN');
  const dateOfIssue = volunteer.dateOfIssue || new Date().toLocaleDateString('en-IN');
  const approvedBy = volunteer.approvedBy || 'Harsh Singh';
  const photoUrl = volunteer.photo || '';

  // Updated QR Data to include complete details and photo link in a clean manner
  const qrDataText = encodeURIComponent(
    JSON.stringify({
      id: volunteerId,
      name: `${nameHindi} (${nameEnglish})`,
      role: roleHindi,
      phone: phone,
      dob: displayDob,
      bloodGroup: bloodGroup,
      address: address,
      photo: photoUrl,
      approvedBy: approvedBy,
      samiti: 'Shree Ram Sewa Samiti',
      status: 'VERIFIED ACTIVE VOLUNTEER',
    })
  );
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrDataText}&bgcolor=ffffff&color=000000`;

  // Ultra-HD PNG Downloader with strict font baseline lock
  const downloadHdCard = async (targetRef, filename) => {
    setDownloading(true);
    try {
      if (document.fonts) {
        await document.fonts.ready;
      }

      if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.body.appendChild(script);
        await new Promise((resolve) => (script.onload = resolve));
      }

      const element = targetRef.current;
      const canvas = await window.html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#071021',
        logging: false,
        onclone: (clonedDoc) => {
          const elements = clonedDoc.querySelectorAll('p, span, h2, b, div');
          elements.forEach((el) => {
            el.style.lineHeight = '1.2';
            el.style.transform = 'translateZ(0)';
          });
        }
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error('HD Download Error:', err);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // ISOLATED CLEAN PRINT HANDLER
  const handlePrintCleanA4 = () => {
    const sheetContent = printableSheetRef.current.innerHTML;
    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'fixed';
    printIframe.style.right = '0';
    printIframe.style.bottom = '0';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    document.body.appendChild(printIframe);

    const doc = printIframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Volunteer_ID_${volunteerId}</title>
          <style>
            @page { size: A4 portrait; margin: 8mm 10mm; }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Devanagari", sans-serif;
              color: #000; background: #fff;
              -webkit-print-color-adjust: exact; print-color-adjust: exact;
            }
            .sheet-container { width: 100%; max-width: 190mm; margin: 0 auto; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .border-box { border: 1.5px solid #000; border-radius: 8px; padding: 10px; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-justify { text-align: justify; }
            .font-bold { font-weight: bold; }
            .font-mono { font-family: monospace; font-weight: bold; }
            .uppercase { text-transform: uppercase; }
            .heading-main { font-size: 20px; font-weight: 900; margin-bottom: 2px; }
            .subheading { font-size: 10px; letter-spacing: 1.5px; font-weight: bold; color: #333; }
            .divider { border-bottom: 1.5px solid #000; margin: 6px 0; }
            .card-title { font-size: 11px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 6px; text-align: center; }
            .field-row { font-size: 10.5px; line-height: 1.4; margin-bottom: 2px; }
            .note-box { border: 1.5px solid #000; border-radius: 8px; padding: 8px 10px; background: #fafafa; margin-top: 10px; }
            .note-title { font-size: 11.5px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 5px; }
            .note-text { font-size: 10px; line-height: 1.45; }
            .terms-title { font-size: 11.5px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 3px; margin-top: 10px; margin-bottom: 5px; }
            .terms-list { font-size: 9.5px; line-height: 1.4; padding-left: 18px; }
            .terms-list li { margin-bottom: 3px; }
            .sign-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 16px; font-size: 10.5px; }
          </style>
        </head>
        <body>
          <div class="sheet-container">${sheetContent}</div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      printIframe.contentWindow.focus();
      printIframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(printIframe);
      }, 1000);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-4 select-none font-sans">
      
      {/* ================= CARD WRAPPER ================= */}
      <div 
        ref={cardContainerRef}
        className="flex flex-col lg:flex-row items-center justify-center gap-8 p-6 bg-[#071021] rounded-[36px] border border-gold/15"
      >
        
        {/* ================= FRONT SIDE ================= */}
        <div 
          ref={frontCardRef}
          className="w-[380px] min-h-[620px] rounded-[32px] relative overflow-hidden bg-gradient-to-b from-[#150d05] via-[#09152b] to-[#040915] border-[2.5px] border-[#d8972e] shadow-[0_18px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between p-5 text-cream"
        >
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-gradient-to-br from-[#ea7e18]/40 via-[#f59e0b]/20 to-transparent blur-2xl pointer-events-none" />
          
          <div className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-0 overflow-hidden">
            <GoldenTempleArtwork />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040915] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 mb-1 rounded-full p-0.5 border border-[#f5b338]/50 bg-[#071329] shadow-[0_0_15px_rgba(245,179,56,0.3)] flex items-center justify-center overflow-hidden">
              <img 
                src={LOGO_SRC} 
                alt="" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  if (e.target.src !== window.location.origin + LOGO_FALLBACK) {
                    e.target.src = LOGO_FALLBACK;
                  } else {
                    e.target.style.display = 'none';
                  }
                }}
              />
            </div>
            <h2 className="font-hindi text-[22px] font-extrabold tracking-wide text-[#f5b338]" style={{ lineHeight: '1.2' }}>
              श्री राम सेवा समिति
            </h2>
            <p className="text-[10px] tracking-[0.24em] uppercase font-bold text-[#fce2a6] font-serif" style={{ lineHeight: '1.2' }}>
              SHREE RAM SEWA SAMITI
            </p>
            <GoldFlourishDivider />
          </div>

          <div className="relative z-10 flex gap-4 items-start mt-2">
            <div className="w-[124px] h-[155px] rounded-[22px] overflow-hidden border-[2.5px] border-[#e8a335] bg-[#071329] p-0.5 shrink-0 shadow-[0_6px_16px_rgba(0,0,0,0.6)] relative">
              {volunteer.photo ? (
                <img
                  src={volunteer.photo}
                  alt=""
                  className="w-full h-full object-cover rounded-[18px]"
                />
              ) : (
                <div className="w-full h-full rounded-[18px] bg-[#0c1e3d] flex flex-col items-center justify-center text-center p-2">
                  <span className="text-3xl">👤</span>
                  <span className="text-[10px] text-[#f5b338] font-hindi mt-1">फोटो उपलब्ध नहीं</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-2 text-left">
              <div>
                <p className="text-[8.5px] uppercase tracking-wider font-bold text-cream/60" style={{ lineHeight: '1.2' }}>VOLUNTEER ID</p>
                <p className="font-mono text-[14px] font-extrabold text-[#f7b73b] tracking-wider" style={{ lineHeight: '1.2' }}>
                  {volunteerId}
                </p>
              </div>

              <div className="flex items-start gap-1.5">
                <span className="text-[#f59e0b] text-xs shrink-0 mt-0.5">👤</span>
                <div className="min-w-0">
                  <p className="text-[8px] uppercase tracking-wider font-semibold text-cream/55" style={{ lineHeight: '1.2' }}>नाम / NAME</p>
                  <p className="font-hindi text-[13.5px] font-bold text-cream mt-0.5" style={{ lineHeight: '1.2' }}>{nameHindi}</p>
                  <p className="text-[11px] font-medium text-cream/80" style={{ lineHeight: '1.2' }}>{nameEnglish}</p>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <span className="text-[#f59e0b] text-xs shrink-0 mt-0.5">🛡️</span>
                <div className="min-w-0">
                  <p className="text-[8px] uppercase tracking-wider font-semibold text-cream/55" style={{ lineHeight: '1.2' }}>पद / ROLE</p>
                  <p className="font-hindi text-[12.5px] font-bold text-saffron mt-0.5" style={{ lineHeight: '1.2' }}>{roleHindi}</p>
                  <p className="text-[10.5px] font-medium text-cream/75" style={{ lineHeight: '1.2' }}>{roleEnglish}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-2 text-[11px] text-cream/90 p-3 rounded-2xl bg-[#071329]/85 border border-gold/20 backdrop-blur-[2px] mt-2">
            {displayDob && (
              <div className="flex items-center justify-between gap-2" style={{ lineHeight: '1.2' }}>
                <span className="flex items-center gap-1.5 text-[10.5px] text-cream/75 font-hindi">
                  <span>📅</span> जन्मतिथि / Date of Birth:
                </span>
                <b className="font-mono text-[11.5px] text-cream">{displayDob}</b>
              </div>
            )}

            <div className="flex items-center justify-between gap-2" style={{ lineHeight: '1.2' }}>
              <span className="flex items-center gap-1.5 text-[10.5px] text-cream/75 font-hindi">
                <span>📞</span> मोबाईल / Mobile:
              </span>
              <b className="font-mono text-[11.5px] text-cream">{phone}</b>
            </div>

            {email && email !== 'N/A' && (
              <div className="flex items-center justify-between gap-2" style={{ lineHeight: '1.2' }}>
                <span className="flex items-center gap-1.5 text-[10.5px] text-cream/75 font-hindi shrink-0">
                  <span>✉️</span> ईमेल / Email:
                </span>
                <span className="font-sans text-[11px] text-cream/90 text-right">{email}</span>
              </div>
            )}

            <div className="flex items-start gap-1.5 pt-0.5 text-left" style={{ lineHeight: '1.3' }}>
              <span className="text-xs shrink-0 mt-0.5">📍</span>
              <p className="text-[10px] text-cream/85 font-hindi">
                <span className="text-cream/60">पता / Address: </span>{address}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-end justify-between pt-2 border-t border-[#f5b338]/30 mt-2">
            <div className="bg-white p-1 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.6)] w-[62px] h-[62px] flex items-center justify-center shrink-0">
              <img src={qrCodeUrl} alt="" className="w-full h-full object-contain" />
            </div>

            <div className="text-center flex flex-col items-center">
              <p className="font-serif italic text-lg font-bold text-[#f5b338] tracking-wider" style={{ lineHeight: '1.2' }}>
                {presidentNameEnglish}
              </p>
              <div className="w-24 h-[1px] bg-[#f5b338]/60 my-0.5" />
              <p className="font-hindi text-[9.5px] font-semibold text-cream" style={{ lineHeight: '1.2' }}>अध्यक्ष के हस्ताक्षर</p>
              <p className="text-[8px] uppercase tracking-widest text-[#f5b338]/80 font-semibold" style={{ lineHeight: '1.2' }}>AUTHORISED SIGNATURE</p>
            </div>
          </div>
        </div>

        {/* ================= BACK SIDE ================= */}
        <div 
          ref={backCardRef}
          className="w-[380px] min-h-[620px] rounded-[32px] relative overflow-hidden bg-gradient-to-b from-[#050f22] via-[#09152b] to-[#120a03] border-[2.5px] border-[#d8972e] shadow-[0_18px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between p-5 text-cream"
        >
          <div className="absolute -right-6 top-10 opacity-10 pointer-events-none w-56 h-56 overflow-hidden">
            <img 
              src={LOGO_SRC} 
              alt="" 
              className="w-full h-full object-contain filter brightness-125"
              onError={(e) => {
                if (e.target.src !== window.location.origin + LOGO_FALLBACK) {
                  e.target.src = LOGO_FALLBACK;
                } else {
                  e.target.style.display = 'none';
                }
              }}
            />
          </div>

          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="w-14 h-14 mb-1 rounded-full p-0.5 border border-[#f5b338]/50 bg-[#071329] shadow-md flex items-center justify-center overflow-hidden">
              <img 
                src={LOGO_SRC} 
                alt="" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  if (e.target.src !== window.location.origin + LOGO_FALLBACK) {
                    e.target.src = LOGO_FALLBACK;
                  } else {
                    e.target.style.display = 'none';
                  }
                }}
              />
            </div>
            <h2 className="font-hindi text-[22px] font-extrabold tracking-wide text-[#f5b338]" style={{ lineHeight: '1.2' }}>
              श्री राम सेवा समिति
            </h2>
            <p className="text-[9.5px] tracking-[0.24em] uppercase font-bold text-[#fce2a6] font-serif" style={{ lineHeight: '1.2' }}>
              SHREE RAM SEWA SAMITI
            </p>
            <GoldFlourishDivider />
          </div>

          <div className="relative z-10 text-center px-1 my-1">
            <p className="font-hindi text-[10.5px] text-cream/90 bg-[#051124]/85 p-2.5 rounded-2xl border border-[#f5b338]/25 shadow-inner" style={{ lineHeight: '1.35' }}>
              यह पहचान पत्र श्री राम सेवा समिति से जुड़े सभी स्वयंसेवकों के लिए जारी किया जाता है। यह कार्ड धारक समिति के उद्देश्यों, गतिविधियों एवं सेवा कार्यों में सक्रिय रूप से सहभागिता करता है।
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-2 text-xs text-left my-1">
            <div className="bg-[#07152d] p-2.5 rounded-2xl border border-[#f5b338]/25 space-y-0.5">
              <div className="flex items-center gap-1 text-[#f5b338] text-[10px] font-hindi font-bold" style={{ lineHeight: '1.2' }}>
                <span>🪪</span>
                <span>सदस्यता संख्या</span>
              </div>
              <p className="text-[8px] uppercase tracking-wider text-cream/50 font-semibold" style={{ lineHeight: '1.2' }}>MEMBERSHIP NO.</p>
              <p className="font-mono font-extrabold text-[#f7b73b] text-[12px] pt-0.5" style={{ lineHeight: '1.2' }}>{volunteerId}</p>
            </div>

            <div className="bg-[#07152d] p-2.5 rounded-2xl border border-[#f5b338]/25 space-y-0.5">
              <div className="flex items-center gap-1 text-[#f5b338] text-[10px] font-hindi font-bold" style={{ lineHeight: '1.2' }}>
                <span>📅</span>
                <span>सदस्यता प्रारंभ तिथि</span>
              </div>
              <p className="text-[8px] uppercase tracking-wider text-cream/50 font-semibold" style={{ lineHeight: '1.2' }}>MEMBERSHIP SINCE</p>
              <p className="font-mono font-bold text-cream text-[12px] pt-0.5" style={{ lineHeight: '1.2' }}>{membershipSince}</p>
            </div>

            <div className="bg-[#07152d] p-2.5 rounded-2xl border border-[#f5b338]/25 space-y-0.5">
              <div className="flex items-center gap-1 text-[#f5b338] text-[10px] font-hindi font-bold" style={{ lineHeight: '1.2' }}>
                <span>🩸</span>
                <span>रक्त समूह</span>
              </div>
              <p className="text-[8px] uppercase tracking-wider text-cream/50 font-semibold" style={{ lineHeight: '1.2' }}>BLOOD GROUP</p>
              <p className="font-mono font-extrabold text-saffron text-[12px] pt-0.5" style={{ lineHeight: '1.2' }}>{bloodGroup}</p>
            </div>

            <div className="bg-[#07152d] p-2.5 rounded-2xl border border-[#f5b338]/25 space-y-0.5">
              <div className="flex items-center gap-1 text-[#f5b338] text-[10px] font-hindi font-bold" style={{ lineHeight: '1.2' }}>
                <span>📆</span>
                <span>जारी करने की तिथि</span>
              </div>
              <p className="text-[8px] uppercase tracking-wider text-cream/50 font-semibold" style={{ lineHeight: '1.2' }}>DATE OF ISSUE</p>
              <p className="font-mono font-bold text-cream text-[12px] pt-0.5" style={{ lineHeight: '1.2' }}>{dateOfIssue}</p>
            </div>
          </div>

          {/* SINGLE-LINE EMERGENCY CONTACT */}
          <div className="relative z-10 bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#ea580c] py-2 px-3.5 rounded-full text-navy flex items-center justify-between shadow-md my-1 select-none">
            <div className="flex items-center gap-1.5 text-[9px] font-hindi font-extrabold tracking-tight shrink-0" style={{ lineHeight: '1.2' }}>
              <span className="text-xs">📞</span>
              <span>आपातकालीन संपर्क / EMERGENCY:</span>
            </div>
            <span className="font-mono text-[12px] font-black text-navy tracking-wider ml-auto shrink-0" style={{ lineHeight: '1.2' }}>
              +91 70681 80049
            </span>
          </div>

          <div className="relative z-10 flex items-center justify-between pt-1.5 border-t border-[#f5b338]/25 text-left mt-0.5">
            <div className="space-y-0.5">
              <p className="font-serif italic text-base font-bold text-[#f5b338]" style={{ lineHeight: '1.2' }}>
                {presidentNameEnglish}
              </p>
              <p className="font-hindi text-[11px] font-bold text-cream pt-0.5" style={{ lineHeight: '1.2' }}>({presidentNameHindi})</p>
              <p className="font-hindi text-[9.5px] text-[#f5b338]/90 font-medium" style={{ lineHeight: '1.2' }}>अध्यक्ष, श्री राम सेवा समिति</p>
              
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded border border-emerald-500/30" style={{ lineHeight: '1.2' }}>
                  ✓ Approved By: <b className="text-cream">{approvedBy}</b>
                </span>
              </div>
            </div>

            <OfficialSamitiStamp />
          </div>

          <div className="-mx-5 -mb-5 bg-gradient-to-r from-[#d97706] via-[#f5b338] to-[#b45309] text-navy py-1.5 px-4 flex items-center justify-between text-[9.5px] font-bold tracking-wider shadow-md mt-2">
            <div className="flex items-center gap-1 font-mono" style={{ lineHeight: '1.2' }}>
              <span>🌐</span>
              <span>www.ramsewasamiti.org</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 font-bold">
                <span>f</span>
                <span>📷</span>
              </div>
              <span className="font-mono font-bold" style={{ lineHeight: '1.2' }}>/ramsewasamiti</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ===================== DOWNLOAD & PRINT ACTION BUTTONS ==================== */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={handlePrintCleanA4}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-navy font-extrabold text-sm shadow-[0_8px_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer flex items-center gap-2 active:scale-95"
        >
          <Printer size={18} />
          <span>Print Official ID Card with Terms & Conditions (1-Page A4)</span>
        </button>

        <button
          onClick={() => downloadHdCard(cardContainerRef, `SRSS-Volunteer-Card-${volunteerId}`)}
          disabled={downloading}
          className="px-5 py-3.5 rounded-2xl bg-navy-2 border border-gold/30 hover:border-saffron text-cream text-xs font-semibold transition-all cursor-pointer flex items-center gap-2"
        >
          {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} className="text-saffron" />}
          <span>Full HD Card (Color)</span>
        </button>

        <button
          onClick={() => downloadHdCard(frontCardRef, `SRSS-Front-${volunteerId}`)}
          disabled={downloading}
          className="px-4 py-3.5 rounded-2xl bg-navy-2 border border-gold/30 hover:border-saffron text-cream text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Download size={14} className="text-saffron" /> Front
        </button>

        <button
          onClick={() => downloadHdCard(backCardRef, `SRSS-Back-${volunteerId}`)}
          disabled={downloading}
          className="px-4 py-3.5 rounded-2xl bg-navy-2 border border-gold/30 hover:border-saffron text-cream text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Download size={14} className="text-saffron" /> Back
        </button>
      </div>

      {/* ================= HIDDEN PRINTABLE TEMPLATE ================= */}
      <div style={{ display: 'none' }}>
        <div ref={printableSheetRef}>
          <div className="text-center">
            <div className="heading-main">श्री राम सेवा समिति</div>
            <div className="subheading">SHREE RAM SEWA SAMITI • UTTAR PRADESH</div>
            <div style={{ fontSize: '10px', marginTop: '2px', fontWeight: 'bold' }}>❖ आधिकारिक स्वयंसेवक पहचान पत्र एवं सेवा नियम ❖</div>
          </div>
          <div className="divider"></div>

          <div className="grid-2">
            <div className="border-box">
              <div className="card-title">पहचान पत्र (FRONT)</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="field-row"><b>Volunteer ID:</b> <span className="font-mono">{volunteerId}</span></div>
                  <div className="field-row"><b>नाम:</b> {nameHindi} ({nameEnglish})</div>
                  <div className="field-row"><b>पद:</b> {roleHindi} ({roleEnglish})</div>
                  <div className="field-row"><b>जन्मतिथि:</b> {displayDob}</div>
                  <div className="field-row"><b>मोबाईल:</b> {phone}</div>
                  {email && <div className="field-row"><b>ईमेल:</b> {email}</div>}
                  <div className="field-row" style={{ fontSize: '9.5px', marginTop: '2px' }}><b>पता:</b> {address}</div>
                </div>
                <div style={{ width: '56px', height: '56px', border: '1px solid #000', padding: '2px', flexShrink: 0 }}>
                  <img src={qrCodeUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              </div>
            </div>

            <div className="border-box">
              <div className="card-title">विवरण (BACK)</div>
              <div className="field-row"><b>सदस्यता संख्या:</b> {volunteerId}</div>
              <div className="field-row"><b>सदस्यता प्रारंभ:</b> {membershipSince}</div>
              <div className="field-row"><b>रक्त समूह:</b> {bloodGroup}</div>
              <div className="field-row"><b>जारी करने की तिथि:</b> {dateOfIssue}</div>
              <div className="field-row"><b>Approved By:</b> {approvedBy}</div>
              <div style={{ borderTop: '1px solid #000', marginTop: '4px', paddingTop: '3px', textAlign: 'center' }}>
                <div style={{ fontStyle: 'italic', fontFamily: 'serif', fontWeight: 'bold', fontSize: '11px' }}>{presidentNameEnglish}</div>
                <div style={{ fontSize: '9px' }}>अध्यक्ष (श्री राम सेवा समिति)</div>
                <div style={{ fontSize: '8.5px', fontFamily: 'monospace' }}>हेल्पलाइन: +91 70681 80049</div>
              </div>
            </div>
          </div>

          <div className="note-box">
            <div className="note-title">समिति परिवार से जुड़ने पर आभार संदेश (Letter of Appreciation):</div>
            <div className="note-text text-justify">
              आदरणीय <b>{nameHindi} ({nameEnglish})</b>, श्री राम सेवा समिति परिवार में आपका हार्दिक स्वागत एवं अभिनंदन है। आपकी पहचान संख्या (Volunteer ID): <b>{volunteerId}</b> को समिति द्वारा विधिवत रूप से पंजीकृत एवं सत्यापित कर लिया गया है। समाज सेवा, धर्म रक्षा तथा जनकल्याण के पुनीत कार्यों में आपका यह समर्पण अत्यंत सराहनीय एवं प्रेरणादायी है। समिति के विभिन्न प्रकल्पों जैसे अन्नक्षेत्र, चिकित्सा सहायता, पर्यावरण संरक्षण एवं धार्मिक आयोजनों में आपका अमूल्य सहयोग समाज को सशक्त बनाएगा। हम प्रभु श्री राम से आपके सुखद, स्वस्थ एवं यशस्वी जीवन की प्रार्थना करते हैं।
            </div>
          </div>

          <div className="terms-title">स्वयंसेवक नियम, कर्तव्य एवं सेवा शर्तें (Terms & Conditions):</div>
          <ol className="terms-list text-justify">
            <li><b>पहचान पत्र की सुरक्षा:</b> यह पहचान पत्र श्री राम सेवा समिति की संपत्ति है। इसका उपयोग केवल समिति के आधिकारिक सेवा कार्यों एवं आयोजनों के दौरान ही किया जा सकता है।</li>
            <li><b>अनुशासन एवं मर्यादा:</b> किसी भी सेवा शिविर या आयोजन में भाग लेते समय अनुशासन, शिष्टाचार और मर्यादित आचरण का पालन करना अनिवार्य है।</li>
            <li><b>वरिष्ठ अधिकारियों से समन्वय:</b> सेवा कार्य प्रारंभ करने से पूर्व अपने क्षेत्र के वरिष्ठ संयोजक अथवा केंद्रीय समिति से आवश्यक दिशा-निर्देश प्राप्त करें।</li>
            <li><b>दुरुपयोग निषेध:</b> इस पहचान पत्र का किसी भी प्रकार के व्यक्तिगत, राजनीतिक या अनाधिकृत व्यावसायिक लाभ के लिए उपयोग करना पूर्णतः वर्जित है।</li>
            <li><b>पहचान पत्र गुम होने पर:</b> यदि पहचान पत्र खो जाता है, तो तुरंत समिति के हेल्पलाइन नंबर <span className="font-mono font-bold">+91 70681 80049</span> पर सूचित करें।</li>
          </ol>

          <div className="sign-row">
            <div>
              <div><b>{nameHindi} ({volunteerId})</b></div>
              <div style={{ fontSize: '9px', color: '#555' }}>स्वयंसेवक के हस्ताक्षर</div>
            </div>
            <div className="text-right">
              <div style={{ fontStyle: 'italic', fontFamily: 'serif', fontWeight: 'bold' }}>{presidentNameEnglish}</div>
              <div><b>({presidentNameHindi})</b></div>
              <div style={{ fontSize: '9px', color: '#555' }}>अध्यक्ष, श्री राम सेवा समिति</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}