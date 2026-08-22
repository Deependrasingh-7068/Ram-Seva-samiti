// Placeholder gallery items. In production this is fetched from
// GET /api/gallery (Gallery model) and images are served via Cloudinary.
const gallery = [
  { id: 'g1', category: 'Ram Navami', caption: 'कलश यात्रा 2025', image: '/assets/gallery/ram-navami-1.jpg' },
  { id: 'g2', category: 'Bhandara', caption: 'दीपावली भंडारा', image: '/assets/gallery/bhandara-1.jpg' },
  { id: 'g3', category: 'Seva', caption: 'रक्तदान शिविर', image: '/assets/gallery/seva-1.jpg' },
  { id: 'g4', category: 'Community', caption: 'ग्राम सभा बैठक', image: '/assets/gallery/community-1.jpg' },
  { id: 'g5', category: 'Religious Events', caption: 'सुंदरकांड पाठ', image: '/assets/gallery/religious-1.jpg' },
  { id: 'g6', category: 'Social Activities', caption: 'वृक्षारोपण अभियान', image: '/assets/gallery/social-1.jpg' },
  { id: 'g7', category: 'Ram Navami', caption: 'भजन संध्या', image: '/assets/gallery/ram-navami-2.jpg' },
  { id: 'g8', category: 'Seva', caption: 'शिक्षा सहयोग वितरण', image: '/assets/gallery/seva-2.jpg' },
  { id: 'g9', category: 'Community', caption: 'होली मिलन समारोह', image: '/assets/gallery/community-2.jpg' },
];

export const galleryCategories = [
  'All',
  'Ram Navami',
  'Bhandara',
  'Seva',
  'Community',
  'Religious Events',
  'Social Activities',
];

export default gallery;
