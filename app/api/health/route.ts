import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const checks = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://') ? '✅' : '❌',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌',
      vercelBlob: process.env.VERCEL_BLOB_TOKEN ? '✅' : '❌',
    };

    // Try to fetch from images table
    let tableExists = false;
    let rlsConfigured = false;
    let errorMessage = '';

    try {
      const { error } = await supabase
        .from('images')
        .select('count')
        .limit(1);

      if (error) {
        errorMessage = error.message;
        if (error.message.includes('does not exist')) {
          errorMessage = '❌ Tabla "images" no existe. Ejecuta el SQL de setup en Supabase.';
        } else if (error.message.includes('permission')) {
          errorMessage = '❌ RLS policies no configuradas correctamente.';
          rlsConfigured = false;
        } else if (error.message.includes('JWT')) {
          errorMessage = '❌ Token de Supabase inválido.';
        }
      } else {
        tableExists = true;
        rlsConfigured = true;
      }
    } catch (e) {
      errorMessage = '❌ Error conectando a Supabase';
    }

    return NextResponse.json({
      status: tableExists ? 'ready' : 'incomplete',
      checks,
      database: {
        tableExists: tableExists ? '✅' : '❌',
        rlsConfigured: rlsConfigured ? '✅' : '❌',
        error: errorMessage,
      },
      message: tableExists
        ? 'Todo está configurado correctamente'
        : 'Por favor completa la configuración de Supabase',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
