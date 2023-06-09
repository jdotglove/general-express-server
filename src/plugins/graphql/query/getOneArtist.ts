import FullArtist from '../fragments/FullArtist';

const getOneArtist = `query GetOneArtist($artistId: String!) {
  getOneArtist(query: { artistId: $artistId }) {
    ${FullArtist}
  }
}`;

export default getOneArtist;