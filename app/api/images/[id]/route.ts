import { put } from '@vercel/blob';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File | null;

    console.log('[PATCH /api/images/:id] Updating:', { id, title });

    let image_url: string | undefined;

    if (file) {
      console.log('[PATCH /api/images/:id] Uploading new image...');
      const buffer = await file.arrayBuffer();
      const filename = `${Date.now()}-${file.name}`;
      const blob = await put(filename, buffer, { access: 'public' });
      image_url = blob.url;
    }

    const updateData: any = {
      title,
      description,
    };
    if (image_url) updateData.image_url = image_url;

    console.log('[PATCH /api/images/:id] Updating Supabase...');
    const { data, error } = await supabase
      .from('images')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('[PATCH /api/images/:id] Supabase error:', error);
      return NextResponse.json(
        { error: `Update failed: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('[PATCH /api/images/:id] Success');
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('[PATCH /api/images/:id] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Update error: ${message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log('[DELETE /api/images/:id] Deleting:', id);

    const { error: deleteError } = await supabase
      .from('images')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('[DELETE /api/images/:id] Supabase error:', deleteError);
      return NextResponse.json(
        { error: `Delete failed: ${deleteError.message}` },
        { status: 500 }
      );
    }

    console.log('[DELETE /api/images/:id] Success');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/images/:id] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Delete error: ${message}` },
      { status: 500 }
    );
  }
}
