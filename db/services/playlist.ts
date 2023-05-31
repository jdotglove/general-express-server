import { PlaylistModel, PlaylistDocument } from '../models/playlist';

export const findOnePlaylist = (
  query: any,
  options?: any,
): Promise<Playlist> => PlaylistModel.findOneAndUpdate(
  query,
  options,
) as unknown as Promise<Playlist>;

export const findOnePlaylistAndUpdate = (
  query: any,
  update: any,
  options?: any,
): Promise<Playlist> => PlaylistModel.findOneAndUpdate(
  query,
  update,
  options,
) as unknown as Promise<Playlist>;

export const updateManyPlaylists = (
  query: any,
  update: any,
  options?: any,
) => PlaylistModel.updateMany(
  query,
  update,
  options,
);

export const updateOnePlaylist = (
  query: any,
  update: any,
  options?: any,
) => PlaylistModel.updateOne(
  query,
  update,
  options,
);

export type Playlist = PlaylistDocument;