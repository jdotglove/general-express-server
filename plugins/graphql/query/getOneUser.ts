import FullUser from '../fragments/FullUser';

const getOneUser = `query GetOneUser($userId: String) {
  getOneUser(userId: $userId) {
    ${FullUser}
  }
}`;

export default getOneUser;