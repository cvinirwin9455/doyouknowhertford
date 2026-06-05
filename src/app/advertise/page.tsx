import Link from 'next/link'

export default function AdvertisePage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">For local businesses</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Get your business in front of Hertford locals
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Feature your business in quiz questions. Players learn about you 
            while having fun — it&apos;s advertising that people actually enjoy.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-gray-50/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-center mb-12">How it works</h2>
          <div className="space-y-6">
            {[
              { step: '01', title: 'Choose your plan', desc: 'Pick the package that suits your budget and goals.' },
              { step: '02', title: 'We craft your questions', desc: 'We help you create fun, factual quiz questions about your business that players will love.' },
              { step: '03', title: 'Get discovered', desc: 'Your brand appears alongside your questions. Players learn about your business naturally.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start bg-white rounded-2xl p-6 border border-gray-100">
                <span className="text-3xl font-black text-hertford-green/20">{item.step}</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              Simple, affordable plans
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic */}
            <div className="card text-center">
              <h3 className="font-bold text-lg mb-1 text-gray-900">Basic</h3>
              <p className="text-gray-400 text-sm mb-4">Get started</p>
              <div className="text-4xl font-black text-gray-900 mb-6">
                &pound;15<span className="text-base text-gray-400 font-normal">/mo</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-3 mb-8 text-left">
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> 2 quiz questions live</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Business name shown</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Monthly rotation</li>
              </ul>
              <button className="btn-outline w-full !py-3 !text-sm opacity-60 cursor-not-allowed">
                Coming Soon
              </button>
            </div>

            {/* Standard */}
            <div className="card-elevated text-center relative border-2 border-hertford-green/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-hertford-green text-white px-4 py-1 rounded-full text-xs font-bold">
                MOST POPULAR
              </div>
              <h3 className="font-bold text-lg mb-1 text-gray-900">Standard</h3>
              <p className="text-gray-400 text-sm mb-4">Best value</p>
              <div className="text-4xl font-black text-gray-900 mb-6">
                &pound;35<span className="text-base text-gray-400 font-normal">/mo</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-3 mb-8 text-left">
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> 5 quiz questions live</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Business logo shown</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Priority placement</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Basic analytics</li>
              </ul>
              <button className="btn-primary w-full !py-3 !text-sm opacity-60 cursor-not-allowed">
                Coming Soon
              </button>
            </div>

            {/* Premium */}
            <div className="card text-center">
              <h3 className="font-bold text-lg mb-1 text-gray-900">Premium</h3>
              <p className="text-gray-400 text-sm mb-4">Maximum exposure</p>
              <div className="text-4xl font-black text-gray-900 mb-6">
                &pound;75<span className="text-base text-gray-400 font-normal">/mo</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-3 mb-8 text-left">
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> 10 quiz questions live</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Featured banner</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Top placement</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Full analytics</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Social media shout-out</li>
              </ul>
              <button className="btn-outline w-full !py-3 !text-sm opacity-60 cursor-not-allowed">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-hertford-dark to-hertford-blue p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-48 h-48 bg-hertford-green/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h3 className="font-heading text-2xl font-bold mb-3">Interested?</h3>
              <p className="text-gray-300 mb-6">
                Get in touch to discuss featuring your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/submit" className="btn-secondary">
                  Submit a Question
                </Link>
                <a
                  href="mailto:hello@doyouknowhertford.com"
                  className="btn-outline !border-white/20 !text-white hover:!text-white hover:!border-white/40"
                >
                  Get in Touch
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                hello@doyouknowhertford.com
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center pb-12">
        <Link href="/" className="text-gray-400 font-medium hover:text-hertford-green transition-colors text-sm">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
