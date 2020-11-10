import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";
import Router from "next/router";
import StyledButton from "./styles/StyledButton";

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`;

const routeTo = () => {
  Router.push({
    pathname: "/",
  });
};

const Signout = (props) => {
  return (
    <Mutation
      mutation={SIGNOUT_MUTATION}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signout) => (
        <StyledButton
          onClick={() => {
            {
              signout();
            }
            routeTo();
          }}
        >
          Odjava
        </StyledButton>
      )}
    </Mutation>
  );
};

export default Signout;
