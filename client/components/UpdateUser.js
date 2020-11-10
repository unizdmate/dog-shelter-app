import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import Router from "next/router";
import { CURRENT_USER_QUERY } from "./User";

export const UPDATE_USER_MUTATION = gql`
  mutation UPDATE_USER_MUTATION($id: ID!, $name: String, $email: String) {
    updateUser(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

class UpdateUser extends Component {
  state = {};

  handleChange = (ev) => {
    const { name, type, value } = ev.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  updateUser = async (ev, updateUserMutation) => {
    ev.preventDefault();
    const response = await updateUserMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      },
    });
    Router.push({
      pathname: "/profile",
      query: { id: response.data.updateUser.id },
    });
  };

  render() {
    return (
      <Query query={CURRENT_USER_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (loading) return <p>Učitavanje...</p>;
          if (!data.currentUser) return <p>Nije pronađeno...</p>;
          return (
            <Mutation mutation={UPDATE_USER_MUTATION} variables={this.state}>
              {(updateUser, { loading, error }) => (
                <Form onSubmit={(ev) => this.updateUser(ev, updateUser)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="name">
                      Ime
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Ime..."
                        required
                        defaultValue={data.currentUser.name}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="email">
                      E-mail
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="E-mail"
                        required
                        defaultValue={data.currentUser.email}
                        onChange={this.handleChange}
                      />
                    </label>
                    <button type="submit">Sačuvaj</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateUser;
