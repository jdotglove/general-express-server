import FullPlaylist from '../fragments/FullPlaylist';

const getOnePlaylist = `query GetOnePlaylist($playlistId: String) {
  getOnePlaylist( playlistId: $playlistId) {
    ${FullPlaylist}
  }
}`;

export default getOnePlaylist;