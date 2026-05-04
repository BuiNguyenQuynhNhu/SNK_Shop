'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, RegisterDto, saveToken } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface RegisterFormProps {
  redirectTo?: string
}

export default function RegisterForm({ redirectTo = '/' }: RegisterFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<RegisterDto>({ email: '', password: '', name: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { access_token } = await api.auth.register(form)
      saveToken(access_token)
      router.push(redirectTo)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <h2 className="text-xl font-semibold">Create Account</h2>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="reg-name" className="text-sm font-medium text-gray-700">
          Full Name
        </label>
        <Input
          id="reg-name"
          type="text"
          name="name"
          placeholder="Nguyễn Văn A"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="reg-email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="reg-email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="reg-password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <Input
          id="reg-password"
          type="password"
          name="password"
          placeholder="Min 6 characters"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating account…' : 'Create Account'}
      </Button>
    </form>
  )
}
