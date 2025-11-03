'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignatureCanvas } from '@/components/signature/signature-canvas'
import { SignatureStyleSelector } from '@/components/signature/signature-style-selector'
import { SignOutButton } from '@/components/auth/sign-out-button'

const SIGNATURE_STYLES = [
  { id: 'cursive', name: 'Cursive', preview: 'Signature' },
  { id: 'formal', name: 'Formal', preview: 'SIGNATURE' },
  { id: 'initial', name: 'Initials', preview: 'SR' },
  { id: 'stamp', name: 'Stamp', preview: '●' },
  { id: 'mark', name: 'Mark', preview: '×' },
]

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    clubName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [signatureData, setSignatureData] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('cursive')
  const [hasSavedSignature, setHasSavedSignature] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/api/auth/signin?callbackUrl=/profile')
      return
    }
    
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setProfileData({
        name: data.name || '',
        email: data.email || '',
        clubName: data.clubName || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      if (data.signature) {
        setSignatureData(data.signature.signatureData)
        setSelectedStyle('custom')
        setHasSavedSignature(true)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          clubName: profileData.clubName,
          currentPassword: profileData.currentPassword || undefined,
          newPassword: profileData.newPassword || undefined,
          confirmPassword: profileData.confirmPassword || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setSuccess('Profile updated successfully!')
      setProfileData({
        ...profileData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSignature = async () => {
    if (!signatureData) {
      setError('Please provide a signature')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setSuccess('Signature saved successfully!')
      setHasSavedSignature(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save signature')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={session?.user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="flex items-center gap-3">
            <Image src="/logo.png" alt="LoveWaving Logo" width={48} height={48} className="object-contain" />
            <span className="text-2xl font-bold text-white">LoveWaving</span>
          </Link>
          <SignOutButton />
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href={session?.user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
            <Button variant="outline" className="mb-4">← Back</Button>
          </Link>
          <h1 className="text-4xl font-bold text-white">My Profile</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 text-sm text-green-600 bg-green-50 rounded-md border border-green-200">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clubName">Club Name</Label>
                  <Input
                    id="clubName"
                    type="text"
                    value={profileData.clubName}
                    onChange={(e) =>
                      setProfileData({ ...profileData, clubName: e.target.value })
                    }
                  />
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-semibold">Change Password</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) =>
                        setProfileData({ ...profileData, currentPassword: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) =>
                        setProfileData({ ...profileData, newPassword: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) =>
                        setProfileData({ ...profileData, confirmPassword: e.target.value })
                      }
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Signature */}
          <Card>
            <CardHeader>
              <CardTitle>Your Signature</CardTitle>
              <CardDescription>
                {hasSavedSignature 
                  ? 'Update or view your saved signature'
                  : 'Save your signature for future use'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {hasSavedSignature && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">
                    ✓ You have a saved signature. It will be pre-filled when you sign waivers.
                  </p>
                </div>
              )}

              <SignatureStyleSelector
                styles={SIGNATURE_STYLES}
                selectedStyle={selectedStyle}
                onSelect={(style) => {
                  setSelectedStyle(style)
                  setSignatureData('')
                }}
              />

              <SignatureCanvas
                selectedStyle={selectedStyle}
                signatureData={signatureData}
                onSignatureChange={setSignatureData}
              />

              <Button
                onClick={handleSaveSignature}
                disabled={!signatureData || saving}
                className="w-full"
              >
                {saving ? 'Saving...' : 'Save Signature'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

