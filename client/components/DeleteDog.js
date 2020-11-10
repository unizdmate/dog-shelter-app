import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ALL_DOGS_QUERY } from "./DogsToAdopt";

const DELETE_DOG_MUTATION = gql`
  mutation DELETE_DOG_MUTATION($id: ID!) {
    deleteDog(id: $id) {
      id
      name
    }
  }
`;

const DeleteDog = (props) => {
  const update = (cache, payload) => {
    //update cache memorije da se poslije brisanja rezultat pokaže na stranici
    //1. učitati cache
    const data = cache.readQuery({ query: ALL_DOGS_QUERY });
    //2. filtrirati izbrisani objekt
    data.dogs = data.dogs.filter((dog) => dog.id !== payload.data.deleteDog.id);
    //3, vratiti preostale objekte
    cache.writeQuery({ query: ALL_DOGS_QUERY, data });
    window.location.reload();
  };
  return (
    <Mutation
      mutation={DELETE_DOG_MUTATION}
      variables={{
        id: props.id,
      }}
      update={update}
    >
      {(deleteDog, { error }) => (
        <button
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (confirm("Želiš li stvarno izbrisati?")) {
              deleteDog();
            }
          }}
        >
          {props.children}
        </button>
      )}
    </Mutation>
  );
};
export default DeleteDog;
