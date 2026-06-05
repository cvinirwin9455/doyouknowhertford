import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-hertford-dark text-gray-400 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-heading text-hertford-gold font-bold text-lg mb-3">
              Do You Know Hertford?
            </h3>
            <p className="text-sm">
              The free quiz platform celebrating Hertford, Hertfordshire. 
              Test your local knowledge and compete on the leaderboard!
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/quiz" className="hover:text-hertford-gold transition-colors">Play Quiz</Link></li>
              <li><Link href="/leaderboard" className="hover:text-hertford-gold transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="font-bold text-white mb-3">For Businesses</h4>
            <p className="text-sm mb-2">
              Want your business featured in the quiz? Get your brand in front of local Hertford residents.
            </p>
            <Link href="/advertise" className="text-hertford-gold hover:underline text-sm font-medium">
              Learn More →
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Do You Know Hertford? All rights reserved.</p>
          <p className="mt-1 text-xs text-gray-500">
            All quiz questions are sourced from verified references.
          </p>
        </div>
      </div>
    </footer>
  )
}
