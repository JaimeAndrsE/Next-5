import { put } from '@vercel/blob';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    let query = supabase.from('images').select('*').order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[GET /api/images] Supabase error:', error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[GET /api/images] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) || '';
    const file = formData.get('file') as File;

    console.log('[POST /api/images] Received:', { title, hasFile: !!file, fileSize: file?.size });

    if (!title || !file) {
      return NextResponse.json(
        { error: 'Título e imagen son obligatorios' },
        { status: 400 }
      );
    }

    // Validate file size (25MB limit for Vercel Blob)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'La imagen no debe exceder 25MB' },
        { status: 400 }
      );
    }

    console.log('[POST /api/images] Uploading to Vercel Blob...');
    const buffer = await file.arrayBuffer();
    const filename = `${Date.now()}-${file.name}`;

    let blobUrl: string;
    try {
      const blob = await put(filename, buffer, { access: 'public' });
      blobUrl = blob.url;
      console.log('[POST /api/images] Blob uploaded:', blobUrl);
    } catch (blobError) {
      console.error('[POST /api/images] Blob error:', blobError);
      return NextResponse.json(
        {
          error: `Upload error: ${
            blobError instanceof Error ? blobError.message : 'Unknown blob error'
          }`,
        },
        { status: 500 }
      );
    }

    console.log('[POST /api/images] Saving to Supabase...');
    const { data, error } = await supabase
      .from('images')
      .insert([
        {
          title,
          description,
          image_url: blobUrl,
        },
      ])
      .select();

    if (error) {
      console.error('[POST /api/images] Supabase insert error:', error);
      return NextResponse.json(
        {
          error: `Database error: ${error.message}`,
        },
        { status: 500 }
      );
    }

    console.log('[POST /api/images] Success:', data[0]?.id);
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('[POST /api/images] Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Server error: ${message}` },
      { status: 500 }
    );
  }
}
