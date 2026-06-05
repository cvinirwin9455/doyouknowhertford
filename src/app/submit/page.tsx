'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QuizCategory } from '@/lib/types'
import { saveSubmission, isValidSourceUrl, VerificationType } from '@/lib/submissions'
import { registerBusiness } from '@/lib/prizes'

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
  const [step, setStep] = useState<'business' | 'prize' | 'question' | 'verification' | 'success'>('business')
  
  // Business fields
  const [businessName, setBusinessName] = useState('')
  const [contactName, setContactName] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [businessPhone, setBusinessPhone] = useState('')
  const [businessWebsite, setBusinessWebsite] = useState('')
  const [tier, setTier] = useState<'basic' | 'standard' | 'premium'>('standard')

  // Prize fields (required)
  const [prizeDescription, setPrizeDescription] = useState('')
  const [prizeValue, setPrizeValue] = useState('')
  const [prizeFrequency, setPrizeFrequency] = useState<'weekly' | 'monthly'>('weekly')

  // Question fields
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

  const validateBusiness = (): boolean => {
    const newErrors: string[] = []
    if (!businessName.trim()) newErrors.push('Business name is required')
    if (!contactName.trim()) newErrors.push('Contact name is required')
    if (!businessEmail.trim() || !businessEmail.includes('@')) newErrors.push('Valid email is required')
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const validatePrize = (): boolean => {
    const newErrors: string[] = []
    if (!prizeDescription.trim()) newErrors.push('Prize description is required')
    if (prizeDescription.trim().length < 10) newErrors.push('Please describe the prize in more detail (at least 10 characters)')
    if (!prizeValue.trim()) newErrors.push('Approximate prize value is required')
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const validateQuestion = (): boolean => {
    const newErrors: string[] = []
    if (!question.trim()) newErrors.push('Question text is required')
    if (question.trim().length < 10) newErrors.push('Question must be at least 10 characters')
    const filledOptions = options.filter(o => o.trim())
    if (filledOptions.length < 4) newErrors.push('All 4 answer options are required')
    const uniqueOptions = new Set(options.map(o => o.trim().toLowerCase()))
    if (uniqueOptions.size < 4) newErrors.push('All options must be unique')
    setErrors(newErrors)
    return newErrors.length === 0
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
    const newErrors: string[] = []
    
    if (verificationType === 'source-verified') {
      if (!sourceUrl.trim()) newErrors.push('Source URL is required for verified questions')
      if (sourceUrl.trim() && !isValidSourceUrl(sourceUrl)) newErrors.push('Please enter a valid URL')
      if (!sourceDescription.trim()) newErrors.push('Please describe the source briefly')
    } else {
      if (!justification.trim()) newErrors.push('Justification is required for admin review')
      if (justification.trim().length < 30) newErrors.push('Justification must be at least 30 characters')
    }
    
    setErrors(newErrors)
    if (newErrors.length > 0) return
    
    // Register the business with prize
    registerBusiness({
      businessName: businessName.trim(),
      contactName: contactName.trim(),
      email: businessEmail.trim(),
      phone: businessPhone.trim() || undefined,
      website: businessWebsite.trim() || undefined,
      tier,
      prizeDescription: prizeDescription.trim(),
      prizeValue: prizeValue.trim(),
      prizeFrequency,
    })

    // Save the question submission
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

  // Progress indicator
  const steps = ['Business', 'Prize', 'Question', 'Verify']
  const currentStepIndex = step === 'business' ? 0 : step === 'prize' ? 1 : step === 'question' ? 2 : step === 'verification' ? 3 : 4

  // Success screen
  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 pt-28">
        <div className="card-elevated text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-hertford-green to-hertford-green-light flex items-center justify-center">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="font-heading text-2xl font-bold mb-3">You&apos;re All Set!</h2>
          <p className="text-gray-500 mb-6">
            Your business has been registered and your question submitted for review.
          </p>
          
          <div className="space-y-3 text-left mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Your Question</p>
              <p className="font-medium text-sm">{question}</p>
            </div>
            <div className="bg-hertford-gold/10 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Your Prize Offering</p>
              <p className="font-medium text-sm">{prizeDescription}</p>
              <p className="text-xs text-gray-500 mt-1">Worth ~{prizeValue} &middot; {prizeFrequency}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>What happens next?</strong>
            </p>
            <ul className="text-xs text-blue-700 mt-2 space-y-1">
              <li>• We&apos;ll review your question within 48 hours</li>
              <li>• Once approved, it goes into the quiz rotation</li>
              <li>• Your prize will be featured on the leaderboard</li>
              <li>• We&apos;ll contact you when a winner needs their prize</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/" className="btn-primary w-full">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 pt-28">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">For businesses</p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Get Featured in the Quiz
        </h1>
        <p className="text-gray-500">
          Sign up your business, offer a weekly prize, and submit your quiz question.
        </p>
      </div>

      {/* Step progress */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < currentStepIndex ? 'bg-hertford-green text-white' :
              i === currentStepIndex ? 'bg-hertford-green text-white ring-4 ring-hertford-green/20' :
              'bg-gray-100 text-gray-400'
            }`}>
              {i < currentStepIndex ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === currentStepIndex ? 'text-gray-900' : 'text-gray-400'}`}>
              {s}
            </span>
            {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < currentStepIndex ? 'bg-hertford-green' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="card-elevated">
        {/* STEP 1: Business Details */}
        {step === 'business' && (
          <div className="animate-fade-in">
            <h2 className="font-heading text-xl font-bold mb-1">Your Business</h2>
            <p className="text-gray-500 text-sm mb-6">Tell us about your Hertford business.</p>

            <div className="space-y-5">
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Contact person name"
                  className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={businessWebsite}
                  onChange={(e) => setBusinessWebsite(e.target.value)}
                  placeholder="https://yourbusiness.com (optional)"
                  className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Plan</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'basic' as const, label: 'Basic', price: '£15/mo' },
                    { value: 'standard' as const, label: 'Standard', price: '£35/mo' },
                    { value: 'premium' as const, label: 'Premium', price: '£75/mo' },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTier(t.value)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        tier === t.value
                          ? 'border-hertford-green bg-hertford-green/5'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <p className="font-semibold text-sm">{t.label}</p>
                      <p className="text-xs text-gray-500">{t.price}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mt-4">
                {errors.map((err, i) => <p key={i} className="text-xs text-red-700">• {err}</p>)}
              </div>
            )}

            <button
              onClick={() => { if (validateBusiness()) { setErrors([]); setStep('prize') } }}
              className="btn-primary w-full mt-6"
            >
              Next — Prize Offering
            </button>
          </div>
        )}

        {/* STEP 2: Prize Offering */}
        {step === 'prize' && (
          <div className="animate-fade-in">
            <button onClick={() => setStep('business')} className="text-sm text-gray-400 hover:text-hertford-green transition-colors mb-4 inline-flex items-center gap-1">
              ← Back
            </button>
            <h2 className="font-heading text-xl font-bold mb-1">Your Prize Offering</h2>
            <p className="text-gray-500 text-sm mb-6">
              All businesses must offer a weekly prize for quiz winners. This drives player engagement and gets your brand noticed!
            </p>

            {/* Prize explanation */}
            <div className="bg-gradient-to-r from-hertford-gold/10 to-amber-50 border border-hertford-gold/20 rounded-2xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <p className="font-semibold text-sm text-amber-800 mb-1">Why prizes?</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Prizes make the quiz exciting and keep players coming back weekly. 
                    Winners collect prizes from your business — bringing them through your door! 
                    Think of it as a customer acquisition cost that actually works.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prize Description * <span className="text-gray-400 font-normal">— What will the winner receive?</span>
                </label>
                <textarea
                  value={prizeDescription}
                  onChange={(e) => setPrizeDescription(e.target.value)}
                  placeholder="e.g. Free coffee & cake for 2, 20% off your next meal, Free haircut, £10 gift voucher..."
                  rows={3}
                  className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Approximate Value *</label>
                  <input
                    type="text"
                    value={prizeValue}
                    onChange={(e) => setPrizeValue(e.target.value)}
                    placeholder="e.g. £10, £15, £25"
                    className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>
                  <select
                    value={prizeFrequency}
                    onChange={(e) => setPrizeFrequency(e.target.value as 'weekly' | 'monthly')}
                    className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all bg-white"
                  >
                    <option value="weekly">Every week</option>
                    <option value="monthly">Once a month</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Prize examples */}
            <div className="mt-6 bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Popular prize ideas</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  '☕ Free coffee & cake',
                  '🍺 2-for-1 drinks',
                  '💇 Free haircut',
                  '🍕 Free pizza',
                  '🎫 £10 voucher',
                  '🛍️ 20% off shop',
                ].map((idea) => (
                  <p key={idea} className="text-xs text-gray-600">{idea}</p>
                ))}
              </div>
            </div>

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mt-4">
                {errors.map((err, i) => <p key={i} className="text-xs text-red-700">• {err}</p>)}
              </div>
            )}

            <button
              onClick={() => { if (validatePrize()) { setErrors([]); setStep('question') } }}
              className="btn-primary w-full mt-6"
            >
              Next — Your Quiz Question
            </button>
          </div>
        )}

        {/* STEP 3: Question */}
        {step === 'question' && (
          <div className="animate-fade-in">
            <button onClick={() => setStep('prize')} className="text-sm text-gray-400 hover:text-hertford-green transition-colors mb-4 inline-flex items-center gap-1">
              ← Back
            </button>
            <h2 className="font-heading text-xl font-bold mb-1">Your Quiz Question</h2>
            <p className="text-gray-500 text-sm mb-6">
              Create a fun question about your business that players will enjoy answering.
            </p>

            <div className="space-y-5">
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Answer Options * <span className="text-gray-400 font-normal">(click letter = correct answer)</span>
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
              </div>

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

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mt-4">
                {errors.map((err, i) => <p key={i} className="text-xs text-red-700">• {err}</p>)}
              </div>
            )}

            <button
              onClick={() => { if (validateQuestion()) { setErrors([]); setStep('verification') } }}
              className="btn-primary w-full mt-6"
            >
              Next — Verify Your Answer
            </button>
          </div>
        )}

        {/* STEP 4: Verification */}
        {step === 'verification' && (
          <div className="animate-fade-in">
            <button onClick={() => setStep('question')} className="text-sm text-gray-400 hover:text-hertford-green transition-colors mb-4 inline-flex items-center gap-1">
              ← Back
            </button>
            <h2 className="font-heading text-xl font-bold mb-1">Verify Your Answer</h2>
            <p className="text-gray-500 text-sm mb-6">
              All questions must be backed by accurate sources to maintain quiz quality.
            </p>

            {/* Question preview */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Your question</p>
              <p className="font-medium text-gray-900 mb-2">{question}</p>
              <p className="text-sm text-hertford-green font-medium">
                Correct answer: {options[correctAnswer]}
              </p>
            </div>

            {/* Verification type */}
            <div className="mb-6">
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
                    Link to an official website or document that confirms your answer.
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
                    No URL? Explain why your answer is accurate and we&apos;ll verify.
                  </p>
                </button>
              </div>
            </div>

            {/* Source verified fields */}
            {verificationType === 'source-verified' && (
              <div className="space-y-5 mb-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Source URL *</label>
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
                    {sourceUrlValid === true && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">✓</span>}
                    {sourceUrlValid === false && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">✗</span>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Describe the source *</label>
                  <input
                    type="text"
                    value={sourceDescription}
                    onChange={(e) => setSourceDescription(e.target.value)}
                    placeholder="e.g. Our official business website, about page"
                    className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Admin review fields */}
            {verificationType === 'needs-admin-review' && (
              <div className="space-y-5 mb-6 animate-fade-in">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <span className="text-amber-500">⚠️</span>
                    <p className="text-xs text-amber-700">
                      Without a verifiable source, your question needs manual admin review. 
                      Please explain why your answer is accurate.
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Justification *</label>
                  <textarea
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="e.g. I am the business owner and can confirm we were established in 1987. This is on our shopfront signage."
                    rows={4}
                    className="w-full px-5 py-3 border-2 border-gray-100 rounded-xl focus:border-hertford-green focus:outline-none focus:ring-4 focus:ring-hertford-green/10 transition-all resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Minimum 30 characters</p>
                </div>
              </div>
            )}

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                {errors.map((err, i) => <p key={i} className="text-xs text-red-700">• {err}</p>)}
              </div>
            )}

            <button onClick={handleSubmit} className="btn-primary w-full">
              Submit Everything
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              Your business, prize, and question will all be reviewed together.
            </p>
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <Link href="/advertise" className="text-gray-400 font-medium hover:text-hertford-green transition-colors text-sm">
          ← Back to Advertise
        </Link>
      </div>
    </div>
  )
}
