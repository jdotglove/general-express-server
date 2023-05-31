import { findOneArtistAndUpdate } from '../db/services/artist';
import { findOnePlaylistAndUpdate } from '../db/services/playlist';


export const parseUriForId = (spotifyUri: string) => spotifyUri.split(':')[2];

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
  playlistArray.map(({
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
  duration,
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
  duration: number,
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
    duration,
    explicit,
    name,
    popularity,
    trackNumber,
    type,
    spotifyUri,
  }
};

export const resolveArtistsInDatabase = async (artists: Array<any>) => {
  const artistArray = await Promise.all(artists.map(async ({
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
    return {
      name,
      reference: savedArtist._id
    };
  }));
  return artistArray;
}

export const resolvePlaylistsInDatabase = async (playlists: Array<any>) => {
  const playlistArray = await Promise.all(playlists.map(async ({
    name,
    owner,
    tracks,
    uri: spotifyUri
  }) => {
    const savedPlaylist = await findOnePlaylistAndUpdate({
      spotifyUri: spotifyUri,
    }, {
      name,
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

// export const resolveTracksInDatabase = async (tracks: Array<any>) => {
//   const trackArray = await Promise.all(tracks.map(async ({
//     name,
//     spotifyUri,
//   })))
// }