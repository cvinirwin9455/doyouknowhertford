import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Hertford_Castle_-_geograph.org.uk_-_1253078.jpg/1280px-Hertford_Castle_-_geograph.org.uk_-_1253078.jpg"
            alt="Hertford Castle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/20">
            <span className="w-2 h-2 bg-hertford-gold rounded-full animate-pulse" />
            Free to play — compete on the leaderboard
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 tracking-tight text-white">
            Do You Know
            <br />
            <span className="text-hertford-gold">Hertford?</span>
          </h1>

          <p className="text-xl text-gray-200 mb-10 max-w-xl mx-auto leading-relaxed">
            10 questions. 20 seconds each. How well do you really know 
            our county town? Prove it on the leaderboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz" className="btn-primary text-xl">
              Start the Quiz
            </Link>
            <Link href="/leaderboard" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 text-xl">
              Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-12 tracking-tight">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-hertford-green/10 flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="font-bold mb-2">Answer 10 Questions</h3>
              <p className="text-gray-500 text-sm">History, landmarks, geography, and more about Hertford.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-hertford-gold/10 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-bold mb-2">Beat the Clock</h3>
              <p className="text-gray-500 text-sm">20 seconds per question. Quick thinking wins!</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-100 flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-bold mb-2">Climb the Leaderboard</h3>
              <p className="text-gray-500 text-sm">Compete with other locals. Daily, weekly, and all-time rankings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50 text-center">
        <h2 className="font-heading text-2xl font-bold mb-4">Ready?</h2>
        <p className="text-gray-500 mb-8">No sign-up fees. Just pick a username and play.</p>
        <Link href="/quiz" className="btn-primary text-lg">
          Play Now
        </Link>
      </section>
    </div>
  )
}
