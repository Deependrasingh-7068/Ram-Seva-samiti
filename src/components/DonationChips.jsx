const PRESETS = [101, 501, 1100, 2100];

/**
 * Controlled preset-amount chips + custom amount field.
 * Parent owns the selected amount; this stays presentation-only so it
 * can later be wired straight into the donation-order API call.
 */
export default function DonationChips({ amount, onSelect, customAmount, onCustomChange }) {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="radiogroup" aria-label="Donation amount">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            role="radio"
            aria-checked={amount === preset}
            onClick={() => onSelect(preset)}
            className={`py-3 rounded-xl border text-center transition-colors ${
              amount === preset
                ? 'bg-saffron border-saffron text-navy font-semibold'
                : 'border-gold/25 text-cream/80 hover:border-gold/60'
            }`}
          >
            ₹{preset.toLocaleString('en-IN')}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label htmlFor="custom-amount" className="block text-sm text-cream/60 mb-2">
          Custom Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/50">₹</span>
          <input
            id="custom-amount"
            type="number"
            min="1"
            inputMode="numeric"
            placeholder="Enter amount"
            value={customAmount}
            onChange={(e) => onCustomChange(e.target.value)}
            className="w-full pl-8 pr-4 py-3 rounded-xl bg-navy-2 border border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold outline-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
