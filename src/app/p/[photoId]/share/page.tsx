import { getPhotoCached } from '@/photo/cache';
import PhotoShareModal from '@/photo/PhotoShareModal';
import { PATH_ROOT } from '@/site/paths';
import { redirect } from 'next/navigation';

export default async function Share({
  params,
}: {
  params: Promise<{ photoId: string }>
}) {
  const { photoId } = await params;

  const photo = await getPhotoCached(photoId);

  if (!photo) { return redirect(PATH_ROOT); }

  return <PhotoShareModal photo={photo} />;
}
