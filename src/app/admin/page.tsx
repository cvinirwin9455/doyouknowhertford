'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { QuestionSubmission, getSubmissions, updateSubmissionStatus, SubmissionStatus } from '@/lib/submissions'
import { getBusinessSignups, updateBusinessStatus, getPrizes, addPrize, awardPrize, getCurrentWeekStart, formatWeekDisplay } from '@/lib/prizes'
import { getWeeklyWinner, getLeaderboard } from '@/lib/leaderboard'
import { BusinessSignup, Prize, LeaderboardEntry } from '@/lib/types'

type AdminTab = 'questions' | 'businesses' | 'prizes'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<AdminTab>('questions')

  // Questions state
  const [submissions, setSubmissions] = useState<QuestionSubmission[]>([])
  const [questionFilter, setQuestionFilter] = useState<SubmissionStatus | 'all'>('pending')
  const [selectedSubmission, setSelectedSubmission] = useState<QuestionSubmission | null>(null)
  const [adminNotes, setAdminNotes] = useState('')

  // Business state
  const [businesses, setBusinesses] = useState<BusinessSignup[]>([])

  // Prize state
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [weeklyWinner, setWeeklyWinner] = useState<LeaderboardEntry | null>(null)
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated, questionFilter, activeTab])

  const loadData = () => {
    // Questions
    const allSubs = getSubmissions()
    setSubmissions(questionFilter === 'all' ? allSubs : allSubs.filter(s => s.status === questionFilter))
    
    // Businesses
    setBusinesses(getBusinessSignups())
    
    // Prizes
    setPrizes(getPrizes())
    setWeeklyWinner(getWeeklyWinner())
    setWeeklyLeaderboard(getLeaderboard('week').slice(0, 10))
  }

  const handleLogin = () => {
    if (password === 'hertfordadmin') {
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  // Question actions
  const handleApproveQuestion = (id: string) => {
    updateSubmissionStatus(id, 'approved', adminNotes || undefined)
    setSelectedSubmission(null)
    setAdminNotes('')
    loadData()
  }

  const handleRejectQuestion = (id: string) => {
    if (!adminNotes.trim()) {
      alert('Please add a note explaining the rejection')
      return
    }
    updateSubmissionStatus(id, 'rejected', adminNotes)
    setSelectedSubmission(null)
    setAdminNotes('')
    loadData()
  }

  // Business actions
  const handleActivateBusiness = (id: string) => {
    updateBusinessStatus(id, 'active')
    loadData()
  }

  const handlePauseBusiness = (id: string) => {
    updateBusinessStatus(id, 'paused')
    loadData()
  }

  // Prize actions
  const handleCreatePrize = (business: BusinessSignup) => {
    addPrize({
      businessName: business.businessName,
      businessEmail: business.email,
      prizeDescription: business.prizeDescription,
      prizeValue: business.prizeValue,
      weekStarting: getCurrentWeekStart(),
    })
    loadData()
  }

  const handleAwardPrize = (prizeId: string) => {
    if (!weeklyWinner) {
      alert('No weekly winner yet — need at least one quiz score this week')
      return
    }
    awardPrize(prizeId, weeklyWinner.userId, weeklyWinner.username)
    loadData()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Pending</span>
      case 'approved': case 'active':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">{status === 'active' ? 'Active' : 'Approved'}</span>
      case 'rejected': case 'paused':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">{status === 'paused' ? 'Paused' : 'Rejected'}</span>
      case 'available':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Available</span>
      case 'awarded':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Awarded</span>
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">{status}</span>
    }
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-sm mx-auto px-4 py-12 pt-28">
        <div className="card-elevated text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-hertford-dark to-hertford-blue flex items-center justify-center">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">Admin Access</h2>
          <p className="text-gray-500 mb-6 text-sm">Enter password to manage the platform</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all mb-4 text-center"
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
          />
          <button onClick={handleLogin} className="btn-primary w-full">Sign In</button>
        </div>
      </div>
    )
  }

  // Question detail view
  if (selectedSubmission) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 pt-28">
        <button
          onClick={() => { setSelectedSubmission(null); setAdminNotes('') }}
          className="text-sm text-gray-400 hover:text-hertford-green transition-colors mb-6 inline-flex items-center gap-1"
        >
          ← Back to list
        </button>

        <div className="card-elevated">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-heading text-xl font-bold mb-1">Review Submission</h2>
              <p className="text-sm text-gray-400">
                {new Date(selectedSubmission.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            {getStatusBadge(selectedSubmission.status)}
          </div>

          {/* Business */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Business</p>
            <p className="font-medium">{selectedSubmission.businessName}</p>
            <p className="text-sm text-gray-500">{selectedSubmission.businessEmail}</p>
          </div>

          {/* Question */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Question</p>
            <p className="font-medium text-lg mb-3">{selectedSubmission.question}</p>
            <div className="space-y-2">
              {selectedSubmission.options.map((option, index) => (
                <div key={index} className={`flex items-center gap-3 p-2 rounded-lg ${index === selectedSubmission.correctAnswer ? 'bg-green-100 border border-green-200' : 'bg-white border border-gray-100'}`}>
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${index === selectedSubmission.correctAnswer ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className={index === selectedSubmission.correctAnswer ? 'font-semibold text-green-800' : 'text-gray-600'}>{option}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification */}
          <div className={`rounded-2xl p-5 mb-6 ${selectedSubmission.verificationType === 'source-verified' ? 'bg-blue-50 border border-blue-100' : 'bg-amber-50 border border-amber-100'}`}>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Verification</p>
            {selectedSubmission.verificationType === 'source-verified' ? (
              <>
                <p className="text-sm mb-1"><strong>Source:</strong> {selectedSubmission.sourceDescription}</p>
                {selectedSubmission.sourceUrl && (
                  <a href={selectedSubmission.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">
                    {selectedSubmission.sourceUrl}
                  </a>
                )}
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-amber-800 mb-1">Needs admin verification</p>
                <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-amber-100">
                  {selectedSubmission.justification}
                </p>
              </>
            )}
          </div>

          {/* Admin action */}
          {selectedSubmission.status === 'pending' && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-sm mb-3">Your Decision</h3>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes (required for rejection)"
                rows={3}
                className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all resize-none mb-4"
              />
              <div className="flex gap-3">
                <button onClick={() => handleApproveQuestion(selectedSubmission.id)} className="flex-1 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors">
                  ✓ Approve
                </button>
                <button onClick={() => handleRejectQuestion(selectedSubmission.id)} className="flex-1 bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors">
                  ✗ Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Main dashboard
  const pendingQuestions = getSubmissions().filter(s => s.status === 'pending').length
  const pendingBusinesses = businesses.filter(b => b.status === 'pending').length
  const availablePrizes = prizes.filter(p => p.status === 'available').length

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 pt-28">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage questions, businesses, and prize awarding</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <p className="text-2xl font-bold text-amber-700">{pendingQuestions}</p>
          <p className="text-xs text-amber-600">Questions pending</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-2xl font-bold text-blue-700">{pendingBusinesses}</p>
          <p className="text-xs text-blue-600">Businesses pending</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
          <p className="text-2xl font-bold text-green-700">{availablePrizes}</p>
          <p className="text-xs text-green-600">Prizes to award</p>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
          <p className="text-2xl font-bold text-purple-700">{weeklyWinner ? `@${weeklyWinner.username}` : '—'}</p>
          <p className="text-xs text-purple-600">This week&apos;s leader</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-100 pb-4">
        {[
          { key: 'questions' as AdminTab, label: 'Questions', count: pendingQuestions },
          { key: 'businesses' as AdminTab, label: 'Businesses', count: pendingBusinesses },
          { key: 'prizes' as AdminTab, label: 'Prizes', count: availablePrizes },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === tab.key
                ? 'bg-hertford-dark text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                activeTab === tab.key ? 'bg-white text-hertford-dark' : 'bg-red-500 text-white'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* QUESTIONS TAB */}
      {activeTab === 'questions' && (
        <div>
          <div className="flex gap-2 mb-6">
            {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
              <button
                key={f}
                onClick={() => setQuestionFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  questionFilter === f ? 'bg-hertford-green text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No {questionFilter === 'all' ? '' : questionFilter} submissions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubmission(sub)}
                  className="w-full text-left bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{sub.question}</p>
                      <p className="text-xs text-gray-400 mt-1">{sub.businessName} &middot; {new Date(sub.submittedAt).toLocaleDateString('en-GB')}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {sub.verificationType === 'needs-admin-review' && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">⚠️ Needs verify</span>
                      )}
                      {getStatusBadge(sub.status)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BUSINESSES TAB */}
      {activeTab === 'businesses' && (
        <div>
          {businesses.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No business signups yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {businesses.map((biz) => (
                <div key={biz.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{biz.businessName}</h3>
                      <p className="text-sm text-gray-500">{biz.contactName} &middot; {biz.email}</p>
                      <p className="text-xs text-gray-400 mt-1">Signed up {new Date(biz.signedUpAt).toLocaleDateString('en-GB')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full capitalize">{biz.tier}</span>
                      {getStatusBadge(biz.status)}
                    </div>
                  </div>

                  {/* Prize offering */}
                  <div className="bg-hertford-gold/5 border border-hertford-gold/20 rounded-xl p-4 mb-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Prize Offering</p>
                    <p className="font-medium text-sm">{biz.prizeDescription}</p>
                    <p className="text-xs text-gray-500 mt-1">~{biz.prizeValue} &middot; {biz.prizeFrequency}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {biz.status === 'pending' && (
                      <button onClick={() => handleActivateBusiness(biz.id)} className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
                        Activate
                      </button>
                    )}
                    {biz.status === 'active' && (
                      <>
                        <button onClick={() => handleCreatePrize(biz)} className="px-4 py-2 bg-hertford-gold text-gray-900 rounded-full text-sm font-medium hover:bg-hertford-gold-light transition-colors">
                          🎁 Add Prize to This Week
                        </button>
                        <button onClick={() => handlePauseBusiness(biz.id)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors">
                          Pause
                        </button>
                      </>
                    )}
                    {biz.status === 'paused' && (
                      <button onClick={() => handleActivateBusiness(biz.id)} className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PRIZES TAB */}
      {activeTab === 'prizes' && (
        <div>
          {/* This week's info */}
          <div className="bg-gradient-to-r from-hertford-gold/10 to-amber-50 border border-hertford-gold/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900">This Week</h3>
                <p className="text-sm text-gray-500">{formatWeekDisplay(getCurrentWeekStart())}</p>
              </div>
              {weeklyWinner && (
                <div className="text-right">
                  <p className="text-xs text-gray-400">Current leader</p>
                  <p className="font-bold text-hertford-green">@{weeklyWinner.username}</p>
                  <p className="text-xs text-gray-500">{weeklyWinner.score}/{weeklyWinner.totalQuestions} ({weeklyWinner.percentage}%)</p>
                </div>
              )}
            </div>

            {/* Weekly top 5 */}
            {weeklyLeaderboard.length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-amber-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Weekly Top Scorers</p>
                <div className="space-y-2">
                  {weeklyLeaderboard.slice(0, 5).map((entry, i) => (
                    <div key={`${entry.userId}-${entry.date}`} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center font-bold text-gray-400">#{i + 1}</span>
                        <span className="font-medium">@{entry.username}</span>
                      </div>
                      <span className="text-gray-500">{entry.score}/{entry.totalQuestions} ({entry.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prize list */}
          <h3 className="font-bold text-gray-900 mb-4">All Prizes</h3>
          {prizes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No prizes created yet. Activate a business and add their prize to this week&apos;s pool.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {prizes.sort((a, b) => new Date(b.weekStarting).getTime() - new Date(a.weekStarting).getTime()).map((prize) => (
                <div key={prize.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{prize.prizeDescription}</p>
                      <p className="text-sm text-gray-500">from {prize.businessName}</p>
                      <p className="text-xs text-gray-400 mt-1">Week of {formatWeekDisplay(prize.weekStarting)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {prize.prizeValue && <span className="text-xs text-gray-500">{prize.prizeValue}</span>}
                      {getStatusBadge(prize.status)}
                    </div>
                  </div>

                  {prize.status === 'available' && (
                    <button
                      onClick={() => handleAwardPrize(prize.id)}
                      className="px-4 py-2 bg-hertford-green text-white rounded-full text-sm font-medium hover:bg-hertford-green-light transition-colors"
                    >
                      🏆 Award to Weekly Winner{weeklyWinner ? ` (@${weeklyWinner.username})` : ''}
                    </button>
                  )}

                  {prize.status === 'awarded' && (
                    <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                      <p className="text-sm text-green-800">
                        Awarded to <strong>@{prize.winnerUsername}</strong> on {prize.awardedAt ? new Date(prize.awardedAt).toLocaleDateString('en-GB') : ''}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-12">
        <Link href="/" className="text-gray-400 font-medium hover:text-hertford-green transition-colors text-sm">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
