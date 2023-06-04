import DefaultUpdateResponse from '../fragments/DefaultUpdateResponse';

const updateOneTrack = `mutation UpdateOneTrack($trackId: String!, $trackPayload: TrackPayloadInput!) {
  updateOneTrack(input: {
    trackId: $trackId
    trackPayload: $trackPayload
  }) {
    ${DefaultUpdateResponse}
  }
}`;

export default updateOneTrack;