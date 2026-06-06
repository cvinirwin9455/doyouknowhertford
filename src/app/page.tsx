export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-hertford-dark via-hertford-blue to-hertford-dark">
      <div className="max-w-xl mx-auto text-center text-white">
        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center shadow-lg shadow-hertford-green/20">
          <span className="text-4xl">🏛️</span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-4xl md:text-6xl font-black mb-4 tracking-tight">
          Do You Know <span className="text-hertford-gold">Hertford?</span>
        </h1>

        {/* Coming soon badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/20">
          <span className="w-2 h-2 bg-hertford-gold rounded-full animate-pulse" />
          Coming Soon
        </div>

        {/* Description */}
        <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-md mx-auto">
          A new quiz platform for Hertford locals. Test your knowledge, 
          compete on leaderboards, and win prizes from local businesses.
        </p>

        {/* Footer */}
        <p className="text-gray-600 text-xs">
          &copy; {new Date().getFullYear()} Do You Know Hertford? All rights reserved.
        </p>
      </div>
    </div>
  )
}
