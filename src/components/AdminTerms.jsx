import React from 'react';
import { ShieldAlert, CheckCircle, Scale, Globe, FileText } from 'lucide-react';

export default function AdminTerms() {
  // LocalStorage se logged-in admin ki details fetch karna
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
  const adminName = adminInfo.name || 'Authorized Admin';
  const adminId = adminInfo.adminId || adminInfo.id || 'SRSS-ADMIN';

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-cream pb-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-navy-2 p-6 md:p-8 rounded-3xl border border-gold/25 shadow-xl flex items-center justify-between flex-wrap gap-4 shrink-0">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-saffron">
            <Scale size={24} />
            <span className="text-xs font-mono uppercase tracking-widest font-bold">Legal Framework & Governance</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-cream tracking-wide">
            Admin Terms of Service & Operational Agreement
          </h1>
          <p className="text-xs text-cream/60">Organization: श्री राम सेवा समिति (Shree Ram Sewa Samiti)</p>
        </div>
        
        {/* Dynamic Admin Badge */}
        <div className="bg-navy px-4 py-3 rounded-2xl border border-gold/30 text-xs space-y-1 shadow-inner">
          <p className="text-gold font-bold">Admin: <span className="text-cream font-medium">{adminName}</span></p>
          <p className="text-gold font-bold">ID: <span className="font-mono text-saffron">{adminId}</span></p>
        </div>
      </div>

      {/* Scrollable Container (No Scrollbar, smooth scroll) */}
      <div 
        className="bg-navy-2 p-8 md:p-10 rounded-3xl border border-gold/20 shadow-xl space-y-8 max-h-[62vh] overflow-y-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {/* ================= ENGLISH VERSION ================= */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-gold border-b border-gold/20 pb-3">
            <Globe size={20} />
            <h2 className="font-display text-lg tracking-wide uppercase font-bold">English Version</h2>
          </div>

          <div className="space-y-2 border-b border-gold/10 pb-5">
            <h3 className="text-gold font-semibold flex items-center gap-2 text-base">
              <CheckCircle size={18} className="text-saffron shrink-0" /> 1. Acceptance of Administrative Terms (प्रशासक की सहमति)
            </h3>
            <p className="text-xs text-cream/70 pl-6 leading-relaxed">
              By logging into and utilizing this dashboard interface under ID <strong className="text-saffron font-mono">{adminId}</strong>, you (<strong className="text-cream">{adminName}</strong>) agree to be legally bound by these operational terms. If you do not agree with any clause of this agreement, you must immediately terminate your active session and notify the Super Admin.
            </p>
          </div>

          <div className="space-y-2 border-b border-gold/10 pb-5">
            <h3 className="text-gold font-semibold flex items-center gap-2 text-base">
              <ShieldAlert size={18} className="text-saffron shrink-0" /> 2. Permitted Portal Usage (मान्य उपयोग)
            </h3>
            <ul className="list-disc list-inside text-xs text-cream/70 pl-6 space-y-2">
              <li><strong className="text-cream">Role Compliance:</strong> Admin <strong className="text-cream">{adminName}</strong> is authorized solely to manage content, events, sevas, members, and updates designated to your administrative jurisdiction.</li>
              <li><strong className="text-cream">Prohibited Conduct:</strong> Any attempt to alter system security architecture, bypass cryptographic locks, extract raw database structures, or perform unauthorized administrative actions under ID <strong className="text-saffron font-mono">{adminId}</strong> is strictly prohibited.</li>
            </ul>
          </div>

          <div className="space-y-2 border-b border-gold/10 pb-5">
            <h3 className="text-gold font-semibold flex items-center gap-2 text-base">
              <FileText size={18} className="text-saffron shrink-0" /> 3. Intellectual Property & Samiti Assets (बौद्धिक संपदा)
            </h3>
            <p className="text-xs text-cream/70 pl-6 leading-relaxed">
              All digital media, text content, photographs uploaded to the gallery, religious event schedules, and branding elements associated with Shree Ram Sewa Samiti remain the exclusive property of the Samiti. Admins are permitted to publish or modify approved media solely for organizational purposes.
            </p>
          </div>

          <div className="space-y-2 pb-2">
            <h3 className="text-gold font-semibold flex items-center gap-2 text-base">
              <ShieldAlert size={18} className="text-saffron shrink-0" /> 4. Liability & Account Security (खाता सुरक्षा और उत्तरदायित्व)
            </h3>
            <ul className="list-disc list-inside text-xs text-cream/70 pl-6 space-y-2">
              <li>The Samiti holds zero tolerance for account sharing. Admin <strong className="text-cream">{adminName}</strong> is solely responsible for maintaining the confidentiality of their credentials and verification parameters.</li>
              <li>The organization is not liable for any unauthorized modifications or security breaches originating from a compromised or unattended admin session.</li>
            </ul>
          </div>
        </div>

        {/* ================= HINDI VERSION (हिंदी संस्करण) ================= */}
        <div className="space-y-6 pt-6 border-t border-gold/20">
          <div className="flex items-center gap-2 text-gold border-b border-gold/20 pb-3">
            <Globe size={20} />
            <h2 className="font-display text-lg tracking-wide uppercase font-bold font-hindi">हिंदी संस्करण (Hindi Version)</h2>
          </div>

          <div className="space-y-2 border-b border-gold/10 pb-5">
            <h3 className="text-gold font-semibold flex items-center gap-2 text-base font-hindi">
              <CheckCircle size={18} className="text-saffron shrink-0" /> 1. प्रशासनिक सहमति (Acceptance of Terms)
            </h3>
            <p className="text-xs text-cream/70 pl-6 leading-relaxed font-hindi">
              आईडी <strong className="text-saffron font-mono">{adminId}</strong> के अंतर्गत इस डैशबोर्ड इंटरफ़ेस में लॉगिन करके, आप (<strong className="text-cream">{adminName}</strong>) इन परिचालन शर्तों से कानूनी रूप से बंधे होने की सहमति देते हैं। यदि आप इस समझौते के किसी भी खंड से सहमत नहीं हैं, तो आपको तुरंत अपना सक्रिय सत्र समाप्त करना होगा और सुपर एडमिन को सूचित करना होगा।
            </p>
          </div>

          <div className="space-y-2 border-b border-gold/10 pb-5">
            <h3 className="text-gold font-semibold flex items-center gap-2 text-base font-hindi">
              <ShieldAlert size={18} className="text-saffron shrink-0" /> 2. पोर्टल का मान्य उपयोग (Permitted Portal Usage)
            </h3>
            <ul className="list-disc list-inside text-xs text-cream/70 pl-6 space-y-2 font-hindi">
              <li><strong className="text-cream">भूमिका अनुपालन:</strong> एडमिन <strong className="text-cream">{adminName}</strong> को केवल आपके प्रशासनिक क्षेत्राधिकार के तहत निर्दिष्ट सामग्री, कार्यक्रमों, सेवाओं, सदस्यों और अपडेट का प्रबंधन करने के लिए अधिकृत किया गया है।</li>
              <li><strong className="text-cream">निषिद्ध आचरण:</strong> आईडी <strong className="text-saffron font-mono">{adminId}</strong> के तहत सिस्टम सुरक्षा वास्तुकला को बदलने, क्रिप्टोग्राफिक ताले को बायपास करने, कच्चे डेटाबेस संरचनाओं को निकालने या अनधिकृत प्रशासनिक कार्य करने का कोई भी प्रयास सख्ती से प्रतिबंधित है।</li>
            </ul>
          </div>

          <div className="space-y-2 border-b border-gold/10 pb-5">
            <h3 className="text-gold font-semibold flex items-center gap-2 text-base font-hindi">
              <FileText size={18} className="text-saffron shrink-0" /> 3. बौद्धिक संपदा और समिति की संपत्ति (Intellectual Property)
            </h3>
            <p className="text-xs text-cream/70 pl-6 leading-relaxed font-hindi">
              श्री राम सेवा समिति से जुड़े सभी डिजिटल मीडिया, पाठ सामग्री, गैलरी में अपलोड की गई तस्वीरें, धार्मिक कार्यक्रम कार्यक्रम और ब्रांडिंग तत्व समिति की अनन्य संपत्ति बने हुए हैं। एडमिनिस्ट्रेटर्स को केवल संगठनात्मक उद्देश्यों के लिए अनुमोदित मीडिया को प्रकाशित या संशोधित करने की अनुमति है।
            </p>
          </div>

          <div className="space-y-2 pb-4">
            <h3 className="text-gold font-semibold flex items-center gap-2 text-base font-hindi">
              <ShieldAlert size={18} className="text-saffron shrink-0" /> 4. देयता और खाता सुरक्षा (Liability & Account Security)
            </h3>
            <ul className="list-disc list-inside text-xs text-cream/70 pl-6 space-y-2 font-hindi">
              <li>समिति खाता साझा करने के प्रति शून्य सहिष्णुता (zero tolerance) रखती है। एडमिन <strong className="text-cream">{adminName}</strong> अपनी साख और सत्यापन मापदंडों की गोपनीयता बनाए रखने के लिए पूरी तरह से जिम्मेदार हैं।</li>
              <li>संगठन किसी भी अनधिकृत संशोधन या सुरक्षा उल्लंघन के लिए उत्तरदायी नहीं है जो किसी से कंप्रोमाइज्ड या बिना देखरेख वाले एडमिन सत्र से उत्पन्न हुआ हो।</li>
            </ul>
          </div>

          <div className="pt-4 text-center border-t border-gold/10">
            <p className="text-[11px] text-cream/40 uppercase tracking-widest font-mono">
              श्री राम सेवा समिति — सुरक्षित एडमिन पोर्टल &copy; 2026
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}