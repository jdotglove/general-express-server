import FullUser from '../fragments/FullUser';

const getOneUser = `query GetOneUser($userId: String!) {
  getOneUser(query: { userId: $userId }) {
    ${FullUser}
  }
}`;

export default getOneUser;