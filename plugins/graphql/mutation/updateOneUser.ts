import DefaultUpdateResponse from '../fragments/DefaultUpdateResponse';

const updateOneUser = `mutation UpdateOneUser($userId: String!, $userPayload: UserPayloadInput!) {
  updateOneUser(userId: $userId, userPayload: $userPayload) {
    ${DefaultUpdateResponse}
  }
}`;

export default updateOneUser;