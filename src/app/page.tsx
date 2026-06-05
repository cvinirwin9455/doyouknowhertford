import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-hertford-dark via-hertford-blue to-hertford-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
            Do You <span className="text-hertford-gold">Know</span> Hertford?
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Test your knowledge of our beautiful county town. History, landmarks, 
            local businesses and more — how well do you really know Hertford?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz" className="btn-secondary text-xl">
              🎯 Start the Quiz
            </Link>
            <Link href="/leaderboard" className="btn-primary text-xl">
              🏆 View Leaderboard
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-400">
            100% free — No sign-up required to play!
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="font-bold text-lg mb-2">Answer Questions</h3>
              <p className="text-gray-600">
                10 multiple-choice questions about Hertford&apos;s history, 
                landmarks, people, and local businesses.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="font-bold text-lg mb-2">Beat the Clock</h3>
              <p className="text-gray-600">
                You have 20 seconds per question. The faster you answer 
                correctly, the more points you earn!
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-bold text-lg mb-2">Top the Leaderboard</h3>
              <p className="text-gray-600">
                Compete with other locals! Climb the weekly and all-time 
                leaderboards to prove you know Hertford best.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">
            Quiz Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '🏰', name: 'History' },
              { emoji: '⛪', name: 'Landmarks' },
              { emoji: '👥', name: 'People' },
              { emoji: '🎭', name: 'Events & Culture' },
              { emoji: '🍺', name: 'Food & Drink' },
              { emoji: '🏪', name: 'Local Business' },
              { emoji: '🗺️', name: 'Geography' },
              { emoji: '🎉', name: 'Mixed' },
            ].map((cat) => (
              <div key={cat.name} className="card text-center hover:shadow-lg transition-shadow cursor-default">
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <p className="font-medium text-sm">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Businesses */}
      <section className="py-16 px-4 bg-hertford-green/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">
            🏪 Are You a Hertford Business?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Get your business featured in the quiz! Have players learn fun facts 
            about your business while you gain local visibility.
          </p>
          <Link href="/advertise" className="btn-primary">
            Advertise With Us
          </Link>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold mb-8">
            Why People Love It
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <p className="italic text-gray-600 mb-3">
                &quot;I&apos;ve lived in Hertford for 20 years and still learned something new!&quot;
              </p>
              <p className="font-bold text-sm text-hertford-green">— Local Resident</p>
            </div>
            <div className="card">
              <p className="italic text-gray-600 mb-3">
                &quot;Great way to discover local businesses. Much better than a boring ad!&quot;
              </p>
              <p className="font-bold text-sm text-hertford-green">— Quiz Player</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
