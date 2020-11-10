import { Query } from "react-apollo";
import { CURRENT_USER_QUERY } from "./User";
import Signin from "./Signin";
import Signup from "./Signup";
import ResetRequest from "./ResetRequest";
import styled from "styled-components";

const ColumnStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SignedIn = (props) => {
  return (
    <Query query={CURRENT_USER_QUERY}>
      {({ data, loading }) => {
        if (loading) return <p>Učitavanje...</p>;
        if (!data.currentUser) {
          return (
            <div>
              <h3>Molimo, prijavite se</h3>
              <ColumnStyles>
                <Signup />
                <Signin />
                <ResetRequest />
              </ColumnStyles>
            </div>
          );
        }
        return props.children;
      }}
    </Query>
  );
};

export default SignedIn;
