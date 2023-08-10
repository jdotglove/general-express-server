import axios from '../../../plugins/axios';
import mongoose from '../../../plugins/mongoose';
import getOneTrack from '../../../plugins/graphql/query/getOneTrack';
import { parseUriForId } from '../../../utils/spotify';
import { findTracks, findOneTrackAndUpdate, findOneTrack, Track, updateOneTrack } from '../../../db/services/track';
import { graphQLRequest } from '../../../plugins/graphql';

export const getTrack = async (req: any, res: any) => {
  try {
    const { data: spotifyGetTrack } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/tracks/${req.params.id}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(200).send(spotifyGetTrack).end();
  } catch (error: any) {
    console.error('Error retrieving track: ', error.message);
    res.status(500).send(error.message).end();
  }
  return;
}

const batchIds = (idArray: Array<string>) => {
  let startIdx = 0;
  const batchLimit = 50;
  const batchedIdArray = [];
  while (startIdx <= idArray.length) {
    batchedIdArray.push(idArray.slice(startIdx, startIdx + batchLimit));
    startIdx += batchLimit;
  }
  return batchedIdArray;
}

export const getSelectedTracks = async (req: any, res: any) => {
  try {
    const idBatches = batchIds(req.query.ids)
    let tracksArray: Array<string | Array<string>> = []
    await Promise.all(idBatches.map(async (batchOfIds) => {
      const { data: spotifyGetTracks } = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/tracks?ids=${batchOfIds}`,
        headers: { Authorization: `Bearer ${req.query.token}` },
      });
      tracksArray.push(spotifyGetTracks.tracks);
    }))
    
    res.status(200).send(tracksArray.flat()).end();
  } catch (error: any) {
    console.error('Error getting selected track: ', error.message);
    res.status(500).send(error.message).end();
  }
  return;
}

export const getTrackArtists = async (req: any, res: any) => {
  try {
    let track;
    if (process.env.NODE_ENV === 'development') {
      const { data: { data } } = await graphQLRequest({
        query: getOneTrack,
        variables: {
          trackId: req.params.id,
        },
      });
      track = data.getOneTrack as Track;
    } else {
      track = await findOneTrack({ _id: new mongoose.Types.ObjectId(req.params.id) });
    }
    
  } catch (error: any) {
    console.error('Error retrieving tracks: ', error.message);
    res.status(500).send(error.message).end();
  }

  res.status(200).send().end();
  return;
}

export const getTrackAudioFeatures = async (req: any, res: any) => {
  try {
    const { data: spotifyTracksAudioFeatures } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/audio-features/${req.params.id}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(200).send(spotifyTracksAudioFeatures).end();
  } catch (error: any) {
    console.error('Error retrieving audio features for track: ', error.message);
    res.status(500).send(error.message).end();
  }
  return;
}

export const searchForTrack = async (req: any, res: any) => {
  try {
    const { data: spotifyTrackSearch } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/search?q=${encodeURI(req.body.query)}&type=${req.body.type}&limit=3`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const possibleTracks = spotifyTrackSearch.tracks.items;
    if (!possibleTracks) {
      res.status(404).send('No tracks found with this search query').end();
    } else {
      res.status(200).send(possibleTracks).end();
    }
  } catch (error: any) {
    console.error('Error searching for track', error.message);
    res.status(500).send(error.message).end();
  }
  return;
}