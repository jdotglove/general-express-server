import DefaultUpdateResponse from '../fragments/DefaultUpdateResponse';

const updateOneArtist = `mutation UpdateOneArtist($artistId: String!, $artistPayload: ArtistPayload!) {
  updateOneArtist(input: { artistId: $artistId, artistPayload: $artistPayload }) {
    ${DefaultUpdateResponse}
  }
}`;

export default updateOneArtist;