import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadWaiverPDF } from '@/lib/s3'
import { parsePDFForm } from '@/lib/pdf-parser'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await req.formData()

    const eventData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate: new Date(formData.get('startDate') as string),
      endDate: formData.get('endDate')
        ? new Date(formData.get('endDate') as string)
        : null,
      location: formData.get('location') as string,
      createdBy: session.user.id,
    }

    // Create event
    const event = await prisma.event.create({
      data: eventData,
    })

    // Handle waiver
    const waiverTitle = formData.get('waiverTitle') as string
    const waiverContent = formData.get('waiverContent') as string
    const waiverFile = formData.get('waiverFile') as File | null

    if (waiverTitle) {
      let pdfUrl = null
      let formFields: any = undefined

      // Handle file upload to S3 if provided
      if (waiverFile) {
        const buffer = Buffer.from(await waiverFile.arrayBuffer())
        const fileName = `waivers/${event.id}/${waiverFile.name}`
        pdfUrl = await uploadWaiverPDF(buffer, fileName)
        
        // Parse PDF for form fields
        try {
          const fields = await parsePDFForm(buffer)
          if (fields && fields.length > 0) {
            formFields = fields
          }
        } catch (parseError) {
          console.error('Error parsing PDF form fields:', parseError)
          // Continue without form fields if parsing fails
        }
      }

      await prisma.waiver.create({
        data: {
          eventId: event.id,
          title: waiverTitle,
          content: waiverContent || '',
          pdfUrl,
          formFields,
        },
      })
    }

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

