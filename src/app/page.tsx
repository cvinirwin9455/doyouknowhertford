import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-hertford-dark via-hertford-blue to-hertford-dark">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-hertford-green/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-hertford-gold/10 rounded-full blur-3xl" />
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
