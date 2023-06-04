import FullTrack from '../fragments/FullTrack';

const getOneTrack = `query GetOneTrack($trackId: String) {
  getOneTrack(input: { trackId: $trackId }) {
    ${FullTrack}
  }
}`;

export default getOneTrack;