import { AlbumModel, AlbumDocument } from '../models/album';

export const findOneAlbumAndUpdate = (
  query: any,
  update: any,
  options?: any,
): Promise<Album> => AlbumModel.findOneAndUpdate(
  query,
  update,
  options,
) as unknown as Promise<Album>;

export type Album = AlbumDocument;