'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

type Library = { id:string; name:string; books: any[] };

export default function CurrentlyReadingPage(){
  const [lib,setLib] = useState<Library|null>(null);
  useEffect(()=>{
    (async ()=>{
      const res = await fetch('/api/libraries?name=Currently%20Reading', { cache:'no-store' });
      if (res.ok){
        const data = await res.json();
        setLib(data?.[0] || null);
      }
    })();
  },[]);
  if (!lib) return <div>Sign in to see your current reads.</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Currently Reading</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {lib.books.map(b=>(
          <Card key={b.id} className="p-4">
            <div className="font-medium">{b.title}</div>
            <div className="text-sm text-[var(--text-secondary)]">{b.authors}</div>
            <div className="text-xs mt-2">Progress: {b.currentPage}/{b.totalPages || '—'}</div>
          </Card>
        ))}
        {lib.books.length===0 && <p className="text-[var(--text-secondary)]">No books yet. Add from a book page.</p>}
      </div>
    </div>
  )
}
