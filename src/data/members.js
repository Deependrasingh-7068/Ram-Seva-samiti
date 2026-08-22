// Placeholder members. In production this list is fetched from
// GET /api/members (Member model), ordered by displayOrder from the admin panel.
const members = [
  {
    id: 'm1',
    name: 'श्री विकास पांडे',
    designation: 'Event Coordinator',
    designationHindi: 'कार्यक्रम समन्वयक',
    bio: 'सभी वार्षिक उत्सवों और सामुदायिक कार्यक्रमों का संचालन करते हैं।',
    photo: '/assets/members/coordinator.jpg',
    order: 1,
  },
  {
    id: 'm2',
    name: 'कु. अंजलि वर्मा',
    designation: 'Volunteer Lead',
    designationHindi: 'स्वयंसेवक प्रमुख',
    bio: 'युवा स्वयंसेवकों की टीम का नेतृत्व करती हैं।',
    photo: '/assets/members/volunteer-lead.jpg',
    order: 2,
  },
];

export default members;