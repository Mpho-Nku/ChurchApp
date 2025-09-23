'use client';

import { useState } from 'react';

const hymnsData = {
  sesotho: [
    { number: 1, title: "Ho Morena ke tla bina", lyrics: "Ho Morena ke tla bina..." },
    { number: 2, title: "Jesu ke mofolisi", lyrics: "Jesu ke mofolisi..." },
    // 👉 add more from Difela Tsa Sione
  ],
  zulu: [
    { number: 1, title: "Nkosi sikelel’ iAfrika", lyrics: "Nkosi sikelel’ iAfrika..." },
    { number: 2, title: "Nkulunkulu unguMhlobo wami", lyrics: "Nkulunkulu unguMhlobo wami..." },
    // 👉 add more from Amagama Okuhlabelela
  ],
  xhosa: [
    { number: 1, title: "Lizalis’ idinga lakho", lyrics: "Lizalis’ idinga lakho..." },
    { number: 2, title: "Bawo Wethu oseZulwini", lyrics: "Bawo Wethu oseZulwini..." },
    // 👉 add more from AmaQhulo
  ],
};

export default function HymnsPage() {
  const [activeTab, setActiveTab] = useState<'sesotho' | 'zulu' | 'xhosa'>('sesotho');
  const [search, setSearch] = useState('');

  const hymns = hymnsData[activeTab].filter(
    (hymn) =>
      hymn.title.toLowerCase().includes(search.toLowerCase()) ||
      hymn.number.toString().includes(search)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">🎶 Hymns</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('sesotho')}
          className={`pb-2 ${activeTab === 'sesotho' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
        >
          Sesotho
        </button>
        <button
          onClick={() => setActiveTab('zulu')}
          className={`pb-2 ${activeTab === 'zulu' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
        >
          isiZulu
        </button>
        <button
          onClick={() => setActiveTab('xhosa')}
          className={`pb-2 ${activeTab === 'xhosa' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
        >
          isiXhosa
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search hymn by title or number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded p-2"
      />

      {/* Hymns List */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {hymns.length > 0 ? (
          hymns.map((hymn) => (
            <div key={hymn.number} className="p-4 border rounded-lg bg-white shadow-sm">
              <h2 className="font-semibold text-lg text-blue-800">
                {hymn.number}. {hymn.title}
              </h2>
              <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{hymn.lyrics}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No hymns found.</p>
        )}
      </div>
    </div>
  );
}
