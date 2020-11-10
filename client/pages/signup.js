import Signup from "../components/Signup";
import styled from "styled-components";
import Signin from "./../components/Signin";
import ResetRequest from "../components/ResetRequest";
import { Query } from "react-apollo";
import { CURRENT_USER_QUERY } from "../components/User";

const ColumnStyles = styled.div`
  display: flex;
  flex: 1;
  grid-gap: 20px;
  padding-top: 2rem;
  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const SignupPage = (props) => {
  return (
    <Query query={CURRENT_USER_QUERY}>
      {({ data, loading }) => {
        if (loading) return <p>Učitavanje...</p>;
        if (data.currentUser) return <h2>Već ste prijavljeni!</h2>;
        return (
          <ColumnStyles>
            <Signup />
            <Signin />
            <ResetRequest />
          </ColumnStyles>
        );
      }}
    </Query>
  );
};

export default SignupPage;
