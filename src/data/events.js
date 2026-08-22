// Placeholder events. In production this list is fetched from
// GET /api/events (Event model) and detail pages resolve by :slug.
const events = [
  {
    slug: 'ram-navami-mahotsav-2026',
    title: 'राम नवमी महोत्सव',
    titleEnglish: 'Ram Navami Mahotsav',
    date: '2026-03-27',
    time: 'प्रातः 6:00 बजे',
    location: 'श्री राम मंदिर प्रांगण, चंदनपुर',
    category: 'Religious',
    status: 'upcoming',
    registrationRequired: true,
    description:
      'भव्य कलश यात्रा, सुंदरकांड पाठ, भजन संध्या और महाभंडारे के साथ राम नवमी का तीन-दिवसीय उत्सव।',
  },
  {
    slug: 'raktdaan-shivir-april',
    title: 'रक्तदान शिविर',
    titleEnglish: 'Blood Donation Camp',
    date: '2026-04-14',
    time: 'प्रातः 9:00 - सायं 3:00',
    location: 'सामुदायिक भवन, चंदनपुर',
    category: 'Health',
    status: 'upcoming',
    registrationRequired: true,
    description: 'जिला रेड क्रॉस के सहयोग से आयोजित रक्तदान शिविर, हर बूंद एक जीवन बचाती है।',
  },
  {
    slug: 'vriksharopan-abhiyan',
    title: 'वृक्षारोपण अभियान',
    titleEnglish: 'Tree Plantation Drive',
    date: '2026-07-05',
    time: 'प्रातः 7:00 बजे',
    location: 'ग्राम पंचायत भूमि, चंदनपुर',
    category: 'Environment',
    status: 'upcoming',
    registrationRequired: false,
    description: '501 पौधों के रोपण का संकल्प — आइए हरियाली के इस संकल्प में साथ दें।',
  },
  {
    slug: 'diwali-bhandara-2025',
    title: 'दीपावली भंडारा',
    titleEnglish: 'Diwali Community Feast',
    date: '2025-11-01',
    time: 'सायं 6:00 बजे',
    location: 'श्री राम मंदिर प्रांगण, चंदनपुर',
    category: 'Community Support',
    status: 'past',
    registrationRequired: false,
    description: '1,200 से अधिक परिवारों के साथ मनाया गया दीपावली का सामूहिक भंडारा।',
  },
];

export default events;
