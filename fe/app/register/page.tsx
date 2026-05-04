import RegisterForm from '@/components/auth/register-form'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account — SNK Shop',
  description: 'Create a new SNK Shop account',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight">SNK Shop</Link>
          <p className="text-sm text-gray-500 mt-1">Create your account</p>
        </div>

        <RegisterForm redirectTo="/" />

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
