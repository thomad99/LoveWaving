import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { QRCodeComponent } from '@/components/admin/qr-code'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { ViewDocumentButton } from '@/components/admin/view-document-button'

export default async function EventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/api/auth/signin?callbackUrl=/admin')
  }

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      waiver: true,
      waiverSignatures: {
        select: {
          id: true,
          signedAt: true,
          signatureStyle: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { signedAt: 'desc' },
      },
    },
  })

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Event Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin">
              <Button>Back to Admin</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo.png" alt="LoveWaving Logo" width={48} height={48} className="object-contain" />
            <span className="text-2xl font-bold text-white">LoveWaving</span>
          </Link>
          <SignOutButton />
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin">
              <Button variant="outline">← Back</Button>
            </Link>
            <h1 className="text-4xl font-bold text-white">{event.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {event.isActive ? (
              <Badge>Active</Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
            <span className="text-gray-300">
              {format(new Date(event.startDate), 'PPP')}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                )}
                {event.location && (
                  <div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p className="text-gray-700">{event.location}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold mb-2">Dates</h3>
                  <p className="text-gray-700">
                    Start: {format(new Date(event.startDate), 'PPP')}
                  </p>
                  {event.endDate && (
                    <p className="text-gray-700">
                      End: {format(new Date(event.endDate), 'PPP')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {event.waiver && (
              <Card>
                <CardHeader>
                  <CardTitle>Waiver</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Title</h3>
                      <p className="text-gray-700">{event.waiver.title}</p>
                    </div>
                    {event.waiver.pdfUrl ? (
                      <div>
                        <h3 className="font-semibold mb-2">PDF Document</h3>
                        <div className="border rounded overflow-hidden">
                          <iframe
                            src={event.waiver.pdfUrl}
                            className="w-full h-[600px] border-0"
                            title="Waiver PDF"
                          />
                        </div>
                      </div>
                    ) : event.waiver.content ? (
                      <div>
                        <h3 className="font-semibold mb-2">Content</h3>
                        <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-sm">
                          {event.waiver.content}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {event.waiverSignatures.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Signatures</div>
                </div>
              </CardContent>
            </Card>

            <QRCodeComponent eventId={params.id} eventTitle={event.title} />

            <Link href={`/admin/events/${params.id}/edit`}>
              <Button className="w-full">Edit Event</Button>
            </Link>
          </div>
        </div>

        {event.waiverSignatures.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Signed Waivers</CardTitle>
              <CardDescription>
                View all completed waivers for this event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {event.waiverSignatures.map((signature) => (
                  <div
                    key={signature.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">
                        {signature.user.name || signature.user.email}
                      </div>
                      <div className="text-sm text-gray-600">
                        {format(new Date(signature.signedAt), 'PPP p')} •{' '}
                        {signature.signatureStyle}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>Completed</Badge>
                      <ViewDocumentButton signatureId={signature.id} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

