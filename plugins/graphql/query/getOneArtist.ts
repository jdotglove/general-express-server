import FullArtist from '../fragments/FullArtist';

const getOneArtist = `query GetOneArtist($artistId: String) {
  getOneArtist(input: { artistId: $artistId }) {
    ${FullArtist}
  }
}`;

export default getOneArtist;