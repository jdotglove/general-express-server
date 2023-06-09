import { ArtistModel, ArtistDocument } from '../models/artist';

export const findOneArtist = (
  query: any,
  options?: any,
): Promise<Artist> => ArtistModel.findOneAndUpdate(
  query,
  options,
) as unknown as Promise<Artist>;

export const findOneArtistAndUpdate = (
  query: any,
  update: any,
  options?: any,
): Promise<Artist> => ArtistModel.findOneAndUpdate(
  query,
  update,
  options,
) as unknown as Promise<Artist>;

export type Artist = ArtistDocument;