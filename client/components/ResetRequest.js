import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import StyledButton from "./styles/StyledButton";
import styled from "styled-components";

const PASSWORD_RESET_MUTATION = gql`
  mutation PASSWORD_RESET_MUTATION($email: String!) {
    resetRequest(email: $email) {
      message
    }
  }
`;

const StyledButtonContainer = styled.div`
  display: flex;
  flex: 1;
  align-content: center;
  justify-content: center;
`;

const ResetRequest = (props) => {
  const [state, setState] = useState({
    email: "",
  });
  const saveToState = (ev) => {
    setState({ ...state, [ev.target.name]: ev.target.value });
  };
  return (
    <Mutation mutation={PASSWORD_RESET_MUTATION} variables={state}>
      {(reset, { error, loading, called }) => {
        return (
          <Form
            method="post"
            onSubmit={async (ev) => {
              ev.preventDefault();
              await reset();
              setState({ ...state, email: "" });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <p>Zaboravljena lozinka?</p>
              <h2>Zatraži novu lozinku!</h2>
              <Error error={error} />
              {!error && !loading && called && (
                <p>Zahtjev poslan. Provjerite vaš e-mail</p>
              )}
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
            </fieldset>
            <StyledButtonContainer>
              <StyledButton
                type="submit"
                style={{ flex: "1", marginTop: "auto" }}
              >
                Zatraži
              </StyledButton>
            </StyledButtonContainer>
          </Form>
        );
      }}
    </Mutation>
  );
};
export default ResetRequest;
