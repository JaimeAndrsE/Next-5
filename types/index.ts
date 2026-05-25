export interface Image {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface CreateImagePayload {
  title: string;
  description: string;
  file: File;
}

export interface UpdateImagePayload {
  title: string;
  description: string;
  file?: File;
}
