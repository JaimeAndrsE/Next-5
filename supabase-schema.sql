-- Crear la tabla con el nombre 'images' que busca tu app
CREATE TABLE IF NOT EXISTS images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índice para búsqueda por título
CREATE INDEX IF NOT EXISTS idx_images_title ON images USING btree (title);

-- Políticas de seguridad (RLS) para 'images'
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Permitir todas las operaciones de forma pública
CREATE POLICY "Allow public select" ON images FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON images FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON images FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON images FOR DELETE USING (true);