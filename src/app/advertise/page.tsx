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
            Feature your business in quiz questions, offer a weekly prize, and bring 
            customers through your door — naturally.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-gray-50/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-center mb-12">How it works</h2>
          <div className="space-y-6">
            {[
              { step: '01', title: 'Sign up & choose a plan', desc: 'Register your business and pick the tier that suits you.' },
              { step: '02', title: 'Offer a weekly prize', desc: 'All businesses offer a prize for the weekly winner — like a free coffee, 20% off, or a voucher. Winners collect from your shop, bringing them right to you!' },
              { step: '03', title: 'Submit your quiz question', desc: 'Create a fun, verifiable question about your business for players to answer.' },
              { step: '04', title: 'Get discovered every week', desc: 'Your brand, question, and prize appear in the quiz and on the leaderboard. Players compete to win YOUR prize!' },
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

      {/* Prize requirement explainer */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-hertford-gold/10 via-amber-50 to-hertford-gold/5 border border-hertford-gold/20 rounded-3xl p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-hertford-gold/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎁</span>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold mb-2">About the Prize Requirement</h2>
                <p className="text-gray-600">
                  Every advertiser contributes a weekly prize for our quiz winners. Here&apos;s why it works:
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl p-5 border border-amber-100">
                <h4 className="font-bold text-sm mb-2">🏆 For Players</h4>
                <p className="text-sm text-gray-600">
                  Real prizes keep players coming back weekly. More players = more eyes on your brand.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-amber-100">
                <h4 className="font-bold text-sm mb-2">🏪 For Your Business</h4>
                <p className="text-sm text-gray-600">
                  Winners collect prizes from you in person — guaranteed footfall and a new customer introduction.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-amber-100">
              <h4 className="font-bold text-sm mb-3">Popular prize examples:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  '☕ Free coffee & cake for 2',
                  '🍺 2-for-1 drinks',
                  '💇 Free haircut/blowdry',
                  '🍕 Free pizza or main course',
                  '🎫 £10-£20 gift voucher',
                  '🛍️ 20% off shopping',
                ].map((p) => (
                  <p key={p} className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-gray-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              Simple, affordable plans
            </h2>
            <p className="text-gray-500 mt-2">All plans include the weekly prize requirement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic */}
            <div className="card text-center">
              <h3 className="font-bold text-lg mb-1 text-gray-900">Basic</h3>
              <p className="text-gray-400 text-sm mb-4">Get started</p>
              <div className="text-4xl font-black text-gray-900 mb-6">
                &pound;15<span className="text-base text-gray-400 font-normal">/mo</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-3 mb-6 text-left">
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> 2 quiz questions live</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Business name shown</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Monthly rotation</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">🎁</span> Weekly prize required</li>
              </ul>
              <Link href="/submit" className="btn-outline w-full !py-3 !text-sm">
                Get Started
              </Link>
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
              <ul className="text-sm text-gray-600 space-y-3 mb-6 text-left">
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> 5 quiz questions live</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Business logo shown</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Priority placement</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Basic analytics</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">🎁</span> Weekly prize required</li>
              </ul>
              <Link href="/submit" className="btn-primary w-full !py-3 !text-sm">
                Get Started
              </Link>
            </div>

            {/* Premium */}
            <div className="card text-center">
              <h3 className="font-bold text-lg mb-1 text-gray-900">Premium</h3>
              <p className="text-gray-400 text-sm mb-4">Maximum exposure</p>
              <div className="text-4xl font-black text-gray-900 mb-6">
                &pound;75<span className="text-base text-gray-400 font-normal">/mo</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-3 mb-6 text-left">
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> 10 quiz questions live</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Featured banner</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Top placement</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Full analytics</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span> Social media shout-out</li>
                <li className="flex gap-3 items-center"><span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">🎁</span> Weekly prize required</li>
              </ul>
              <Link href="/submit" className="btn-outline w-full !py-3 !text-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-center mb-8">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'What kind of prize do I need to offer?', a: 'Anything of value to a local customer — free drinks, a voucher, percentage off, free service, etc. Typically worth £10-£25.' },
              { q: 'How does the winner collect?', a: 'We email the winner with your business name. They come to you, show their winning notification, and you give them the prize. Simple!' },
              { q: 'How often do I need to give a prize?', a: 'You choose — weekly or monthly. Weekly gets more visibility on the leaderboard.' },
              { q: 'What if my question can\'t be verified by a URL?', a: 'No problem! Submit it with a written justification (e.g. "I\'m the owner, this is on our menu") and our admin team will verify it.' },
            ].map((item) => (
              <div key={item.q} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h4 className="font-bold text-sm mb-2">{item.q}</h4>
                <p className="text-sm text-gray-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-hertford-dark to-hertford-blue p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-48 h-48 bg-hertford-green/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h3 className="font-heading text-2xl font-bold mb-3">Ready to get started?</h3>
              <p className="text-gray-300 mb-6">
                Sign up in 5 minutes. Your business, your prize, your question — all in one go.
              </p>
              <Link href="/submit" className="btn-secondary">
                Sign Up Now
              </Link>
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
