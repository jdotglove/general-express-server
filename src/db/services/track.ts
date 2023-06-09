import { TrackModel, TrackDocument } from '../models/track';

export const findOneTrack = (
  query: any,
  options?: any,
): Promise<Track> => TrackModel.findOne(
  query,
  options,
) as unknown as Promise<Track>;

export const findOneTrackAndUpdate = (
  query: any,
  update: any,
  options?: any,
): Promise<Track> => TrackModel.findOneAndUpdate(
  query,
  update,
  options,
) as unknown as Promise<Track>;

export const findTracks = (
  query: any,
  options?: any,
): Promise<Track[]> => TrackModel.find(
  query,
  options,
) as unknown as Promise<Track[]>;

export const updateOneTrack = (
  query: any,
  update: any,
  options?: any,
): Promise<any> => TrackModel.updateOne(
  query,
  update,
  options,
) as unknown as Promise<any>;

export type Track = TrackDocument;