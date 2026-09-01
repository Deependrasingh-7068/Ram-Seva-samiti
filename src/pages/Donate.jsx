import { useState, useEffect } from 'react';
import { ShieldCheck, HeartHandshake, CheckCircle2, XCircle, Download } from 'lucide-react';
import DonationChips from '../components/DonationChips';
import RamBackground from '../components/RamBackground';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';

// Razorpay checkout script ko dynamically load karta hai (sirf ek baar)
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Donate() {
  const { user } = useAuth();
    const { settings } = useAdmin();

  const [amount, setAmount] = useState(501);
  const [customAmount, setCustomAmount] = useState('');

  const [form, setForm] = useState({
    name: user?.name || '',
    mobile: user?.contactNumber || '',
    email: user?.email || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(''); // '', 'success', or an error string
  const [receiptId, setReceiptId] = useState('');

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name || f.name,
        email: user.email || f.email,
        mobile: user.contactNumber || f.mobile,
      }));
    }
  }, [user]);

  const finalAmount = customAmount ? Number(customAmount) : amount;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    // Donation ki receipt ko PNG image ke roop mein generate karke download karta hai
   // Image ko safely load karta hai (fail hone par null return karta hai, poora receipt nahi tootega)
  const loadImageSafe = (src, useCors = false) => {
    return new Promise((resolve) => {
      const img = new Image();
      if (useCors) img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  };

  // Professional donation receipt (logo, details table, QR, seal, footer badges) generate karke download karta hai
  const downloadReceipt = async () => {
    const W = 1050;
    const H = 1500;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // ===== HEADER =====
    const headerH = 220;
    ctx.fillStyle = '#fff7ed';
    ctx.fillRect(0, 0, W, headerH);

    const logo = await loadImageSafe(`${window.location.origin}/assets/gallery/logo.png`);
    const logoX = 90, logoY = 110, logoR = 65;
    if (logo) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(logoX, logoY, logoR, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(logo, logoX - logoR, logoY - logoR, logoR * 2, logoR * 2);
      ctx.restore();
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(logoX, logoY, logoR, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = '#c2410c';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('श्री राम सेवा समिति', 180, 90);
    ctx.font = 'bold 26px Arial';
    ctx.fillStyle = '#7c2d12';
    ctx.fillText(settings?.samitiName || 'Shri Ram Seva Samiti', 180, 128);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#9a3412';
    ctx.fillText(settings?.tagline || '|| सेवा ही परम धर्म ||', 180, 155);

    ctx.font = '15px Arial';
    ctx.fillStyle = '#57534e';
    ctx.fillText(`Address: ${settings?.address || 'N/A'}`, 90, 195);
    ctx.fillText(`Phone: ${settings?.phone || 'N/A'}    Email: ${settings?.email || 'N/A'}`, 90, 218);

    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, headerH);
    ctx.lineTo(W, headerH);
    ctx.stroke();

    // ===== TITLE =====
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 34px Arial';
    ctx.fillText('DONATION RECEIPT', W / 2, headerH + 60);

    ctx.fillStyle = '#f97316';
    const pillW = 420, pillH = 42;
    const pillX = W / 2 - pillW / 2, pillY = headerH + 80;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 21);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Arial';
    ctx.fillText('Thank you for your generous contribution', W / 2, pillY + 27);

    // ===== DETAILS =====
    const detailsTop = headerH + 170;
    ctx.textAlign = 'left';

    const now = new Date();
    const receiptNo = `RS${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${(receiptId || '').slice(-4).toUpperCase()}`;

    const leftRows = [
      ['Receipt No.', receiptNo],
      ['Date', now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
      ['Donor Name', form.name],
      ['Mobile Number', form.mobile],
      ['Email', form.email || 'N/A'],
    ];

    let y = detailsTop;
    leftRows.forEach(([label, value]) => {
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#1c1917';
      ctx.fillText(label, 90, y);
      ctx.font = '16px Arial';
      ctx.fillStyle = '#3f3f46';
      ctx.fillText(`: ${value}`, 260, y);
      y += 42;
    });

    const boxX = 590, boxY = detailsTop - 35, boxW = 370, boxH = 240;
    ctx.fillStyle = '#fff7ed';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 12);
    ctx.fill();

    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 19px Arial';
    ctx.fillText('Donation Details', boxX + 24, boxY + 40);

    const rightRows = [
      ['Purpose', 'General Donation'],
      ['Payment Mode', 'Online (Razorpay)'],
      ['Transaction ID', receiptId],
            ['Payment Date', `${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`],
    ];
    let ry = boxY + 80;
    rightRows.forEach(([label, value]) => {
      ctx.font = 'bold 15px Arial';
      ctx.fillStyle = '#1c1917';
      ctx.fillText(label, boxX + 24, ry);
      ctx.font = '13px Arial';
      ctx.fillStyle = '#3f3f46';
      ctx.fillText(`: ${value}`, boxX + 24, ry + 20);
      ry += 55;
    });

    // ===== AMOUNT TABLE =====
    const tableTop = Math.max(y, boxY + boxH) + 50;
    const tableX = 90, tableW = W - 180;
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.roundRect(tableX, tableTop, tableW, 44, [8, 8, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 17px Arial';
    ctx.fillText('Description', tableX + 24, tableTop + 29);
    ctx.textAlign = 'right';
    ctx.fillText('Amount (INR)', tableX + tableW - 24, tableTop + 29);
    ctx.textAlign = 'left';

    const tRows = [
      ['Donation Amount', finalAmount],
      ['Transaction Charges', 0],
    ];
    let ty = tableTop + 44;
    tRows.forEach(([label, val]) => {
      ctx.strokeStyle = '#e7e5e4';
      ctx.beginPath();
      ctx.moveTo(tableX, ty);
      ctx.lineTo(tableX + tableW, ty);
      ctx.stroke();
      ctx.fillStyle = '#1c1917';
      ctx.font = '16px Arial';
      ctx.fillText(label, tableX + 24, ty + 34);
      ctx.textAlign = 'right';
      ctx.fillText(`Rs. ${val.toLocaleString('en-IN')}.00`, tableX + tableW - 24, ty + 34);
      ctx.textAlign = 'left';
      ty += 52;
    });
    ctx.fillStyle = '#fff7ed';
    ctx.fillRect(tableX, ty, tableW, 52);
    ctx.fillStyle = '#1c1917';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Total Amount', tableX + 24, ty + 34);
    ctx.textAlign = 'right';
    ctx.fillText(`Rs. ${finalAmount.toLocaleString('en-IN')}.00`, tableX + tableW - 24, ty + 34);
    ctx.textAlign = 'left';
    ty += 52;
    ctx.strokeStyle = '#e7e5e4';
    ctx.lineWidth = 1;
    ctx.strokeRect(tableX, tableTop + 44, tableW, ty - tableTop - 44);

    // ===== THANK YOU TEXT =====
    let by = ty + 60;
    ctx.font = '16px Arial';
    ctx.fillStyle = '#292524';
    ctx.fillText('Thank you for your kind support.', 90, by);
    ctx.fillText('Your donation will help us continue our efforts toward the service of society.', 90, by + 26);

    // ===== QR CODE =====
    const qrData = encodeURIComponent(`SRSS Receipt | ${receiptNo} | ${form.name} | Rs.${finalAmount} | ${receiptId}`);
    const qrImg = await loadImageSafe(`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}`, true);
    const qrY = by + 60;
    if (qrImg) {
      ctx.drawImage(qrImg, 90, qrY, 150, 150);
    }
    ctx.font = '13px Arial';
    ctx.fillStyle = '#57534e';
    ctx.textAlign = 'left';
    const noteX = 270, noteY = qrY + 40, noteW = 420, noteH = 70;
    ctx.strokeStyle = '#d6d3d1';
    ctx.lineWidth = 1;
    ctx.strokeRect(noteX, noteY, noteW, noteH);
    ctx.fillText('This is a system generated receipt and', noteX + 16, noteY + 30);
    ctx.fillText('does not require a physical signature.', noteX + 16, noteY + 50);

    const sealX = W - 160, sealY = qrY + 75, sealR = 70;
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealR - 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('श्री राम सेवा समिति', sealX, sealY - 25);
    ctx.font = 'italic 15px Georgia';
    ctx.fillText('Verified', sealX, sealY + 5);
    ctx.font = '12px Arial';
    ctx.fillText('अयोध्या', sealX, sealY + 40);
    ctx.textAlign = 'left';

    // ===== FOOTER BADGES =====
    const badgeY = qrY + 190;
    ctx.fillStyle = '#fff7ed';
    ctx.fillRect(0, badgeY, W, 90);
    const badges = [
      ['80G Registered', 'Income Tax Act, 1961'],
      ['Secure & Trusted', 'Your donation is safe with us'],
      ['Together We Can', 'Make a better tomorrow'],
    ];
    const bw = W / 3;
    badges.forEach(([title, sub], i) => {
      const bx = bw * i + bw / 2;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 15px Arial';
      ctx.fillText(title, bx, badgeY + 40);
      ctx.font = '13px Arial';
      ctx.fillStyle = '#57534e';
      ctx.fillText(sub, bx, badgeY + 62);
    });

    // ===== FOOTER BAR =====
    const footerY = badgeY + 90;
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(0, footerY, W, H - footerY);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
        ctx.fillText('ram-seva-samiti.vercel.app', W / 2, footerY + (H - footerY) / 2 + 6);

    const link = document.createElement('a');
    link.download = `SRSS_Donation_Receipt_${receiptId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setSubmitting(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setStatusMsg('Payment gateway load nahi ho paya. Internet connection check karein.');
        setSubmitting(false);
        return;
      }

      const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/donations/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          mobile: form.mobile,
          email: form.email,
          amount: finalAmount,
        }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        setStatusMsg(orderData.message || 'Order create nahi ho paya. Kripya dobara try karein.');
        setSubmitting(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Shree Ram Sewa Samiti',
        description: 'Donation towards Samiti Seva Karya',
        order_id: orderData.orderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.mobile,
        },
        theme: { color: '#ffb703' },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/donations/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setStatusMsg('success');
              setReceiptId(response.razorpay_payment_id);
            } else {
              setStatusMsg(verifyData.message || 'Payment verify nahi ho paya.');
            }
          } catch (err) {
            setStatusMsg('Payment ho gaya lekin verify karte waqt error aaya. Kripya humse contact karein.');
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setStatusMsg('Payment fail ho gaya. Kripya dobara try karein.');
        setSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      setStatusMsg('Kuch galat ho gaya. Kripya dobara try karein.');
      setSubmitting(false);
    }
  };

  return (
    <div className="relative pt-32 pb-24 bg-navy overflow-hidden">
      <RamBackground rows={4} cols={3} />
      <div className="relative max-w-lg mx-auto px-4 sm:px-6">
        <header className="text-center mb-8 sm:mb-10">
          <p className="font-hindi text-xl sm:text-2xl text-saffron mb-2">सेवा में सहयोग करें</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-cream mb-4">Donate</h1>
          <p className="text-cream/60 text-sm flex items-center justify-center gap-2 flex-wrap">
            <ShieldCheck size={15} className="text-gold" />
            Secure, verified donations — every contribution is receipted.
          </p>
          <span className="inline-block mt-3 text-[11px] px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300">
            🧪 Test Mode Active — no real money will be charged
          </span>
        </header>

        {statusMsg === 'success' ? (
          <div className="premium-card rounded-2xl p-6 sm:p-8 text-center space-y-4">
            <CheckCircle2 size={48} className="text-green-400 mx-auto" />
            <h2 className="font-display text-2xl text-cream">Thank You!</h2>
            <p className="text-cream/60 text-sm">
              Aapka ₹{finalAmount.toLocaleString('en-IN')} ka donation safaltapoorvak receive ho gaya hai.
            </p>
            <p className="text-xs text-cream/40 break-all">Payment ID: {receiptId}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
              <button
                onClick={downloadReceipt}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gold/40 text-cream hover:border-gold hover:bg-gold/10 font-semibold transition-colors text-sm"
              >
                <Download size={16} /> Download Receipt
              </button>
              <button
                onClick={() => {
                  setStatusMsg('');
                  setCustomAmount('');
                  setAmount(501);
                }}
                className="px-5 py-2.5 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-semibold transition-colors text-sm"
              >
                Donate Again
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="premium-card rounded-2xl p-5 sm:p-6 md:p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm text-cream/60 mb-2">Full Name</label>
              <input
                id="name" name="name" required
                value={form.name} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-navy-2 border border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold outline-none transition-colors"
                placeholder="Your name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="mobile" className="block text-sm text-cream/60 mb-2">Mobile</label>
                <input
                  id="mobile" name="mobile" type="tel" required
                  value={form.mobile} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-navy-2 border border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold outline-none transition-colors"
                  placeholder="10-digit number"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-cream/60 mb-2">Email</label>
                <input
                  id="email" name="email" type="email"
                  value={form.email} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-navy-2 border border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold outline-none transition-colors"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <span className="block text-sm text-cream/60 mb-2">Amount</span>
              <DonationChips
                amount={amount}
                onSelect={(v) => { setAmount(v); setCustomAmount(''); }}
                customAmount={customAmount}
                onCustomChange={setCustomAmount}
              />
            </div>

            {statusMsg && statusMsg !== 'success' && (
              <p className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <XCircle size={16} className="shrink-0" /> {statusMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !finalAmount}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-saffron hover:bg-saffron-deep disabled:opacity-60 text-navy font-semibold transition-colors"
            >
              <HeartHandshake size={18} />
              {submitting ? 'Processing…' : `Donate ₹${(finalAmount || 0).toLocaleString('en-IN')} Securely`}
            </button>

            <p className="text-xs text-center text-cream/40">
              Payments are processed through Razorpay. A digital receipt is
              generated only after payment verification.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}