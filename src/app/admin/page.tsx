'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { QuestionSubmission, getSubmissions, updateSubmissionStatus, SubmissionStatus } from '@/lib/submissions'

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<QuestionSubmission[]>([])
  const [filter, setFilter] = useState<SubmissionStatus | 'all'>('pending')
  const [selectedSubmission, setSelectedSubmission] = useState<QuestionSubmission | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions()
    }
  }, [isAuthenticated, filter])

  const loadSubmissions = () => {
    const all = getSubmissions()
    if (filter === 'all') {
      setSubmissions(all)
    } else {
      setSubmissions(all.filter(s => s.status === filter))
    }
  }

  const handleLogin = () => {
    // Simple admin password (in production, use proper auth)
    if (password === 'hertfordadmin') {
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  const handleApprove = (id: string) => {
    updateSubmissionStatus(id, 'approved', adminNotes || undefined)
    setSelectedSubmission(null)
    setAdminNotes('')
    loadSubmissions()
  }

  const handleReject = (id: string) => {
    if (!adminNotes.trim()) {
      alert('Please add a note explaining why this is being rejected')
      return
    }
    updateSubmissionStatus(id, 'rejected', adminNotes)
    setSelectedSubmission(null)
    setAdminNotes('')
    loadSubmissions()
  }

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Pending</span>
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Approved</span>
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Rejected</span>
    }
  }

  const getVerificationBadge = (submission: QuestionSubmission) => {
    if (submission.verificationType === 'source-verified') {
      return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">🔗 Has Source</span>
    }
    return <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">📝 Needs Verification</span>
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
          <p className="text-gray-500 mb-6 text-sm">
            Enter the admin password to review submissions
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all mb-4 text-center"
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
          />
          <button onClick={handleLogin} className="btn-primary w-full">
            Sign In
          </button>
        </div>
      </div>
    )
  }

  // Detail view
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
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-heading text-xl font-bold mb-1">Review Submission</h2>
              <p className="text-sm text-gray-400">
                Submitted {new Date(selectedSubmission.submittedAt).toLocaleDateString('en-GB', { 
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </p>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(selectedSubmission.status)}
              {getVerificationBadge(selectedSubmission)}
            </div>
          </div>

          {/* Business info */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-3">Business</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Name</p>
                <p className="font-medium">{selectedSubmission.businessName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-medium">{selectedSubmission.businessEmail}</p>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-3">Question</h3>
            <p className="font-medium text-lg mb-4">{selectedSubmission.question}</p>
            <div className="space-y-2">
              {selectedSubmission.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    index === selectedSubmission.correctAnswer
                      ? 'bg-green-100 border border-green-200'
                      : 'bg-white border border-gray-100'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    index === selectedSubmission.correctAnswer
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className={index === selectedSubmission.correctAnswer ? 'font-semibold text-green-800' : 'text-gray-600'}>
                    {option}
                  </span>
                  {index === selectedSubmission.correctAnswer && (
                    <span className="ml-auto text-green-600 text-xs font-semibold">✓ Correct</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4">
              <div>
                <span className="text-xs text-gray-400">Category:</span>
                <span className="text-xs font-medium text-gray-600 ml-1 capitalize">{selectedSubmission.category.replace('-', ' & ')}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400">Difficulty:</span>
                <span className="text-xs font-medium text-gray-600 ml-1 capitalize">{selectedSubmission.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Verification info */}
          <div className={`rounded-2xl p-5 mb-6 ${
            selectedSubmission.verificationType === 'source-verified' 
              ? 'bg-blue-50 border border-blue-100' 
              : 'bg-amber-50 border border-amber-100'
          }`}>
            <h3 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-3">
              Verification Details
            </h3>
            {selectedSubmission.verificationType === 'source-verified' ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Source URL</p>
                  <a 
                    href={selectedSubmission.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm break-all"
                  >
                    {selectedSubmission.sourceUrl}
                  </a>
                </div>
                {selectedSubmission.sourceDescription && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Source Description</p>
                    <p className="text-sm text-gray-700">{selectedSubmission.sourceDescription}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Justification from business</p>
                  <p className="text-sm text-gray-700 bg-white rounded-xl p-3 border border-amber-100">
                    {selectedSubmission.justification}
                  </p>
                </div>
                {selectedSubmission.sourceUrl && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Partial source (optional)</p>
                    <a 
                      href={selectedSubmission.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all"
                    >
                      {selectedSubmission.sourceUrl}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Admin action */}
          {selectedSubmission.status === 'pending' && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-sm mb-3">Admin Decision</h3>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes (required for rejection, optional for approval)"
                rows={3}
                className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all resize-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(selectedSubmission.id)}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleReject(selectedSubmission.id)}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors"
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          )}

          {/* Already reviewed */}
          {selectedSubmission.status !== 'pending' && selectedSubmission.adminNotes && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-sm mb-2">Admin Notes</h3>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                {selectedSubmission.adminNotes}
              </p>
              {selectedSubmission.reviewedAt && (
                <p className="text-xs text-gray-400 mt-2">
                  Reviewed {new Date(selectedSubmission.reviewedAt).toLocaleDateString('en-GB')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // List view
  const pendingCount = getSubmissions().filter(s => s.status === 'pending').length

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Review and manage question submissions</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold">
            {pendingCount} pending review
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8">
        {[
          { key: 'pending' as const, label: 'Pending' },
          { key: 'approved' as const, label: 'Approved' },
          { key: 'rejected' as const, label: 'Rejected' },
          { key: 'all' as const, label: 'All' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
              filter === tab.key
                ? 'bg-hertford-dark text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Submissions list */}
      {submissions.length === 0 ? (
        <div className="card-elevated text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
            <span className="text-3xl">📭</span>
          </div>
          <h3 className="font-heading text-lg font-bold mb-2">No submissions</h3>
          <p className="text-gray-500 text-sm">
            {filter === 'pending' ? 'No questions waiting for review.' : `No ${filter} submissions yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((submission) => (
            <button
              key={submission.id}
              onClick={() => setSelectedSubmission(submission)}
              className="w-full text-left bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate mb-1">{submission.question}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{submission.businessName}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-400">
                      {new Date(submission.submittedAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {getVerificationBadge(submission)}
                  {getStatusBadge(submission.status)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <Link href="/" className="text-gray-400 font-medium hover:text-hertford-green transition-colors text-sm">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
