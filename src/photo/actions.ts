'use server';

import { revalidatePath } from 'next/cache';
import {
  sqlDeletePhoto,
  sqlInsertPhotoIntoDb,
  sqlUpdatePhotoInDb,
} from '@/services/postgres';
import { convertFormDataToPhoto } from './form';
import { redirect } from 'next/navigation';
import {
  convertUploadToPhoto,
  deleteBlobPhoto,
} from '@/services/blob';
import { revalidatePhotosTag } from '@/cache';

export async function createPhotoAction(formData: FormData) {
  const photo = convertFormDataToPhoto(formData);

  const updatedUrl = await convertUploadToPhoto(
    photo.url,
    photo.id,
  );

  if (updatedUrl) { photo.url = updatedUrl; }
  await sqlInsertPhotoIntoDb(photo);

  revalidatePhotosTag(true);

  redirect('/admin/photos');
}

export async function updatePhotoAction(formData: FormData) {
  const photo = convertFormDataToPhoto(formData);

  await sqlUpdatePhotoInDb(photo);

  revalidatePhotosTag(true);

  redirect('/admin/photos');
}

export async function deletePhotoAction(formData: FormData) {
  await deleteBlobPhoto(formData.get('url') as string);
  await sqlDeletePhoto(formData.get('id') as string);

  revalidatePhotosTag(true);
};

export async function deleteBlobPhotoAction(formData: FormData) {
  await deleteBlobPhoto(formData.get('url') as string);

  revalidatePath('/admin/photos');
};
