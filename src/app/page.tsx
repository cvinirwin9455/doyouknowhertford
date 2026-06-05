import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero Section — Full-width Hertford imagery */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background image — Hertford Castle */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Hertford_Castle_-_geograph.org.uk_-_1253078.jpg/1280px-Hertford_Castle_-_geograph.org.uk_-_1253078.jpg"
            alt="Hertford Castle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <div className="max-w-5xl mx-auto text-center px-4 py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/20">
            <span className="w-2 h-2 bg-hertford-gold rounded-full animate-pulse" />
            Free to play — Win prizes from local businesses
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 tracking-tight text-white">
            Do You Know
            <br />
            <span className="text-hertford-gold">Hertford?</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            From the Castle to the River Lea, from McMullen&apos;s Brewery to Hartham Common — 
            how well do you really know our county town?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz" className="btn-primary text-xl">
              Start the Quiz
            </Link>
            <Link href="/leaderboard" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 text-xl">
              View Leaderboard
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div>
              <p className="text-3xl font-bold text-white">20+</p>
              <p className="text-sm text-gray-300">Questions</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">🎁</p>
              <p className="text-sm text-gray-300">Weekly Prizes</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">Free</p>
              <p className="text-sm text-gray-300">Forever</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Hertford Landmarks Strip */}
      <section className="py-6 bg-hertford-dark overflow-hidden">
        <div className="flex items-center justify-center gap-8 text-gray-400 text-sm font-medium whitespace-nowrap animate-fade-in">
          <span>🏰 Hertford Castle</span>
          <span className="text-gray-600">•</span>
          <span>🌊 River Lea</span>
          <span className="text-gray-600">•</span>
          <span>🍺 McMullen&apos;s</span>
          <span className="text-gray-600">•</span>
          <span>🌳 Hartham Common</span>
          <span className="text-gray-600">•</span>
          <span>🎭 Hertford Theatre</span>
          <span className="text-gray-600">•</span>
          <span>⛪ All Saints Church</span>
        </div>
      </section>

      {/* How It Works — with local context */}
      <section className="section-padding bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">How it works</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              Prove you&apos;re a true Hertford local
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-hertford-green/10 flex items-center justify-center group-hover:bg-hertford-green/20 transition-colors">
                <span className="text-3xl">🏰</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Answer Questions</h3>
              <p className="text-gray-500 leading-relaxed">
                From Hertford Castle&apos;s history to which pubs are on Fore Street — 
                10 questions test your local knowledge.
              </p>
            </div>
            <div className="card text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-hertford-gold/10 flex items-center justify-center group-hover:bg-hertford-gold/20 transition-colors">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Beat the Clock</h3>
              <p className="text-gray-500 leading-relaxed">
                20 seconds per question. If you really know Hertford, 
                you won&apos;t need to think twice!
              </p>
            </div>
            <div className="card text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <span className="text-3xl">🎁</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Win Local Prizes</h3>
              <p className="text-gray-500 leading-relaxed">
                Top the weekly leaderboard and win prizes from 
                Hertford businesses — free coffee, vouchers, and more!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hertford Image Gallery Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">Our Town</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              How well do you know these spots?
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/River_Lea_-_Hertford_%281%29.jpg/640px-River_Lea_-_Hertford_%281%29.jpg"
                alt="River Lea, Hertford"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-semibold text-sm">River Lea</p>
            </div>
            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Hertford_-_panoramio.jpg/640px-Hertford_-_panoramio.jpg"
                alt="Hertford Town Centre"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-semibold text-sm">Town Centre</p>
            </div>
            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Hertford_Castle_-_geograph.org.uk_-_1253078.jpg/640px-Hertford_Castle_-_geograph.org.uk_-_1253078.jpg"
                alt="Hertford Castle Gatehouse"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-semibold text-sm">The Castle</p>
            </div>
            <div className="relative group overflow-hidden rounded-2xl aspect-square md:col-span-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Hartham_Common_-_geograph.org.uk_-_1517858.jpg/1280px-Hartham_Common_-_geograph.org.uk_-_1517858.jpg"
                alt="Hartham Common"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-semibold text-sm">Hartham Common</p>
            </div>
            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/All_Saints%2C_Hertford_%281%29_-_geograph.org.uk_-_2261180.jpg/640px-All_Saints%2C_Hertford_%281%29_-_geograph.org.uk_-_2261180.jpg"
                alt="All Saints Church, Hertford"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-semibold text-sm">All Saints Church</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">Categories</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              Something for everyone
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '🏰', name: 'History', desc: 'Castle, wars & origins', color: 'from-amber-50 to-orange-50 border-amber-100' },
              { emoji: '⛪', name: 'Landmarks', desc: 'Churches, parks & buildings', color: 'from-blue-50 to-indigo-50 border-blue-100' },
              { emoji: '👥', name: 'People', desc: 'Famous locals & visitors', color: 'from-purple-50 to-pink-50 border-purple-100' },
              { emoji: '🎭', name: 'Culture', desc: 'Arts, music & traditions', color: 'from-rose-50 to-red-50 border-rose-100' },
              { emoji: '🍺', name: 'Food & Drink', desc: 'Pubs, restaurants & breweries', color: 'from-yellow-50 to-amber-50 border-yellow-100' },
              { emoji: '🏪', name: 'Local Business', desc: 'Shops & services', color: 'from-green-50 to-emerald-50 border-green-100' },
              { emoji: '🗺️', name: 'Geography', desc: 'Rivers, areas & transport', color: 'from-cyan-50 to-teal-50 border-cyan-100' },
              { emoji: '📅', name: 'Events', desc: 'Markets, festivals & more', color: 'from-violet-50 to-purple-50 border-violet-100' },
            ].map((cat) => (
              <div 
                key={cat.name} 
                className={`bg-gradient-to-br ${cat.color} border rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-200 cursor-default`}
              >
                <div className="text-3xl mb-3">{cat.emoji}</div>
                <p className="font-semibold text-gray-700 text-sm">{cat.name}</p>
                <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/River_Lea_-_Hertford_%281%29.jpg/1280px-River_Lea_-_Hertford_%281%29.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-hertford-dark/90" />
        </div>

        <div className="max-w-4xl mx-auto text-center text-white">
          <span className="text-5xl mb-6 block">🎁</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Win prizes every week
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto">
            Top the leaderboard and win real prizes from Hertford businesses — 
            free food, drinks, vouchers, and more. Collected in person from local shops.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <p className="text-hertford-gold font-bold text-lg mb-1">☕ Free Coffee</p>
              <p className="text-sm text-gray-400">from local cafes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <p className="text-hertford-gold font-bold text-lg mb-1">🍺 Free Drinks</p>
              <p className="text-sm text-gray-400">from Hertford pubs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <p className="text-hertford-gold font-bold text-lg mb-1">🎫 Vouchers</p>
              <p className="text-sm text-gray-400">from local shops</p>
            </div>
          </div>
          <Link href="/quiz" className="btn-secondary text-xl">
            Play & Win
          </Link>
        </div>
      </section>

      {/* Social Proof */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">What locals say</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              Loved by Hertford residents
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
                &quot;I walk past Hertford Castle every day and didn&apos;t know half these facts! 
                Brilliant quiz that actually teaches you about our town.&quot;
              </p>
              <p className="font-semibold text-sm text-gray-900">Sarah T.</p>
              <p className="text-xs text-gray-500">Bengeo resident, 20 years</p>
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
                &quot;Won a free coffee from a local cafe last week! 
                Love that the prizes come from actual Hertford businesses.&quot;
              </p>
              <p className="font-semibold text-sm text-gray-900">Marcus P.</p>
              <p className="text-xs text-gray-500">Quiz player, Hertford town centre</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA for Businesses */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-hertford-dark to-hertford-blue p-12 md:p-16 text-center text-white">
            <div className="absolute inset-0 -z-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-hertford-green/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-hertford-gold/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <p className="text-hertford-gold text-sm font-semibold uppercase tracking-wider mb-4">For Hertford businesses</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Get your business in the quiz
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
                Pubs, cafes, shops, salons — have locals learn fun facts about your business 
                while competing for your prizes. They visit you to collect!
              </p>
              <Link href="/advertise" className="btn-secondary">
                See Plans & Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA with Hertford background */}
      <section className="relative section-padding text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Hartham_Common_-_geograph.org.uk_-_1517858.jpg/1280px-Hartham_Common_-_geograph.org.uk_-_1517858.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/90" />
        </div>
        <div className="max-w-2xl mx-auto relative">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Ready to prove you&apos;re a true local?
          </h2>
          <p className="text-xl text-gray-500 mb-8">
            10 questions. 20 seconds each. Win prizes from Hertford businesses.
          </p>
          <Link href="/quiz" className="btn-primary text-xl">
            Start Playing Now
          </Link>
        </div>
      </section>
    </div>
  )
}
