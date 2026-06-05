import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center text-white font-bold text-lg">
                H
              </div>
              <h3 className="font-heading font-bold text-lg text-gray-900">
                Do You Know Hertford?
              </h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              The free quiz platform celebrating Hertford, Hertfordshire. 
              Test your local knowledge, compete on leaderboards, and discover 
              amazing facts about our town.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Play</h4>
            <ul className="space-y-3">
              <li><Link href="/quiz" className="text-gray-500 hover:text-hertford-green transition-colors text-sm">Start Quiz</Link></li>
              <li><Link href="/leaderboard" className="text-gray-500 hover:text-hertford-green transition-colors text-sm">Leaderboard</Link></li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Business</h4>
            <ul className="space-y-3">
              <li><Link href="/advertise" className="text-gray-500 hover:text-hertford-green transition-colors text-sm">Advertise</Link></li>
              <li><a href="mailto:hello@doyouknowhertford.com" className="text-gray-500 hover:text-hertford-green transition-colors text-sm">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Do You Know Hertford? All rights reserved.
          </p>
          <p className="text-gray-400 text-xs">
            All questions verified from official sources.
          </p>
        </div>
      </div>
    </footer>
  )
}
