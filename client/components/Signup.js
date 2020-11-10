import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";
import Router from "next/router";
import StyledButton from "./styles/StyledButton";
import styled from "styled-components";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

const StyledButtonContainer = styled.div`
  display: flex;
  flex: 1;
  align-content: center;
  justify-content: center;
`;

const Signup = (props) => {
  const [state, setState] = useState({
    email: "",
    name: "",
    password: "",
  });
  const saveToState = (ev) => {
    setState({ ...state, [ev.target.name]: ev.target.value });
  };

  return (
    <Mutation
      mutation={SIGNUP_MUTATION}
      variables={state}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signup, { error, loading }) => {
        return (
          <Form
            method="post"
            onSubmit={async (ev) => {
              ev.preventDefault();
              const response = await signup();
              setState({ ...state, name: "", email: "", password: "" });
              routeTo();
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <p>Nemaš korisnički račun?</p>
              <h2>Registriraj se!</h2>
              <Error error={error} />
              <label htmlFor="email">
                E-mail adresa
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={state.email}
                  onChange={saveToState}
                  required
                  pattern="^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
                  title="Molimo unesite ispravnu e-mail adresu"
                />
              </label>
              <label htmlFor="name">
                Korisničko ime
                <input
                  type="text"
                  name="name"
                  placeholder="Ime"
                  value={state.name}
                  onChange={saveToState}
                  required
                />
              </label>
              <label htmlFor="password">
                Lozinka
                <input
                  type="password"
                  name="password"
                  placeholder="Lozinka"
                  value={state.password}
                  onChange={saveToState}
                  required
                />
              </label>
            </fieldset>
            <StyledButtonContainer>
              <StyledButton
                type="submit"
                style={{ flex: "1", marginTop: "auto" }}
              >
                Registracija
              </StyledButton>
            </StyledButtonContainer>
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

export default Signup;
