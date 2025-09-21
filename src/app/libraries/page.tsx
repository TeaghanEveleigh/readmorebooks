'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Library = { id: string; name: string; books: any[] };

export default function LibrariesPage() {
  const [libs,setLibs] = useState<Library[]>([]);
  const [name,setName] = useState('');

  const fetchLibs = async () => {
    const res = await fetch('/api/libraries', { cache: 'no-store' });
    if (res.ok) setLibs(await res.json());
  };
  useEffect(()=>{ fetchLibs(); },[]);

  const create = async () => {
    if (!name.trim()) return;
    const res = await fetch('/api/libraries', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name })});
    if (res.ok) { setName(''); await fetchLibs(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="block text-sm mb-1">New library name</label>
          <input className="w-full rounded-md border px-3 py-2 bg-[var(--bg-secondary)]" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g., Sci-Fi 2025"/>
        </div>
        <Button onClick={create}>Create</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {libs.map(lib => (
          <Card key={lib.id} className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{lib.name}</h3>
              <span className="text-xs text-[var(--text-secondary)]">{lib.books.length} books</span>
            </div>
            <Link href={`/libraries/${lib.id}`} className="text-sm underline mt-2 inline-block">Open</Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
