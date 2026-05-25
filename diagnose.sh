#!/bin/bash

echo "🔍 Diagnosticando configuración..."
echo ""

# Check environment variables
echo "📋 Variables de entorno:"
if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
  echo "✅ NEXT_PUBLIC_SUPABASE_URL configurada"
else
  echo "❌ NEXT_PUBLIC_SUPABASE_URL NO configurada"
fi

if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
  echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configurada"
else
  echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY NO configurada"
fi

if grep -q "VERCEL_BLOB_TOKEN" .env.local; then
  echo "✅ VERCEL_BLOB_TOKEN configurada"
else
  echo "❌ VERCEL_BLOB_TOKEN NO configurada"
fi

echo ""
echo "🌐 Verificando conexión a Supabase..."
curl -s http://localhost:3000/api/health | jq '.' 2>/dev/null || echo "❌ No se pudo conectar al servidor. ¿Está corriendo npm run dev?"

echo ""
echo "💡 Próximos pasos:"
echo "1. Abre http://localhost:3000 en el navegador"
echo "2. Abre DevTools (F12)"
echo "3. Ve a la pestaña Console"
echo "4. Intenta crear una imagen"
echo "5. Copia el mensaje de error exacto"
