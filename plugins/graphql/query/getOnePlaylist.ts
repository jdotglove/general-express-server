import FullPlaylist from '../fragments/FullPlaylist';

const getOnePlaylist = `query GetOnePlaylist($playlistId: String!) {
  getOnePlaylist(query: { playlistId: $playlistId }) {
    ${FullPlaylist}
  }
}`;

export default getOnePlaylist;