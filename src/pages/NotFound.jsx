import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="pt-40 pb-24 bg-navy text-center px-6 min-h-[60vh] flex flex-col items-center justify-center">
      <p className="font-hindi text-3xl text-gold mb-3">क्षमा करें</p>
      <h1 className="font-display text-5xl text-cream mb-4">Page Not Found</h1>
      <p className="text-cream/60 mb-8 max-w-md">
        यह पृष्ठ उपलब्ध नहीं है। कृपया होमपेज पर लौटें।
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-medium transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
