import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import { CURRENT_USER_QUERY } from "./User";
import StyledButton from "./styles/StyledButton";

const DELETE_USER_MUTATION = gql`
  mutation DELETE_USER_MUTATION($id: ID!) {
    deleteUser(id: $id) {
      id
      name
    }
  }
`;

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

const DeleteUser = (props) => {
  return (
    <Mutation
      mutation={SIGNOUT_MUTATION}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signout) => (
        <Mutation
          mutation={DELETE_USER_MUTATION}
          variables={{
            id: props.id,
          }}
        >
          {(deleteUser, { error }) => (
            <StyledButton
              style={{
                cursor: "pointer",
                background: `#cd0008`,
              }}
              onClick={() => {
                if (
                  confirm("Želiš li stvarno izbrisati svoj korisnički račun?")
                ) {
                  signout();
                  deleteUser();
                  routeTo();
                }
              }}
            >
              {props.children}
            </StyledButton>
          )}
        </Mutation>
      )}
    </Mutation>
  );
};
export default DeleteUser;
