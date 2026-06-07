'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What is Do You Know Hertford?',
    answer: 'Do You Know Hertford? is a free online quiz platform testing your knowledge of Hertford, Hertfordshire, England. It covers history, landmarks, geography, culture, food & drink, events, and famous people connected to the town. Play as many times as you like and compete on the leaderboard!'
  },
  {
    question: 'How are the questions created?',
    answer: 'All questions are researched and written using verified, official sources. We use information from government websites, Historic England, Wikipedia, local council records, and other reputable sources. Every question includes a source reference so you can check the answer yourself.'
  },
  {
    question: 'How are answers verified?',
    answer: 'Every question must have a valid, verifiable source before it goes live. We only use official websites, government records, Wikipedia, and recognised institutions as sources. Each question links directly to its source so you can verify the answer independently.'
  },
  {
    question: 'Who is behind this site?',
    answer: 'Do You Know Hertford? was created by a Hertford local who is passionate about the town and its history. The goal is to celebrate Hertford, educate residents and visitors, and create a fun community around local knowledge.'
  },
  {
    question: 'Is it free to play?',
    answer: 'Yes! The quiz is completely free to play. You just need to create an account with a username, email, and password. There are no hidden charges, subscriptions, or in-app purchases.'
  },
  {
    question: 'What if I disagree with a question or answer?',
    answer: 'We take accuracy very seriously. If you believe a question or answer is incorrect, please contact us with the specific question and your evidence. We will review it and update or remove the question if needed. Every answer should be backed by a verifiable source — if it isn\'t, it shouldn\'t be in the quiz.'
  },
  {
    question: 'How do I report an incorrect question?',
    answer: 'Send us an email at doyouknowhertford@gmail.com with the question you believe is incorrect, what you think the correct answer is, and ideally a source to back it up. We aim to review all reports within 48 hours.'
  },
  {
    question: 'How does the leaderboard work?',
    answer: 'The leaderboard shows cumulative scores — every correct answer adds to your total. The more quizzes you play, the higher your score. You can filter the leaderboard by Today, This Week, This Month, or All Time to see different rankings.'
  },
  {
    question: 'Will I see the same question twice?',
    answer: 'No. Once you answer a question, you will never see it again. When you have answered all available questions, the quiz will let you know that new questions will be released soon.'
  },
  {
    question: 'How often are new questions added?',
    answer: 'We regularly add new questions to keep the quiz fresh. When new questions are available, they will automatically appear in your next quiz session.'
  },
  {
    question: 'Can I see which questions I got wrong?',
    answer: 'Yes! After completing each quiz, you\'ll see a full breakdown of your answers with the correct answers and sources. You can also visit the "My History" page at any time to see every question you\'ve ever answered, filter by correct/incorrect, and see your accuracy by category and difficulty.'
  },
  {
    question: 'What data do you collect about me?',
    answer: 'We collect your username (shown publicly on the leaderboard), your email (kept private, used only for login and password reset), and your quiz answers/scores. We do not collect your real name, location, or any tracking data. See our full Privacy Policy for details.'
  },
  {
    question: 'Can I delete my account?',
    answer: 'Yes. You can permanently delete your account and all associated data at any time from the "Delete Account" page in the footer. This removes everything — your profile, scores, answer history, and login credentials. No record of your account will remain.'
  },
  {
    question: 'Is my real name shown on the leaderboard?',
    answer: 'No. Only your chosen username is displayed on the leaderboard. Your email address is never shown publicly anywhere on the site.'
  },
  {
    question: 'How many questions are in each quiz?',
    answer: 'Each quiz session gives you 10 random questions. The total question bank is much larger and growing regularly. You can play multiple sessions to answer more questions and increase your leaderboard score.'
  },
  {
    question: 'How long do I have to answer each question?',
    answer: 'You have 20 seconds per question. If time runs out, it counts as incorrect and you move to the next question.'
  },
  {
    question: 'Can I play on my phone?',
    answer: 'Yes! The site is fully responsive and works on mobile phones, tablets, and desktop computers. Your progress syncs across all devices since it\'s linked to your account.'
  },
  {
    question: 'I forgot my password. How do I reset it?',
    answer: 'On the sign-in page, click "Forgot your password?" and enter your email. We\'ll send you a link to reset your password. Check your spam folder if you don\'t see it within a few minutes.'
  },
  {
    question: 'Can I suggest a question for the quiz?',
    answer: 'We welcome suggestions! Email us at doyouknowhertford@gmail.com with your question, four possible answers (marking the correct one), and a source that verifies the answer. If it meets our quality standards, we\'ll add it to the quiz.'
  },
  {
    question: 'Why only Hertford?',
    answer: 'We started with Hertford because we love this town and its rich history. The concept may expand to other towns and cities in the future — watch this space!'
  },
  {
    question: 'I found a bug or technical issue. How do I report it?',
    answer: 'Please email doyouknowhertford@gmail.com with a description of what went wrong, what device/browser you were using, and a screenshot if possible. We\'ll look into it as soon as we can.'
  },
  {
    question: 'Is the quiz suitable for children?',
    answer: 'The quiz content is family-friendly and suitable for anyone interested in Hertford. However, account creation requires an email address, and we ask that children under 13 do not create accounts without parental consent.'
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pt-28">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm font-semibold text-hertford-green uppercase tracking-wider mb-3">Help</p>
        <h1 className="font-heading text-4xl font-bold tracking-tight mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500">
          Everything you need to know about Do You Know Hertford?
        </p>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900 text-sm sm:text-base">{faq.question}</span>
              <span className={`text-gray-400 text-xl flex-shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5 animate-fade-in">
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-12 bg-gray-50 rounded-2xl p-8 text-center">
        <h3 className="font-bold text-gray-900 mb-2">Still have a question?</h3>
        <p className="text-gray-500 text-sm mb-4">
          Can&apos;t find what you&apos;re looking for? Get in touch and we&apos;ll help.
        </p>
        <a
          href="mailto:doyouknowhertford@gmail.com"
          className="btn-primary inline-block"
        >
          Email Us
        </a>
      </div>

      <div className="text-center mt-8">
        <Link href="/" className="text-gray-400 hover:text-hertford-green transition-colors text-sm">← Back to Home</Link>
      </div>
    </div>
  )
}
