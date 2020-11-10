import React, { useState } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";
import Router from "next/router";

export const CREATE_DOG_MUTATION = gql`
  mutation CREATE_DOG_MUTATION(
    $name: String!
    $breed: String
    $description: String!
    $image: String
    $largeImage: String
  ) {
    createDog(
      name: $name
      breed: $breed
      description: $description
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

const CreateDog = (props) => {
  const [state, setState] = useState({
    name: "",
    breed: "",
    description: "",
    image: "",
    largeImage: "",
  });

  const handleChange = (ev) => {
    const { name, type, value } = ev.target;
    const val = type === "number" ? parseFloat(value) : value;
    setState({ ...state, [name]: val });
  };

  const uploadFile = async (ev) => {
    const files = ev.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "dog-shelter");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dszx0l61s/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const file = await response.json();
    setState((state) => ({
      ...state,
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    }));
  };

  return (
    <Query query={CURRENT_USER_QUERY}>
      {({ data, loading }) => {
        if (
          !data.currentUser ||
          !data.currentUser.permissions.some((permission) =>
            ["ADMIN", "DOGCREATE"].includes(permission)
          )
        ) {
          return <h2>Pokušavate pristupiti zaštićenom dijelu aplikacije</h2>;
        }
        return (
          <Mutation mutation={CREATE_DOG_MUTATION} variables={state}>
            {(createDog, { loading, error }) => (
              <Form
                onSubmit={async (ev) => {
                  //zaustaviti default submit od cijele forme
                  ev.preventDefault();
                  //pozvati mutaciju
                  const response = await createDog();
                  //preusmjeriti na url za kreirani objekt tipa pas
                  await Router.push({
                    pathname: "/dog",
                    query: { id: response.data.createDog.id },
                  });
                  window.location.reload();
                }}
              >
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                  <p>Dodaj novu njuškicu za udomljavanje</p>
                  <label htmlFor="name">
                    Ime
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Ime..."
                      required
                      value={state.name}
                      onChange={handleChange}
                    />
                  </label>
                  <label htmlFor="breed">
                    Vrsta
                    <input
                      type="text"
                      id="breed"
                      name="breed"
                      placeholder="Vrsta..."
                      value={state.breed}
                      onChange={handleChange}
                    />
                  </label>
                  <label htmlFor="description">
                    O meni
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Opis..."
                      value={state.description}
                      onChange={handleChange}
                    />
                  </label>
                  <label htmlFor="file">
                    Slika
                    <input
                      type="file"
                      id="file"
                      name="file"
                      placeholder="Dodaj sliku..."
                      onChange={uploadFile}
                    />
                    <p>Sačekajte da se slika učita...</p>
                    {state.image && (
                      <img src={state.image} alt="Demo prikaz" width="150" />
                    )}
                  </label>
                  <button type="submit">Dodaj</button>
                </fieldset>
              </Form>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
};

export default CreateDog;
