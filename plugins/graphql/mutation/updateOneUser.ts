import DefaultUpdateResponse from '../fragments/DefaultUpdateResponse';

const updateOneUser = `mutation UpdateOneUser($userId: String!, $userPayload: UserPayload!) {
  updateOneUser(input: { userId: $userId, userPayload: $userPayload }) {
    ${DefaultUpdateResponse}
  }
}`;

export default updateOneUser;