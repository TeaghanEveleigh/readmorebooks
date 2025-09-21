'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function SignInPage() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', { redirect: false, email, password });
    if (res?.error) { setError('Invalid email or password'); return; }
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto pt-10">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
      <p className="mt-4 text-sm">No account? <Link href="/auth/signup" className="underline">Create one</Link></p>
    </div>
  );
}
