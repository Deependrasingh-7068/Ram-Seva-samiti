import React from 'react';
import { ShieldCheck, Lock, UserCheck, FileText, Globe, KeyRound } from 'lucide-react';

export default function AdminPrivacyPolicy() {
  // LocalStorage se logged-in admin ki details fetch karna
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
  const adminName = adminInfo.name || 'Authorized Admin';
  const adminId = adminInfo.adminId || adminInfo.id || 'SRSS-ADMIN';

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-cream pb-8 animate-fadeIn">
      {/* Header Banner (Fixed/Non-scrolling top section) */}
      <div className="bg-navy-2 p-6 md:p-8 rounded-3xl border border-gold/25 shadow-xl flex items-center justify-between flex-wrap gap-4 shrink-0">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-saffron">
            <ShieldCheck size={24} />
            <span className="text-xs font-mono uppercase tracking-widest font-bold">Official Compliance & Security Policy</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-cream tracking-wide">
            Admin Privacy Policy & Data Security Protocols
          </h1>
          <p className="text-xs text-cream/60">Shree Ram Sewa Samiti Administrative Governance</p>
        </div>
        
        {/* Dynamic Admin Badge */}
        <div className="bg-navy px-4 py-3 rounded-2xl border border-gold/30 text-xs space-y-1 shadow-inner">
          <p className="text-gold font-bold">Admin: <span className="text-cream font-medium">{adminName}</span></p>
          <p className="text-gold font-bold">ID: <span className="font-mono text-saffron">{adminId}</span></p>
        </div>
      </div>

      {/* Scrollable Content Container (Scrollbar hidden, but content scrollable) */}
      <div 
        className="bg-navy-2 p-8 md:p-10 rounded-3xl border border-gold/20 shadow-xl space-y-8 max-h-[62vh] overflow-y-auto"
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* Internet Explorer 10+ */
        }}
      >
        <style>{`
          /* Hide scrollbar for Chrome, Safari and Opera */
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {/* ================= ENGLISH VERSION ================= */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-gold border-b border-gold/20 pb-3">
            <Globe size={20} />
            <h2 className="font-display text-lg tracking-wide uppercase font-bold">English Version</h2>
          </div>

          <div className="space-y-2 border-b border-gold/10 pb-5">
            <h3 className="text-gold font-semibold flex items-center gap-2 text-base">
              <UserCheck size={18} className="text-saffron shrink-0" /> 1. Administrator Authentication & Identity Scope
            </h3>
            <p className="text-xs text-cream/70 pl-6 leading-relaxed">
              This administrative control panel session is officially assigned to <strong className="text-cream">{adminName}</strong> under unique registration ID <strong className="text-saffron font-mono">{adminId}</strong>. All data transactions, event publications, member records management, and portal configurations executed from this session are securely recorded and legally tied to your administrative identity.
            </p>
          </div>

          <div className="space-y-2 border-b border-gold/10 pb-5">
            <h3 className="text-gold font-semibold flex items-center gap-2 text-base">
              <KeyRound size={18} className="text-saffron shrink-0" /> 2. Government ID & Data Safety Guarantee
            </h3>
            <p className="text-xs text-cream/70 pl-6 leading-relaxed">
              We assure you that your sensitive government-issued identification numbers (including your identification details and Date of Birth used for verification) are kept <strong className="text-cream">100% safe, encrypted, and secure</strong> within our database framework. Your full ID is never exposed publicly or across standard UI interfaces; it remains strictly masked (<strong className="text-saffron font-mono">******XXXXXX</strong>) to prevent any unauthorized viewing or data compromise. Full disclosure is only permitted through secondary cryptographic verification protocols.
            </p>
          </div>

          <div className="space-y-2 border-b border-gold/10 pb-5">
            <h3 className="text-gold font-semibold flex items-center gap-2 text-base">
              <Lock size={18} className="text-saffron shrink-0" /> 3. Data Confidentiality & Governance Mandate
            </h3>
            <p className="text-xs text-cream/70 pl-6 leading-relaxed">
              As an authorized administrator of Shree Ram Sewa Samiti, you are granted privileged access to sensitive operational databases, member registers, volunteer directory records, and financial ledger logs. Unauthorized extraction, external sharing, or malicious misuse of internal organizational data is strictly prohibited and will result in immediate termination of portal access and strict disciplinary action.
            </p>
          </div>

          <div className="space-y-2 pb-2">
            <h3 className="text-gold font-semibold flex items-center gap-2 text-base">
              <FileText size={18} className="text-saffron shrink-0" /> 4. Operational Protocols & Responsibilities
            </h3>
            <ul className="list-disc list-inside text-xs text-cream/70 pl-6 space-y-2">
              <li><strong className="text-cream">Credential Security:</strong> Maintain absolute confidentiality of your access parameters. Do not share your login credentials or verification tokens with any unauthorized third party.</li>
              <li><strong className="text-cream">Content Standards:</strong> Ensure all published updates, announcements, seva activities, and gallery media align strictly with the moral, cultural, and spiritual objectives of the Samiti.</li>
              <li><strong className="text-cream">Transparency & Reporting:</strong> Immediately report any technical vulnerabilities, data anomalies, or security breach attempts directly to the Super Admin.</li>
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
              <UserCheck size={18} className="text-saffron shrink-0" /> 1. प्रशासक प्रमाणीकरण और पहचान दायरा (Administrator Authentication)
            </h3>
            <p className="text-xs text-cream/70 pl-6 leading-relaxed font-hindi">
              यह एडमिनिस्ट्रेटिव कंट्रोल पैनल सत्र आधिकारिक रूप से <strong className="text-cream">{adminName}</strong> को उनकी विशिष्ट पंजीकरण आईडी <strong className="text-saffron font-mono">{adminId}</strong> के तहत आवंटित किया गया है। इस सत्र से किए जाने वाले सभी डेटा लेनदेन, इवेंट प्रकाशन, सदस्य रिकॉर्ड प्रबंधन और पोर्टल अपडेट सुरक्षित रूप से दर्ज किए जाते हैं और आपकी प्रशासनिक पहचान से जुड़े होते हैं।
            </p>
          </div>

          <div className="space-y-2 border-b border-gold/10 pb-5">
            <h3 className="text-gold font-semibold flex items-center gap-2 text-base font-hindi">
              <KeyRound size={18} className="text-saffron shrink-0" /> 2. सरकारी पहचान पत्र और डेटा सुरक्षा की गारंटी (Government ID Security)
            </h3>
            <p className="text-xs text-cream/70 pl-6 leading-relaxed font-hindi">
              हम आपको आश्वस्त करते हैं कि आपके संवेदनशील सरकारी पहचान नंबर (आपके पहचान विवरण और सत्यापन के लिए उपयोग की जाने वाली जन्म तिथि सहित) हमारे डेटाबेस ढांचे के भीतर <strong className="text-cream">100% सुरक्षित, एन्क्रिप्टेड और संरक्षित</strong> हैं। आपका पूरा पहचान नंबर कभी भी सार्वजनिक रूप से या मानक इंटरफेस पर प्रदर्शित नहीं किया जाता है; यह सुरक्षा के लिए हमेशा मास्क (<strong className="text-saffron font-mono">******XXXXXX</strong>) रहता है। इसे देखने की अनुमति केवल सख्त द्वितीयक सत्यापन (secondary verification) के बाद ही मिलती है।
            </p>
          </div>

          <div className="space-y-2 border-b border-gold/10 pb-5">
            <h3 className="text-gold font-semibold flex items-center gap-2 text-base font-hindi">
              <Lock size={18} className="text-saffron shrink-0" /> 3. डेटा गोपनीयता और संचालन आदेश (Data Confidentiality)
            </h3>
            <p className="text-xs text-cream/70 pl-6 leading-relaxed font-hindi">
              श्री राम सेवा समिति के एक अधिकृत प्रशासक के रूप में, आपको संवेदनशील डेटाबेस, सदस्य रजिस्टरों, स्वयंसेवक निर्देशिकाओं और वित्तीय लेज़र लॉग तक विशेषाधिकार प्राप्त होता है। आंतरिक संगठनात्मक डेटा का अनधिकृत निष्कर्षण, बाहरी साझाकरण या दुर्भावनापूर्ण दुरुपयोग सख्त रूप से प्रतिबंधित है और इससे आपकी प्रशासनिक पहुंच तुरंत समाप्त कर दी जाएगी तथा अनुशासनात्मक कार्रवाई की जाएगी।
            </p>
          </div>

          <div className="space-y-2 pb-4">
            <h3 className="text-gold font-semibold flex items-center gap-2 text-base font-hindi">
              <FileText size={18} className="text-saffron shrink-0" /> 4. परिचालन प्रोटोकॉल और जिम्मेदारियां (Operational Protocols)
            </h3>
            <ul className="list-disc list-inside text-xs text-cream/70 pl-6 space-y-2 font-hindi">
              <li><strong className="text-cream">क्रेडेंशियल सुरक्षा:</strong> अपने एक्सेस पैरामीटर और पासवर्ड की पूर्ण गोपनीयता बनाए रखें। अपनी लॉगिन जानकारी किसी भी अनधिकृत व्यक्ति के साथ साझा न करें।</li>
              <li><strong className="text-cream">सामग्री मानक:</strong> यह सुनिश्चित करें कि प्रकाशित सभी अपडेट, घोषणाएं, सेवा गतिविधियां और गैलरी मीडिया समिति के नैतिक और आध्यात्मिक उद्देश्यों के बिल्कुल अनुरूप हों।</li>
              <li><strong className="text-cream">पारदर्शिता और रिपोर्टिंग:</strong> किसी भी तकनीकी खराबी, डेटा विसंगति या सुरक्षा उल्लंघन के प्रयास की सूचना तुरंत सुपर एडमिन को दें।</li>
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