'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

type Book = { id: string; title: string; authors?: string; thumbnail?: string; totalPages?: number; currentPage: number; };
type Library = { id: string; name: string; books: Book[] };

export default function LibraryDetail() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const [lib,setLib] = useState<Library|null>(null);

  const fetchLib = async () => {
    const res = await fetch('/api/libraries?name=' + '');
    // fallback: fetch all and find matching id
    if (res.ok) {
      const list:Library[] = await res.json();
      const found = list.find(l => l.id === id) || null;
      setLib(found);
    }
  };
  useEffect(()=>{ if(id) fetchLib(); },[id]);

  const updateProgress = async (bookId:string, currentPage:number) => {
    await fetch(`/api/libraries/${lib?.id}/books`, {
      method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ bookId, currentPage })
    });
    await fetchLib();
  };

  if (!lib) return <div>Loading…</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{lib.name}</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {lib.books.map(b => (
          <Card key={b.id} className="p-4">
            <div className="flex gap-4">
              {b.thumbnail && (
                <img src={b.thumbnail} alt="" width={80} height={120} className="rounded-md object-cover" />
              )}
              <div className="flex-1">
                <h3 className="font-medium">{b.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{b.authors}</p>
                <div className="mt-2">
                  <label className="text-xs">Progress</label>
                  <input type="range" min={0} max={b.totalPages || 100} value={b.currentPage} onChange={e=>updateProgress(b.id, parseInt(e.target.value))} className="w-full"/>
                  <div className="text-xs mt-1">{b.currentPage}/{b.totalPages || '—'} pages</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
