import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden section-padding">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-hertford-green/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-hertford-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-hertford-green/10 text-hertford-green px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-hertford-green rounded-full animate-pulse" />
            Free to play — No sign-up needed
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 tracking-tight">
            How well do you
            <br />
            <span className="gradient-text">know Hertford?</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Test your knowledge of our county town. History, landmarks, 
            local businesses — prove you&apos;re a true Hertford local.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz" className="btn-primary text-xl">
              Start the Quiz
            </Link>
            <Link href="/leaderboard" className="btn-outline text-xl">
              View Leaderboard
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div>
              <p className="text-3xl font-bold text-gray-900">20+</p>
              <p className="text-sm text-gray-500">Questions</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-500">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">Free</p>
              <p className="text-sm text-gray-500">Forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-gray-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">How it works</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              Three steps to local fame
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-hertford-green/10 flex items-center justify-center group-hover:bg-hertford-green/20 transition-colors">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Answer Questions</h3>
              <p className="text-gray-500 leading-relaxed">
                10 randomised questions covering Hertford&apos;s history, 
                landmarks, and local businesses.
              </p>
            </div>
            <div className="card text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-hertford-gold/10 flex items-center justify-center group-hover:bg-hertford-gold/20 transition-colors">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Beat the Clock</h3>
              <p className="text-gray-500 leading-relaxed">
                20 seconds per question. Quick thinking 
                and local knowledge wins the day.
              </p>
            </div>
            <div className="card text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Climb the Board</h3>
              <p className="text-gray-500 leading-relaxed">
                Compete with other locals on daily, weekly, 
                and all-time leaderboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">Categories</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              Something for everyone
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '🏰', name: 'History', color: 'from-amber-50 to-orange-50 border-amber-100' },
              { emoji: '⛪', name: 'Landmarks', color: 'from-blue-50 to-indigo-50 border-blue-100' },
              { emoji: '👥', name: 'People', color: 'from-purple-50 to-pink-50 border-purple-100' },
              { emoji: '🎭', name: 'Culture', color: 'from-rose-50 to-red-50 border-rose-100' },
              { emoji: '🍺', name: 'Food & Drink', color: 'from-yellow-50 to-amber-50 border-yellow-100' },
              { emoji: '🏪', name: 'Local Business', color: 'from-green-50 to-emerald-50 border-green-100' },
              { emoji: '🗺️', name: 'Geography', color: 'from-cyan-50 to-teal-50 border-cyan-100' },
              { emoji: '📅', name: 'Events', color: 'from-violet-50 to-purple-50 border-violet-100' },
            ].map((cat) => (
              <div 
                key={cat.name} 
                className={`bg-gradient-to-br ${cat.color} border rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-200 cursor-default`}
              >
                <div className="text-3xl mb-3">{cat.emoji}</div>
                <p className="font-semibold text-gray-700 text-sm">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="section-padding bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">What people say</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              Loved by Hertford locals
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-elevated">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-hertford-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                &quot;I&apos;ve lived in Hertford for 20 years and still learned something new! 
                Absolutely brilliant quiz — shared it with everyone at work.&quot;
              </p>
              <p className="font-semibold text-sm text-gray-900">Sarah T.</p>
              <p className="text-xs text-gray-500">Hertford resident</p>
            </div>
            <div className="card-elevated">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-hertford-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                &quot;Way more engaging than a boring ad. I actually remembered 
                the local businesses from the quiz questions!&quot;
              </p>
              <p className="font-semibold text-sm text-gray-900">Marcus P.</p>
              <p className="text-xs text-gray-500">Quiz player</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA for Businesses */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-hertford-dark to-hertford-blue p-12 md:p-16 text-center text-white">
            <div className="absolute inset-0 -z-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-hertford-green/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-hertford-gold/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <p className="text-hertford-gold text-sm font-semibold uppercase tracking-wider mb-4">For local businesses</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Get your business in the quiz
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
                Have Hertford residents learn fun facts about your business 
                while they play. Non-intrusive, engaging, and effective.
              </p>
              <Link href="/advertise" className="btn-secondary">
                See Plans & Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Ready to prove yourself?
          </h2>
          <p className="text-xl text-gray-500 mb-8">
            10 questions. 20 seconds each. No sign-up required.
          </p>
          <Link href="/quiz" className="btn-primary text-xl">
            Start Playing Now
          </Link>
        </div>
      </section>
    </div>
  )
}
