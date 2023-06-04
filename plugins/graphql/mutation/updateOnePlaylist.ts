import DefaultUpdateResponse from '../fragments/DefaultUpdateResponse';

const updateOnePlaylist = `mutation UpdateOnePlaylist($playlistId: String!, $playlistPayload: PlaylistPayloadInput!) {
  updateOnePlaylist(input: {
    playlistId: $playlistId
    playlistPayload: $playlistPayload
  }) {
    ${DefaultUpdateResponse}
  }
}`;

export default updateOnePlaylist;