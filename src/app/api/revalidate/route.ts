import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string
      slug?: { current?: string }
    }>(req, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new NextResponse('Bad Request', { status: 400 })
    }

    // Revalidate based on document type
    revalidateTag(body._type, 'max')

    // If it's a case study with a slug, also revalidate that specific slug
    if (body._type === 'caseStudy' && body.slug?.current) {
      revalidateTag(`caseStudy:${body.slug.current}`, 'max')
    }

    // If it's an insight with a slug, also revalidate that specific slug
    if (body._type === 'insight' && body.slug?.current) {
      revalidateTag(`insight:${body.slug.current}`, 'max')
    }

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body,
    })
  } catch (err: unknown) {
    console.error(err)
    return new NextResponse(err instanceof Error ? err.message : 'Error', { status: 500 })
  }
}
