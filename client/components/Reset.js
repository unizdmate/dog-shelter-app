import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import PropTypes from "prop-types";
import { CURRENT_USER_QUERY } from "./User";
import Router from "next/router";
import StyledButton from "./styles/StyledButton";

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

const Reset = (props) => {
  Reset.propTypes = {
    resetToken: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
  };
  const [state, setState] = useState({
    password: "",
    confirmPassword: "",
  });
  const saveToState = (ev) => {
    setState({ ...state, [ev.target.name]: ev.target.value });
  };
  return (
    <Mutation
      mutation={RESET_MUTATION}
      variables={{
        resetToken: props.resetToken,
        password: state.password,
        confirmPassword: state.confirmPassword,
      }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(reset, { error, loading, called }) => {
        if (!props.resetToken) {
          return <p>Nije pronađeno...</p>;
        }
        return (
          <Form
            method="post"
            onSubmit={async (ev) => {
              ev.preventDefault();
              await reset();
              setState({ ...state, password: "", confirmPassword: "" });
              routeTo();
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Postavi novu lozinku</h2>
              <Error error={error} />
              <label htmlFor="password">
                Lozinka
                <input
                  type="password"
                  name="password"
                  placeholder="Nova lozinka..."
                  value={state.password}
                  onChange={saveToState}
                  required
                />
              </label>
              <label htmlFor="confirmPassword">
                Potvrdi lozinku
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Nova lozinka...."
                  value={state.confirmPassword}
                  onChange={saveToState}
                />
              </label>
              <StyledButton type="submit">Potvrdi</StyledButton>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
};

const routeTo = () => {
  Router.push({
    pathname: "/",
  });
};
export default Reset;
