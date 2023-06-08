import DefaultUpdateResponse from '../fragments/DefaultUpdateResponse';

const updateOneAlbum = `mutation UpdateOneAlbum($albumId: String!, $albumPayload: AlbumPayload!) {
  updateOneAlbum(input: { albumId: $albumId, albumPayload: $albumPayload }) {
    ${DefaultUpdateResponse}
  }
}`;

export default updateOneAlbum;



