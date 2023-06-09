import axios from '../axios';
export const graphQLRequest = (requestParams: {
  query?: string;
  mutation?: string;
  variables: Record<string, any>;
}) => (
  axios({
    method: 'post',
    url: `${process.env.GRAPHQL_URL}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: JSON.stringify(requestParams),
  })
);