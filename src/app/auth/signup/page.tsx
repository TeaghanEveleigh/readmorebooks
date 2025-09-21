'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function SignUpPage() {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) { 
      const data = await res.json().catch(()=>({error:'Error'}));
      setError(data.error || 'Failed to register'); 
      return; 
    }
    router.push('/auth/signin');
  };

  return (
    <div className="max-w-md mx-auto pt-10">
      <h1 className="text-2xl font-semibold mb-6">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
        <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">Sign up</Button>
      </form>
      <p className="mt-4 text-sm">Already have an account? <Link href="/auth/signin" className="underline">Sign in</Link></p>
    </div>
  );
}
