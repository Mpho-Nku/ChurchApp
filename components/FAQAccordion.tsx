'use client';
import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    question: 'What is this app about?',
    answer:
      'This is a platform to discover churches, events, and hymns in Sesotho, isiZulu, and isiXhosa. You can save events, read the Bible, and connect with your church community.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'The app is free to use. Some advanced features may require donations or premium access in the future.',
  },
  {
    question: 'Can I save events?',
    answer:
      'Yes, you can click on “Save Event” to keep track of upcoming events in your dashboard.',
  },
  {
    question: 'Is it available in multiple languages?',
    answer:
      'Yes, the Bible and hymns are available in Sesotho, isiZulu, and isiXhosa.',
  },
  {
    question: 'How do I contact support?',
    answer:
      'You can email us at support@stjohnapp.com or use the Contact Us form inside the app.',
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-blue-900 mb-8">❓ Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium text-blue-900 hover:bg-gray-50 transition"
            >
              {faq.question}
              {openIndex === i ? (
                <XMarkIcon className="h-6 w-6 text-blue-600" />
              ) : (
                <PlusIcon className="h-6 w-6 text-blue-600" />
              )}
            </button>
            {openIndex === i && (
              <div className="px-6 pb-4 text-gray-700 bg-gray-50">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
