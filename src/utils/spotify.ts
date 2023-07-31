import { findOneAlbumAndUpdate } from '../db/services/album';
import { findOneArtistAndUpdate } from '../db/services/artist';
import { findOnePlaylistAndUpdate } from '../db/services/playlist';
import { findOneTrackAndUpdate } from '../db/services/track';


export const parseUriForId = (spotifyUri: string) => spotifyUri.split(':')[2];

export const formatSpotifyRecommendationRequest = (
  recommendationPayload: Record<string, string | number | Array<string>>
) => {
  // const isSeedField = (field: string ) => {
  //   if (
  //     field === 'seed_artists'
  //     || field === 'seed_genres'
  //     || field === 'seed_tracks'
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }
  const joinedQuery = Object.keys(recommendationPayload).reduce((acc: string, currKey: string) => {
    if (
      recommendationPayload[currKey] !== ''
    ) {
      return acc + `${currKey}=${JSON.stringify(recommendationPayload[currKey])}&`;
    }
    return acc
  }, '');
  // console.log(joinedQuery);
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
  const artistArray = await Promise.all(artists?.map(async ({
    genres,
    name,
    popularity,
    uri: spotifyUri
  }) => {
    const savedArtist = await findOneArtistAndUpdate({
      spotifyUri: spotifyUri,
    }, {
      genres,
      name,
      popularity,
      spotifyUri,
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
    // const savedAlbum = await findOneAlbumAndUpdate({
    //   spotifyUri: track.album.uri,
    // }, {
    //   albumType: track.album.album_type,
    //   // artists: track.album.artists,
    //   availableMarkets: track.album.available_markets,
    //   name: track.album.name,
    //   releaseDate: track.album.release_date,
    //   releaseDatePrecision: track.album.release_date_precision,
    //   spotifyUri: track.album.uri,
    //   totalTrack: track.album.total_tracks,
    // }, {
    //   returnNewDocument: true,
    //   upsert: true,
    // });
    const savedTrack = await findOneTrackAndUpdate({
      spotifyUri: track.uri,
    }, {
      // album: savedAlbum?._id,
      // artists,
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