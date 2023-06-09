import FullTrackAudioFeatures from "./FullTrackAudioFeatures";

const FullTrack = `
  _id
  album
  artists
  audioFeatures {
    ${FullTrackAudioFeatures}
  }
  availableMarkets
  name
  popularity
  spotifyUri
  trackNumber
`;

export default FullTrack;