'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QuizCategory } from '@/lib/types'
import { saveSubmission, isValidSourceUrl, VerificationType } from '@/lib/submissions'

const categories: { value: QuizCategory; label: string }[] = [
  { value: 'history', label: 'History' },
  { value: 'landmarks', label: 'Landmarks' },
  { value: 'people', label: 'People' },
  { value: 'events', label: 'Events' },
  { value: 'food-drink', label: 'Food & Drink' },
  { value: 'local-business', label: 'Local Business' },
  { value: 'geography', label: 'Geography' },
  { value: 'culture', label: 'Culture' },
]

export default function SubmitPage() {
  const [step, setStep] = useState<'form' | 'verification' | 'success'>('form')
  
  // Form fields
  const [businessName, setBusinessName] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState<number>(0)
  const [category, setCategory] = useState<QuizCategory>('local-business')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  
  // Verification fields
  const [sourceUrl, setSourceUrl] = useState('')
  const [sourceDescription, setSourceDescription] = useState('')
  const [justification, setJustification] = useState('')
  const [verificationType, setVerificationType] = useState<VerificationType>('source-verified')
  
  // UI state
  const [errors, setErrors] = useState<string[]>([])
  const [sourceUrlValid, setSourceUrlValid] = useState<boolean | null>(null)

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const validateForm = (): boolean => {
    const newErrors: string[] = []
    
    if (!businessName.trim()) newErrors.push('Business name is required')
    if (!businessEmail.trim() || !businessEmail.includes('@')) newErrors.push('Valid email is required')
    if (!question.trim()) newErrors.push('Question text is required')
    if (question.trim().length < 10) newErrors.push('Question must be at least 10 characters')
    
    const filledOptions = options.filter(o => o.trim())
    if (filledOptions.length < 4) newErrors.push('All 4 answer options are required')
    
    // Check for duplicate options
    const uniqueOptions = new Set(options.map(o => o.trim().toLowerCase()))
    if (uniqueOptions.size < 4) newErrors.push('All options must be unique')
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleNextStep = () => {
    if (validateForm()) {
      setStep('verification')
    }
  }

  const handleSourceUrlChange = (url: string) => {
    setSourceUrl(url)
    if (url.trim()) {
      setSourceUrlValid(isValidSourceUrl(url))
    } else {
      setSourceUrlValid(null)
    }
  }

  const handleSubmit = () => {
    // Validate verification step
    const newErrors: string[] = []
    
    if (verificationType === 'source-verified') {
      if (!sourceUrl.trim()) newErrors.push('Source URL is required for verified questions')
      if (sourceUrl.trim() && !isValidSourceUrl(sourceUrl)) newErrors.push('Please enter a valid URL')
      if (!sourceDescription.trim()) newErrors.push('Please describe the source briefly')
    } else {
      if (!justification.trim()) newErrors.push('Justification is required for admin review')
      if (justification.trim().length < 30) newErrors.push('Justification must be at least 30 characters — explain why your answer is accurate')
    }
    
    setErrors(newErrors)
    if (newErrors.length > 0) return
    
    // Save submission
    saveSubmission({
      businessName: businessName.trim(),
      businessEmail: businessEmail.trim(),
      question: question.trim(),
      options: options.map(o => o.trim()) as [string, string, string, string],
      correctAnswer,
      category,
      difficulty,
      verificationType,
      sourceUrl: sourceUrl.trim() || undefined,
      sourceDescription: sourceDescription.trim() || undefined,
      justification: justification.trim() || undefined,
    })
    
    setStep('success')
  }

  // Success screen
  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 pt-28">
        <div className="card-elevated text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="font-heading text-2xl font-bold mb-3">Question Submitted!</h2>
          <p className="text-gray-500 mb-6">
            {verificationType === 'source-verified' 
              ? 'Your question has been submitted with a verified source. Our team will review it shortly.'
              : 'Your question has been submitted for admin review. We\'ll check your justification and get back to you.'
            }
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left">
            <p className="text-sm text-gray-500 mb-1">Your question:</p>
            <p className="font-medium text-gray-900">{question}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setStep('form')
                setQuestion('')
                setOptions(['', '', '', ''])
                setSourceUrl('')
                setSourceDescription('')
                setJustification('')
                setErrors([])
              }}
              className="btn-primary w-full"
            >
              Submit Another Question
            </button>
            <Link href="/" className="btn-outline w-full">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Verification step
  if (step === 'verification') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 pt-28">
        <div className="card-elevated">
          {/* Header */}
          <div className="mb-8">
            <button onClick={() => setStep('form')} className="text-sm text-gray-400 hover:text-hertford-green transition-colors mb-4 inline-flex items-center gap-1">
              ← Back to question
            </button>
            <h2 className="font-heading text-2xl font-bold mb-2">Verify Your Answer</h2>
            <p className="text-gray-500">
              All questions must be backed by accurate, verifiable sources. This ensures quiz quality and trust.
            </p>
          </div>

          {/* Question preview */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-8">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Your question</p>
            <p className="font-medium text-gray-900 mb-2">{question}</p>
            <p className="text-sm text-hertford-green font-medium">
              Correct answer: {options[correctAnswer]}
            </p>
          </div>

          {/* Verification type selector */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              How can you verify this answer?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setVerificationType('source-verified')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  verificationType === 'source-verified'
                    ? 'border-hertford-green bg-hertford-green/5'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">🔗</span>
                  <span className="font-semibold text-sm">I have a source URL</span>
                </div>
                <p className="text-xs text-gray-500">
                  Link to an official website, article, or document that confirms your answer.
                </p>
              </button>
              <button
                onClick={() => setVerificationType('needs-admin-review')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  verificationType === 'needs-admin-review'
                    ? 'border-hertford-gold bg-hertford-gold/5'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">📝</span>
                  <span className="font-semibold text-sm">Submit for admin review</span>
                </div>
                <p className="text-xs text-gray-500">
                  No URL available? Explain why your answer is accurate and our team will verify.
                </p>
              </button>
            </div>
          </div>

          {/* Source verified fields */}
          {verificationType === 'source-verified' && (
            <div className="space-y-5 mb-8 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Source URL *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => handleSourceUrlChange(e.target.value)}
                    placeholder="https://www.example.com/article"
                    className={`w-full px-5 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-4 ${
                      sourceUrlValid === true ? 'border-green-300 focus:border-green-400 focus:ring-green-100' :
                      sourceUrlValid === false ? 'border-red-300 focus:border-red-400 focus:ring-red-100' :
                      'border-gray-100 focus:border-hertford-green focus:ring-hertford-green/10'
                    }`}
                  />
                  {sourceUrlValid === true && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>
                  )}
                  {sourceUrlValid === false && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">✗</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Link to official website, council page, news article, or historical record
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Describe the source *
                </label>
                <input
                  type="text"
                  value={sourceDescription}
                  onChange={(e) => setSourceDescription(e.target.value)}
                  placeholder="e.g. Official Hertford Town Council website, business history page"
                  className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
                />
              </div>
            </div>
          )}

          {/* Admin review fields */}
          {verificationType === 'needs-admin-review' && (
            <div className="space-y-5 mb-8 animate-fade-in">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
                <div className="flex gap-3">
                  <span className="text-amber-500 text-lg">⚠️</span>
                  <div>
                    <p className="text-sm font-medium text-amber-800">Admin review required</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Without a verifiable source URL, your question will need to be manually reviewed by our team. 
                      Please provide a clear justification for why your answer is accurate.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Justification *
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Explain why your question and answer are accurate. For example: 'I am the owner of this business and can confirm we were established in 1987. This is displayed on our shopfront signage and printed menus.'"
                  rows={5}
                  className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Minimum 30 characters. The more detail you provide, the faster we can approve.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Source URL (optional)
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => handleSourceUrlChange(e.target.value)}
                  placeholder="https://... (if you have a partial source)"
                  className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
                />
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
              <ul className="space-y-1">
                {errors.map((error, i) => (
                  <li key={i} className="text-sm text-red-700 flex gap-2">
                    <span>•</span> {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit */}
          <button onClick={handleSubmit} className="btn-primary w-full">
            Submit Question for Review
          </button>
        </div>
      </div>
    )
  }

  // Form step
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 pt-28">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">For businesses</p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Submit a Quiz Question
        </h1>
        <p className="text-gray-500 text-lg">
          Create a fun question about your business for Hertford locals to answer.
        </p>
      </div>

      <div className="card-elevated">
        {/* Business details */}
        <div className="space-y-5 mb-8">
          <h3 className="font-semibold text-sm text-gray-400 uppercase tracking-wider">Your Business</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. The Old Barge"
                className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="you@business.com"
                className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="space-y-5 mb-8">
          <h3 className="font-semibold text-sm text-gray-400 uppercase tracking-wider">Your Question</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Question *</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What year was The Old Barge pub established in Hertford?"
              rows={3}
              className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all resize-none"
            />
          </div>

          {/* Answer options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Answer Options * <span className="text-gray-400 font-normal">(select the correct one)</span>
            </label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <button
                    onClick={() => setCorrectAnswer(index)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                      correctAnswer === index
                        ? 'bg-hertford-green text-white shadow-md shadow-hertford-green/20'
                        : 'bg-gray-50 text-gray-400 border border-gray-100 hover:border-hertford-green/30'
                    }`}
                    title={correctAnswer === index ? 'This is the correct answer' : 'Click to mark as correct'}
                  >
                    {String.fromCharCode(65 + index)}
                  </button>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
                  />
                  {correctAnswer === index && (
                    <span className="text-hertford-green text-xs font-semibold whitespace-nowrap">✓ Correct</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Click the letter to select which answer is correct
            </p>
          </div>

          {/* Category & Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as QuizCategory)}
                className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all bg-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
            <ul className="space-y-1">
              {errors.map((error, i) => (
                <li key={i} className="text-sm text-red-700 flex gap-2">
                  <span>•</span> {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next */}
        <button onClick={handleNextStep} className="btn-primary w-full">
          Next — Verify Your Answer
        </button>
        <p className="text-center text-xs text-gray-400 mt-4">
          All questions require source verification before going live
        </p>
      </div>

      <div className="text-center mt-8">
        <Link href="/advertise" className="text-gray-400 font-medium hover:text-hertford-green transition-colors text-sm">
          ← Back to Advertise
        </Link>
      </div>
    </div>
  )
}
