import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import Router from "next/router";
import { CURRENT_USER_QUERY } from "./User";

export const SINGLE_DOG_QUERY = gql`
  query SINGLE_DOG_QUERY($id: ID!) {
    dog(where: { id: $id }) {
      id
      name
      breed
      description
    }
  }
`;

export const UPDATE_DOG_MUTATION = gql`
  mutation UPDATE_DOG_MUTATION(
    $id: ID!
    $name: String
    $breed: String
    $description: String
  ) {
    updateDog(id: $id, name: $name, breed: $breed, description: $description) {
      id
      name
      breed
      description
    }
  }
`;

class UpdateDog extends Component {
  state = {};

  handleChange = (ev) => {
    const { name, type, value } = ev.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  updateDog = async (ev, updateDogMutation) => {
    ev.preventDefault();
    const response = await updateDogMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      },
    });
    Router.push({
      pathname: "/dog",
      query: { id: response.data.updateDog.id },
    });
  };

  render() {
    return (
      <Query query={CURRENT_USER_QUERY}>
        {({ data, loading }) => {
          if (
            !data.currentUser ||
            !data.currentUser.permissions.some((permission) =>
              ["ADMIN", "DOGUPDATE"].includes(permission)
            )
          ) {
            return <h2>Pokušavate pristupiti zaštićenom dijelu aplikacije</h2>;
          }
          return (
            <Query query={SINGLE_DOG_QUERY} variables={{ id: this.props.id }}>
              {({ data, loading, error }) => {
                if (error) return <p>Nastala je greška...</p>;
                if (loading) return <p>Učitavanje...</p>;
                if (!data.dog) return <p>Nije pronađeno...</p>;
                return (
                  <Mutation
                    mutation={UPDATE_DOG_MUTATION}
                    variables={this.state}
                  >
                    {(updateDog, { loading, error }) => (
                      <Form onSubmit={(ev) => this.updateDog(ev, updateDog)}>
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
                              defaultValue={data.dog.name}
                              onChange={this.handleChange}
                            />
                          </label>
                          <label htmlFor="breed">
                            Vrsta
                            <input
                              type="text"
                              id="breed"
                              name="breed"
                              placeholder="Vrsta..."
                              defaultValue={data.dog.breed}
                              onChange={this.handleChange}
                            />
                          </label>
                          <label htmlFor="description">
                            O meni
                            <textarea
                              id="description"
                              name="description"
                              placeholder="Opis..."
                              defaultValue={data.dog.description}
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
        }}
      </Query>
    );
  }
}

export default UpdateDog;
