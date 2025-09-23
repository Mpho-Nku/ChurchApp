'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Verse = {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  language: string; // "sesotho" or "isizulu"
};

export default function BiblePage() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [language, setLanguage] = useState<'sesotho' | 'isizulu'>('sesotho');
  const [book, setBook] = useState('Genesis');
  const [chapter, setChapter] = useState(1);

  useEffect(() => {
    const fetchVerses = async () => {
      const { data, error } = await supabase
        .from('bible')
        .select('*')
        .eq('language', language)
        .eq('book', book)
        .eq('chapter', chapter)
        .order('verse', { ascending: true });

      if (!error && data) setVerses(data);
    };

    fetchVerses();
  }, [language, book, chapter]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">📖 Holy Bible</h1>

      {/* Language Selector */}
      <div className="flex gap-4">
        <button
          className={`btn ${language === 'sesotho' ? 'btn-primary' : ''}`}
          onClick={() => setLanguage('sesotho')}
        >
          Sesotho
        </button>
        <button
          className={`btn ${language === 'isizulu' ? 'btn-primary' : ''}`}
          onClick={() => setLanguage('isizulu')}
        >
          IsiZulu
        </button>
      </div>

      {/* Book + Chapter Selector */}
      <div className="flex gap-4">
        <select
          value={book}
          onChange={(e) => setBook(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="Genesis">Genesis</option>
          <option value="Exodus">Exodus</option>
          <option value="Psalms">Psalms</option>
          {/* Add more books */}
        </select>

        <input
          type="number"
          min={1}
          value={chapter}
          onChange={(e) => setChapter(Number(e.target.value))}
          className="w-20 border rounded px-2 py-1"
        />
      </div>

      {/* Render Verses */}
      <div className="space-y-3 bg-white shadow p-4 rounded">
        {verses.length > 0 ? (
          verses.map((v) => (
            <p key={v.id} className="text-gray-700">
              <span className="font-semibold">{v.verse}</span>. {v.text}
            </p>
          ))
        ) : (
          <p className="text-gray-400">No verses found for this selection.</p>
        )}
      </div>
    </div>
  );
}
