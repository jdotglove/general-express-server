import { findOneAlbumAndUpdate } from '../db/audionest/services/album';
import { findOneArtistAndUpdate } from '../db/audionest/services/artist';
import { findOnePlaylistAndUpdate } from '../db/audionest/services/playlist';
import { findOneTrackAndUpdate } from '../db/audionest/services/track';


export const formatSpotifyRecommendationRequest = (
  recommendationPayload: Record<string, string | number | Array<string>>
) => {
  const joinedQuery = Object.keys(recommendationPayload).reduce((acc: string, currKey: string) => {
    if (
      recommendationPayload[currKey] !== ''
    ) {
      return acc + `${currKey}=${JSON.stringify(recommendationPayload[currKey])}&`;
    }
    return acc
  }, '');
  
  return joinedQuery;
}

export const translateSpotifyUserObject = ({
  country,
  display_name: displayName,
  email,
  uri: spotifyUri,
}: {
  country: string,
  display_name: string,
  email: string,
  uri: string,
}) => ({
  country,
  displayName,
  email,
  spotifyUri,
  topArtists: [],
  topTracks: [],
});

export const translateSpotifyUserPlaylistObject = (playlistArray: Array<any>) => (
  playlistArray?.map(({
    country,
    name,
    owner,
    uri: spotifyUri,
  }) => ({
    country,
    name,
    owner,
    spotifyUri,
  })
));

export const translateSpotifyTrackObject = async ({
  album,
  artists,
  available_markets: availableMarkets,
  duration_ms: durationMs,
  explicit,
  name,
  popularity,
  track_number: trackNumber,
  type,
  uri: spotifyUri,
}: {
  album: any,
  artists: Array<any>,
  available_markets: Array<any>,
  duration_ms: number,
  explicit: boolean,
  name: string,
  popularity: number,
  track_number: number,
  type: string,
  uri: string,
}) => {
  const resolvedArtists = await resolveArtistsInDatabase(artists);
  return {
    album,
    artists: resolvedArtists,
    availableMarkets,
    durationMs,
    explicit,
    name,
    popularity,
    trackNumber,
    type,
    spotifyUri,
  }
};

export const resolveArtistsInDatabase = async (artists: Array<any>) => {
  const artistArray = await Promise.all(artists?.map(async (artist) => {
    const savedArtist = await findOneArtistAndUpdate({
      spotifyUri: artist.uri,
    }, {
      genres: artist.genres,
      name: artist.name,
      popularity: artist.popularity,
      spotifyUri: artist.uri,
    }, {
      returnNewDocument: true,
      upsert: true,
    });
    return savedArtist._id;
  }));
  return artistArray;
}

export const resolvePlaylistsInDatabase = async (playlists: Array<any>, ownerId: string) => {
  const playlistArray = await Promise.all(playlists?.map(async ({
    name,
    owner,
    tracks,
    uri: spotifyUri
  }) => {
    const savedPlaylist = await findOnePlaylistAndUpdate({
      spotifyUri: spotifyUri,
    }, {
      name,
      ownerId,
      ownerUri: owner.uri,
      tracks,
      spotifyUri,
    }, {
      returnNewDocument: true,
      upsert: true,
    });

    return savedPlaylist;
  }));
  return playlistArray;
}

export const resolveTracksInDatabase = async (tracks: Array<any>) => {
  const trackArray = await Promise.all(tracks?.map(async ({
    track
  }) => {
    const savedTrack = await findOneTrackAndUpdate({
      spotifyUri: track.uri,
    }, {
      availableMarkets: track.available_markets,
      durationMs: track.duration_ms,
      explicit: track.explicit,
      name: track.name,
      popularity: track.popularity,
      spotifyUri: track.uri,
      trackNumber: track.track_number,
    }, {
      returnNewDocument: true,
      upsert: true,
    });
    if (savedTrack) {
      return savedTrack;
    }
  }));

  return trackArray;
}