import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isConfigured, USE_MOCK } from './firebase';
import imageCompression from 'browser-image-compression';

export type ImageFieldName = 'thumbnail' | 'hero' | 'gallery' | 'process';

const compressionOptions: Record<ImageFieldName, { maxSizeMB: number; maxWidthOrHeight: number }> = {
  thumbnail: { maxSizeMB: 0.8, maxWidthOrHeight: 800 },
  hero: { maxSizeMB: 2, maxWidthOrHeight: 1920 },
  gallery: { maxSizeMB: 1, maxWidthOrHeight: 1200 },
  process: { maxSizeMB: 1, maxWidthOrHeight: 1200 },
};

export async function uploadImage(
  artistId: string,
  fieldName: ImageFieldName,
  file: File
): Promise<string> {
  const options = compressionOptions[fieldName];
  const compressed = await imageCompression(file, options);

  if (USE_MOCK || !isConfigured || !storage) {
    // Demo: return object URL
    return URL.createObjectURL(compressed);
  }

  const timestamp = Date.now();
  const path = `artists/${artistId}/${fieldName}/${timestamp}_${file.name}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, compressed);
  return getDownloadURL(storageRef);
}
