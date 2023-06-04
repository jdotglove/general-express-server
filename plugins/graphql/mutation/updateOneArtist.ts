import DefaultUpdateResponse from '../fragments/DefaultUpdateResponse';

const updateOneArtist = `mutation UpdateOneArtist($artistId: String!, $artistPayload: ArtistPayloadInput!) {
  updateOneArtist(input: {
    artistId: $artistId
    artistPayload: $artistPayload
  }) {
    ${DefaultUpdateResponse}
  }
}`;

export default updateOneArtist;