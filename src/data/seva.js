// Placeholder seva activities. In production this list is fetched from
// GET /api/seva (Seva model), populated and managed from the admin panel.
const seva = [
  {
    id: 'dharmik-seva',
    title: 'धार्मिक सेवा',
    titleEnglish: 'Religious Service',
    description:
      'नियमित आरती, भजन संध्या और धार्मिक अनुष्ठानों का आयोजन जो समाज को आस्था से जोड़ता है।',
    category: 'Religious',
    icon: 'flame',
    featured: true,
  },
  {
    id: 'bhandara',
    title: 'भंडारा',
    titleEnglish: 'Community Meals',
    description: 'विशेष अवसरों पर सामूहिक भोजन का आयोजन, जिससे कोई भूखा न रहे।',
    category: 'Community Support',
    icon: 'utensils',
    featured: true,
  },
  {
    id: 'raktdaan',
    title: 'रक्तदान',
    titleEnglish: 'Blood Donation',
    description: 'नियमित रक्तदान शिविर, जिससे जरूरतमंदों की जान बचाई जा सके।',
    category: 'Health',
    icon: 'droplet',
    featured: true,
  },
  {
    id: 'vrikshaaropan',
    title: 'वृक्षारोपण',
    titleEnglish: 'Tree Plantation',
    description: 'गांव और आसपास के क्षेत्रों में वृक्षारोपण अभियान चलाकर पर्यावरण की रक्षा।',
    category: 'Environment',
    icon: 'sprout',
    featured: false,
  },
  {
    id: 'shiksha-sahyog',
    title: 'शिक्षा सहयोग',
    titleEnglish: 'Education Support',
    description: 'जरूरतमंद बच्चों को किताबें, यूनिफॉर्म और ट्यूशन सहयोग प्रदान करना।',
    category: 'Education',
    icon: 'book-open',
    featured: false,
  },
  {
    id: 'jarurat-sahayata',
    title: 'जरूरतमंद सहायता',
    titleEnglish: 'Support for the Needy',
    description: 'वस्त्र, भोजन और आवश्यक वस्तुओं की सहायता जरूरतमंद परिवारों तक पहुंचाना।',
    category: 'Community Support',
    icon: 'hand-heart',
    featured: false,
  },
  {
    id: 'gau-seva',
    title: 'गौ सेवा',
    titleEnglish: 'Cow Welfare',
    description: 'गौशाला में चारा, चिकित्सा और देखभाल की व्यवस्था हेतु निरंतर सहयोग।',
    category: 'Religious',
    icon: 'heart',
    featured: false,
  },
  {
    id: 'swachhta-abhiyan',
    title: 'स्वच्छता अभियान',
    titleEnglish: 'Cleanliness Drive',
    description: 'मंदिर परिसर, घाट और सार्वजनिक स्थलों की नियमित सफाई अभियान।',
    category: 'Community Support',
    icon: 'sparkles',
    featured: false,
  },
];

export default seva;
