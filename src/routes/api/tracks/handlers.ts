import axios from '../../../plugins/axios';
import mongoose from '../../../plugins/mongoose';
import getOneTrack from '../../../plugins/graphql/query/getOneTrack';
import { parseUriForId } from '../../../utils/spotify';
import { findTracks, findOneTrackAndUpdate, findOneTrack, Track, updateOneTrack } from '../../../db/services/track';
import { graphQLRequest } from '../../../plugins/graphql';
import { translateGQLDocument } from '../../../utils/graphql';
import { redisClientDo } from '../../../plugins/redis';
//import updateOneTrack from '../../../plugins/graphql/mutation/updateOneTrack';

export const getTrack = async (req: any, res: any) => {
  try {
    // TODO: Come back to graphql request
    // const { data: { data } } = await graphQLRequest({
    //   query: getOneTrack,
    //   variables: {
    //     trackId: req.params.id,
    //   },
    // });
    // const track = data?.getOneTrack as Track;
    const track = await findOneTrack({ _id: new mongoose.Types.ObjectId(req.params.id)})
    res.status(200).send(track).end();
  } catch(error: any) {
    console.error('Error retrieving track: ', error.message);
    res.status(500).send(error.message).end();
  }
  return;
}

export const getSelectedTracks = async (req: any, res: any) => {
  try {
    const foundTracks = await findTracks({
      _id: {
        $in: req.query.ids.split(','),
      }
    });

    const idString = (foundTracks.map(({ spotifyUri }) => parseUriForId(spotifyUri))).join(',')
    const { data: spotifyTracksAudioFeatures } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/audio-features?ids=${idString}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const updatedIdsArray = await Promise.all(spotifyTracksAudioFeatures.audio_features.map(async (trackFeatures: any) => {
      const updatedTrack = await findOneTrackAndUpdate({
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
          },
        },
      }, {
        returnNewDocument: true,
      });

      return updatedTrack._id;
    }));

    res.status(200).send(updatedIdsArray).end();
  } catch (error: any) {
    console.error('Error getting selected track: ', error.message);
    res.status(500).send(error.message).end();
  }
  return;
}

  export const getTrackArtists = async (req: any, res: any) => {
    try {
      // const { data: { data } } = await graphQLRequest({
      //   query: getOneTrack,
      //   variables: {
      //     trackId: req.params.id,
      //   },
      // });
      const track = await findOneTrack({ _id: new mongoose.Types.ObjectId(req.params.id)})
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

  export const getTrackAudioFeatures = async (req: any, res: any) => {
    try {
      // const { data: { data } } = await graphQLRequest({
      //   query: getOneTrack,
      //   variables: {
      //     trackId: req.params.id,
      //   },
      // });
      // let track = data?.getOneTrack as Track;
      const track = await findOneTrack({ _id: new mongoose.Types.ObjectId(req.params.id)})
      const idString = parseUriForId(track.spotifyUri)
      const { data: spotifyTracksAudioFeatures } = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/audio-features?ids=${idString}`,
        headers: { Authorization: `Bearer ${req.query.token}` },
      });
      const spotifyTrackAudioFeatures = spotifyTracksAudioFeatures.audio_features[0];
      const trackFeatures = {
        acousticness: spotifyTrackAudioFeatures.acousticness,
        analysisUrl: spotifyTrackAudioFeatures.analysis_url,
        danceability: spotifyTrackAudioFeatures.danceability,
        energy: spotifyTrackAudioFeatures.energy,
        instrumentalness: spotifyTrackAudioFeatures.instrumentalness,
        key: spotifyTrackAudioFeatures.key,
        liveness: spotifyTrackAudioFeatures.liveness,
        loudness: spotifyTrackAudioFeatures.loudness,
        mode: spotifyTrackAudioFeatures.mode,
        speechiness: spotifyTrackAudioFeatures.speechiness,
        spotifyUri: spotifyTrackAudioFeatures.uri,
        tempo: spotifyTrackAudioFeatures.tempo,
        timeSignature: spotifyTrackAudioFeatures.time_signature,
        valence: spotifyTrackAudioFeatures.valence,
      };
      updateOneTrack({
        spotifyUri: trackFeatures.spotifyUri,
      }, {
        $set: {
          audioFeatures: trackFeatures,
        },
      });

      res.status(200).send(trackFeatures).end();
    } catch (error: any) {
      console.error('Error retrieving audio features for track: ', error.message);
      res.status(500).send(error.message).end();
    }
    return;
  }