import FullTrack from '../fragments/FullTrack';

const getOneTrack = `query GetOneTrack($trackId: String!) {
  getOneTrack(query: { trackId: $trackId }) {
    ${FullTrack}
  }
}`;

export default getOneTrack;