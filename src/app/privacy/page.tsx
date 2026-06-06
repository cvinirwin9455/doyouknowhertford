import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pt-28">
      <h1 className="font-heading text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>

      <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-3">1. Who We Are</h2>
          <p>Do You Know Hertford? (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website doyouknowhertford.com. We are the data controller responsible for your personal data.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-3">2. What Data We Collect</h2>
          <p>When you create an account, we collect:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Username</strong> — chosen by you, displayed publicly on the leaderboard</li>
            <li><strong>Email address</strong> — used for account login and password reset only</li>
            <li><strong>Quiz answers</strong> — which questions you answered and whether you got them correct</li>
            <li><strong>Quiz scores</strong> — your cumulative scores for the leaderboard</li>
          </ul>
          <p className="mt-3">We do <strong>not</strong> collect:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Your real name</li>
            <li>Your address or location</li>
            <li>Payment information</li>
            <li>Cookies for advertising or tracking</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-3">3. Why We Collect Your Data (Legal Basis)</h2>
          <p>We process your data based on:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Contract</strong> — to provide you with the quiz service and maintain your account</li>
            <li><strong>Legitimate interest</strong> — to operate the leaderboard and improve the quiz</li>
            <li><strong>Consent</strong> — for any optional features (you can withdraw consent at any time)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-3">4. How We Use Your Data</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To let you sign in and play the quiz</li>
            <li>To display your username on the public leaderboard</li>
            <li>To track which questions you&apos;ve answered (so you don&apos;t see repeats)</li>
            <li>To send password reset emails (only when you request it)</li>
          </ul>
          <p className="mt-3">We <strong>never</strong> sell, rent, or share your data with third parties for marketing.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-3">5. Where Your Data is Stored</h2>
          <p>Your data is stored securely using Supabase (database provider). All data is encrypted in transit (HTTPS) and at rest.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-3">6. How Long We Keep Your Data</h2>
          <p>We keep your data for as long as your account is active. If you delete your account, all your personal data is permanently removed immediately.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-3">7. Your Rights (GDPR)</h2>
          <p>Under the UK GDPR and Data Protection Act 2018, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Access</strong> — request a copy of all data we hold about you</li>
            <li><strong>Rectification</strong> — correct any inaccurate data</li>
            <li><strong>Erasure</strong> — delete your account and all associated data</li>
            <li><strong>Portability</strong> — receive your data in a portable format</li>
            <li><strong>Object</strong> — object to processing of your data</li>
            <li><strong>Restrict</strong> — request limited processing of your data</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, you can <Link href="/delete-account" className="text-hertford-green hover:underline font-medium">delete your account</Link> directly or contact us.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-3">8. Cookies</h2>
          <p>We use only <strong>essential cookies</strong> required for the website to function:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Authentication cookie</strong> — keeps you signed in between visits</li>
          </ul>
          <p className="mt-3">We do <strong>not</strong> use analytics cookies, advertising cookies, or any third-party tracking.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-3">9. Children</h2>
          <p>Our service is not directed at children under 13. We do not knowingly collect data from children under 13. If you believe a child has provided us with personal data, please contact us.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-3">10. Delete Your Account</h2>
          <p>You can delete your account and all associated data at any time by visiting the <Link href="/delete-account" className="text-hertford-green hover:underline font-medium">Delete Account</Link> page. This action is permanent and cannot be undone.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-3">11. Changes to This Policy</h2>
          <p>We may update this policy from time to time. We will notify you of significant changes by posting a notice on the website.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-3">12. Contact Us</h2>
          <p>If you have questions about this privacy policy or wish to exercise your data rights, contact us at:</p>
          <p className="mt-2 font-medium">doyouknowhertford@gmail.com</p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link href="/" className="text-gray-400 hover:text-hertford-green transition-colors text-sm">← Back to Home</Link>
      </div>
    </div>
  )
}
