// Placeholder updates. In production this is fetched from
// GET /api/updates (Notification/Update model) and resolves by :slug.
const updates = [
  {
    slug: 'ram-navami-registration-open',
    title: 'राम नवमी महोत्सव हेतु पंजीकरण प्रारंभ',
    thumbnail: '/assets/updates/ram-navami-registration.jpg',
    category: 'Announcement',
    date: '2026-02-20',
    author: 'Samiti Office',
    featured: true,
    excerpt: 'इस वर्ष की राम नवमी महोत्सव के लिए पंजीकरण आज से शुरू हो चुका है।',
    content:
      'इस वर्ष की राम नवमी महोत्सव के लिए पंजीकरण आज से शुरू हो चुका है। कलश यात्रा, भजन संध्या और महाभंडारे में भाग लेने हेतु समिति कार्यालय या वेबसाइट के माध्यम से पंजीकरण करें।',
  },
  {
    slug: 'blood-donation-camp-success',
    title: 'रक्तदान शिविर में 150 यूनिट रक्तदान',
    thumbnail: '/assets/updates/blood-donation-success.jpg',
    category: 'Seva',
    date: '2025-11-15',
    author: 'Samiti Office',
    featured: false,
    excerpt: 'समिति द्वारा आयोजित रक्तदान शिविर में 150 यूनिट रक्त एकत्र किया गया।',
    content:
      'समिति द्वारा आयोजित रक्तदान शिविर में क्षेत्र के 150 से अधिक दानवीरों ने भाग लिया। जिला रेड क्रॉस सोसायटी के सहयोग से यह शिविर सफलतापूर्वक संपन्न हुआ।',
  },
  {
    slug: 'new-education-support-batch',
    title: 'शिक्षा सहयोग कार्यक्रम का नया बैच शुरू',
    thumbnail: '/assets/updates/education-support.jpg',
    category: 'Education',
    date: '2025-10-02',
    author: 'Samiti Office',
    featured: false,
    excerpt: '40 जरूरतमंद बच्चों को किताबें और यूनिफॉर्म वितरित की गईं।',
    content:
      'शिक्षा सहयोग कार्यक्रम के अंतर्गत इस बैच में 40 जरूरतमंद बच्चों को किताबें, यूनिफॉर्म और स्टेशनरी वितरित की गई।',
  },
];

export default updates;
