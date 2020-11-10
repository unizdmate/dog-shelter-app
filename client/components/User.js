import { Query } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

export const CURRENT_USER_QUERY = gql`
  query {
    currentUser {
      id
      email
      name
      permissions
    }
  }
`;

const User = (props) => {
  return (
    <Query {...props} query={CURRENT_USER_QUERY}>
      {(payload) => props.children(payload)}
    </Query>
  );
};

//Osigurati da ono što se komponenti preda preko propsa bude funkcija ==> tipizacija
User.propTypes = {
  children: PropTypes.func.isRequired,
};

export default User;
