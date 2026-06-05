import Link from 'next/link'

export default function AdvertisePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold mb-4">
          🏪 Advertise Your Business
        </h1>
        <p className="text-xl text-gray-600">
          Get your Hertford business in front of engaged local residents through 
          fun, memorable quiz questions.
        </p>
      </div>

      <div className="card mb-8">
        <h2 className="font-heading text-2xl font-bold mb-4">How It Works</h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-hertford-green text-white flex items-center justify-center font-bold flex-shrink-0">1</span>
            <div>
              <h3 className="font-bold">Choose Your Plan</h3>
              <p className="text-gray-600 text-sm">Select the tier that works for your business.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-hertford-green text-white flex items-center justify-center font-bold flex-shrink-0">2</span>
            <div>
              <h3 className="font-bold">Submit Your Questions</h3>
              <p className="text-gray-600 text-sm">Create fun quiz questions about your business with verified facts. We help you craft them!</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-hertford-green text-white flex items-center justify-center font-bold flex-shrink-0">3</span>
            <div>
              <h3 className="font-bold">Get Seen</h3>
              <p className="text-gray-600 text-sm">Your brand appears alongside your questions. Players learn about your business while having fun!</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="font-heading text-2xl font-bold text-center mb-6">Pricing Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-1">Basic</h3>
          <div className="text-3xl font-bold text-hertford-green mb-4">
            &pound;15<span className="text-sm text-gray-500 font-normal">/mo</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-2 mb-6 text-left">
            <li className="flex gap-2"><span className="text-green-500">✓</span> 2 quiz questions live</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span> Business name shown</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span> Question rotation</li>
          </ul>
          <button className="btn-primary w-full !text-sm" disabled>
            Coming Soon
          </button>
        </div>

        <div className="card text-center border-2 border-hertford-gold shadow-lg relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-hertford-gold text-hertford-dark px-3 py-0.5 rounded-full text-xs font-bold">
            POPULAR
          </div>
          <h3 className="font-bold text-lg mb-1">Standard</h3>
          <div className="text-3xl font-bold text-hertford-green mb-4">
            &pound;35<span className="text-sm text-gray-500 font-normal">/mo</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-2 mb-6 text-left">
            <li className="flex gap-2"><span className="text-green-500">✓</span> 5 quiz questions live</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span> Business logo shown</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span> Priority placement</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span> Basic analytics</li>
          </ul>
          <button className="btn-secondary w-full !text-sm" disabled>
            Coming Soon
          </button>
        </div>

        <div className="card text-center border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-1">Premium</h3>
          <div className="text-3xl font-bold text-hertford-green mb-4">
            &pound;75<span className="text-sm text-gray-500 font-normal">/mo</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-2 mb-6 text-left">
            <li className="flex gap-2"><span className="text-green-500">✓</span> 10 quiz questions live</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span> Featured banner</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span> Top placement</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span> Full analytics dashboard</li>
            <li className="flex gap-2"><span className="text-green-500">✓</span> Social media mentions</li>
          </ul>
          <button className="btn-primary w-full !text-sm" disabled>
            Coming Soon
          </button>
        </div>
      </div>

      <div className="card text-center bg-hertford-green/5">
        <h3 className="font-heading text-xl font-bold mb-2">Interested?</h3>
        <p className="text-gray-600 mb-4">
          Get in touch to discuss getting your business featured on Do You Know Hertford.
        </p>
        <a
          href="mailto:hello@doyouknowhertford.com"
          className="btn-primary inline-block"
        >
          Contact Us
        </a>
        <p className="text-xs text-gray-500 mt-3">
          hello@doyouknowhertford.com
        </p>
      </div>

      <div className="text-center mt-8">
        <Link href="/" className="text-hertford-green font-medium hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
