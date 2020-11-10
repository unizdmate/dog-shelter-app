import gql from "graphql-tag";
import { Query } from "react-apollo";
import Error from "./ErrorMessage";
import styled from "styled-components";
import { CURRENT_USER_QUERY } from "./User";
import Link from "next/link";
import StyledButton from "./styles/StyledButton";

export const SINGLE_DOG_QUERY = gql`
  query SINGLE_DOG_QUERY($id: ID!) {
    dog(where: { id: $id }) {
      id
      name
      breed
      description
      largeImage
    }
  }
`;

const SingleDogStyles = styled.div`
  background: white;
  border: 1px solid ${(props) => props.theme.offWhite};
  border-radius: 5px;
  box-shadow: ${(props) => props.theme.boxShadow};
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  padding: 2rem;
  img {
    height: 500px;
    object-fit: cover;
    transition: all 0.3s ease-out;
    @media (max-width: 800px) {
      width: 600px;
    }
  }
  .image-container {
    overflow: hidden;
    text-align: center;
  }
  .image-container img:hover {
    transform: scale(1.2);
  }
  img:hover {
    transform: scale(1.5);
  }
  p {
    text-align: center;
    line-height: 2;
    font-weight: 300;
    flex-grow: 1;
    padding: 0 3rem;
    font-size: 1.5rem;
  }
  h2,
  h3 {
    text-align: center;
  }
`;

const Name = styled.h1`
  margin: 0 1rem;
  text-align: center;
  transform: skew(-5deg) rotate(-1deg);
  margin-top: -3rem;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
  color: ${(props) => props.theme.blue};
`;

const StyledButtonContainer = styled.div`
  padding-bottom: 1%;
  padding-right: 40%;
  padding-left: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SingleDog = (props) => {
  return (
    <Query
      query={SINGLE_DOG_QUERY}
      variables={{
        id: props.id,
      }}
    >
      {({ error, loading, data }) => {
        if (error) return <Error error={error} />;
        if (loading) return <p>Učitavanje...</p>;
        if (!data.dog) return <p>Nije pronađeno...</p>;
        const dog = data.dog;
        return (
          <>
            <Name>{dog.name}</Name>
            <SingleDogStyles>
              <div className="image-container">
                <img src={dog.largeImage} alt={dog.name} />
              </div>
              <div className="details">
                <h3>{dog.breed}</h3>
                <p>{dog.description}</p>
              </div>
              <Query query={CURRENT_USER_QUERY}>
                {({ data, loading }) => {
                  if (
                    !data.currentUser ||
                    !data.currentUser.permissions.some((permission) =>
                      ["ADMIN", "DOGUPDATE"].includes(permission)
                    )
                  ) {
                    return null;
                  }
                  return (
                    <Link
                      href={{ pathname: "dogupdate", query: { id: dog.id } }}
                    >
                      <StyledButtonContainer>
                        <StyledButton>Uredi</StyledButton>
                      </StyledButtonContainer>
                    </Link>
                  );
                }}
              </Query>
            </SingleDogStyles>
          </>
        );
      }}
    </Query>
  );
};

export default SingleDog;
