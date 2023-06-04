import FullAlbum from '../fragments/FullAlbum';

const getOneAlbum = `query GetOneAlbum($albumId: String) {
  getOneAlbum(input: { albumId: $albumId }) {
    ${FullAlbum}
  }
}`;

export default getOneAlbum;