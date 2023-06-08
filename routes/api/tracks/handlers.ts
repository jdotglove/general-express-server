import axios from '../../../plugins/axios';
import mongoose from '../../../plugins/mongoose';
import getOneTrack from '../../../plugins/graphql/query/getOneTrack';
import { parseUriForId } from '../../../utils/spotify';
import { findTracks, updateOneTrack, Track } from '../../../db/services/track';
import { graphQLRequest } from '../../../plugins/graphql';
import { translateGQLDocument } from '../../../utils/graphql';
import { redisClientDo } from '../../../plugins/redis';
//import updateOneTrack from '../../../plugins/graphql/mutation/updateOneTrack';

export const getTrackArtists = async (req: any, res: any) => {
  try { 
    const { data: { data }} = await graphQLRequest({
      query: getOneTrack,
      variables: {
        trackId: req.params.id,
      },
    });
    // let track = data.getOneTrack as Track;
    // console.log('Found Track: ', track);
    //   console.log('Track: ', track);
  } catch (error: any) {
    console.error('Error retrieving tracks: ', error.message);
    res.status(500).send(error.message).end();
  }

  res.status(200).send().end();
  return;
}

export const getTracksAudioFeatures  = async (req: any, res: any) => {
  try {
    console.log('Track Id Array: ', req.body.trackIdArray);
    const foundTracks = await findTracks({
      _id: {
        $in: req.body.trackIdArray,
      }
    });
    foundTracks.map(({ spotifyUri }) => parseUriForId(spotifyUri));
    // console.log('Data: ', data)
    const idString = (foundTracks.map(({ spotifyUri }) => parseUriForId(spotifyUri))).join(',')
    const { data: spotifyTracksAudioFeatures } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/audio-features?ids=${idString}`,
      headers: { Authorization: `Bearer ${req.body.spotifyToken}` },
    });
    spotifyTracksAudioFeatures.audio_features.forEach((trackFeatures: any) => {
      updateOneTrack({
        spotifyUri: trackFeatures.uri,
      }, {
        $set: {
          audioFeatures: {
            acousticness: trackFeatures.acousticness,
            analysisUrl: trackFeatures.analysis_url,
            danceability: trackFeatures.danceability,
            energy: trackFeatures.energy,
            instrumentalness: trackFeatures.instrumentalness,
            key: trackFeatures.key,
            liveness: trackFeatures.liveness,
            loudness: trackFeatures.loudness,
            mode: trackFeatures.mode,
            speechiness: trackFeatures.speechiness,
            spotifyUri: trackFeatures.uri,
            tempo: trackFeatures.tempo,
            timeSignature: trackFeatures.time_signature,
            valence: trackFeatures.valence,
          }
        }
      })
    })
    
    res.status(200).send(spotifyTracksAudioFeatures).end();
  } catch (error: any) {
    console.error('Error retrieving audio analsys for tracks: ', error.message);
    res.status(500).send(error.message).end();
  }
  return;
}