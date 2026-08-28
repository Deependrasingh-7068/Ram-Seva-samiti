// src/utils/eventStatus.js
// Event ka live status (upcoming / ongoing / past) date, startTime aur
// endTime ke basis par nikalta hai — koi manual "status" set karne ki zaroorat nahi.

// date: "YYYY-MM-DD", timeStr: "HH:MM" (24-hour — jaise <input type="time"> deta hai)
export function combineDateTime(date, timeStr) {
  if (!date) return null;
  const datePart = String(date).split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);
  if (!year || !month || !day) return null;

  let hours = 0;
  let minutes = 0;
  if (timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    if (!isNaN(h)) hours = h;
    if (!isNaN(m)) minutes = m;
  }
  return new Date(year, month - 1, day, hours, minutes, 0);
}

// event = { date, startTime, endTime }
export function getEventStatus(event) {
  if (!event || !event.date) return 'upcoming';

  const now = new Date();
  const start = combineDateTime(event.date, event.startTime);
  let end = combineDateTime(event.date, event.endTime);

  // Agar startTime hi nahi mila (purana data jisme sirf 'time' text tha), sirf date se hi kaam chalao
  if (!start) {
    const dayStart = combineDateTime(event.date, '00:00');
    const dayEnd = combineDateTime(event.date, '23:59');
    if (now < dayStart) return 'upcoming';
    if (now > dayEnd) return 'past';
    return 'ongoing';
  }

  // agar end time na diya ho to start time hi end maan lo (turant "past" ho jayega end ke baad)
  if (!end) end = start;

  // agar end, start se pehle lage (raat 11 se subah 2 jaisa case) to end agle din ka maano
  if (end < start) {
    end = new Date(end);
    end.setDate(end.getDate() + 1);
  }

  if (now < start) return 'upcoming';
  if (now > end) return 'past';
  return 'ongoing';
}

// Display ke liye "9:00 AM - 7:00 PM" jaisa banata hai
export function formatTimeRange(startTime, endTime) {
  const fmt = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    if (isNaN(h)) return '';
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
  };
  if (startTime && endTime) return `${fmt(startTime)} - ${fmt(endTime)}`;
  if (startTime) return fmt(startTime);
  return '';
}