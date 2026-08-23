import useCounter from '../hooks/useCounter';

/**
 * A single animated statistic. `value` is the numeric target, `suffix`
 * appends a non-animated string (e.g. "+", "L+"). Values here are demo
 * placeholders — in production they should come from GET /api/stats.
 */
export default function StatsCounter({ value, suffix = '', label, prefix = '' }) {
  const [ref, count] = useCounter(value);

  return (
    <div ref={ref} className="text-center px-4">
      <p className="font-display text-4xl md:text-5xl text-gold tabular-nums">
        {prefix}
        {count.toLocaleString('en-IN')}
        {suffix}
      </p>
      <p className="mt-2 text-sm tracking-wide text-cream/70">{label}</p>
    </div>
  );
}
