import FullAlbum from '../fragments/FullAlbum';

const getOneAlbum = `query GetOneAlbum($albumId: String!) {
  getOneAlbum(query: { albumId: $albumId }) {
    ${FullAlbum}
  }
}`;

export default getOneAlbum;