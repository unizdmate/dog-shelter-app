import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Dog from "./DogToAdopt";
import AdoptionPagination from "./AdoptionPagination";
import { perPage } from "../config";

export const ALL_DOGS_QUERY = gql`
  query ALL_DOGS_QUERY($skip: Int = 0, $first: Int=${perPage}) {
    dogs(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      name
      breed
      description
      image
      largeImage
    }
  }
`;

const CenteredContainer = styled.div`
  text-align: center;
`;

const DogsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const DogsToAdopt = (props) => {
  return (
    <CenteredContainer>
      <AdoptionPagination page={props.page} />
      <Query
        query={ALL_DOGS_QUERY}
        variables={{
          skip: props.page * perPage - perPage,
        }}
      >
        {({ data, error, loading }) => {
          if (loading) return <p>Učitavanje....</p>;
          if (error) return <p>{error.message}</p>;
          return (
            <DogsList>
              {data.dogs.map((dog) => (
                <Dog key={dog.id} dog={dog} />
              ))}
            </DogsList>
          );
        }}
      </Query>
      <AdoptionPagination page={props.page} />
    </CenteredContainer>
  );
};

export default DogsToAdopt;
