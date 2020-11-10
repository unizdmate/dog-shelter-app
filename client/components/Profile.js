import { Query } from "react-apollo";
import gql from "graphql-tag";
import StyledButton from "./styles/StyledButton";
import Router from "next/router";
import HomePage from "./HomePage";
import styled from "styled-components";
import Signout from "../components/Signout";
import User from "../components/User";
import DeleteUser from "./DeleteUser";
import { CURRENT_USER_QUERY } from "./User";
import Link from "next/link";

export const PROFILE_QUERY = gql`
  query {
    currentUser {
      id
      name
      email
      permissions
    }
  }
`;

const StyledProfilePage = styled.div`
  background: white;
  border: 1px solid ${(props) => props.theme.offWhite};
  box-shadow: ${(props) => props.theme.boxShadow};
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-align: center;
  p {
    line-height: 2;
    font-weight: 300;
    flex-grow: 1;
    padding: 0 3rem;
    font-size: 1.5rem;
  }
  h2 {
    margin-bottom: -0.5rem;
  }
`;

const StyledButtonContainer = styled.div`
  padding-bottom: 1%;
  padding-right: 25%;
  padding-left: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProfileComponent = (props) => {
  return (
    <StyledProfilePage>
      <h2>Korisnički račun</h2>
      <Query query={PROFILE_QUERY}>
        {({ data, loading }) => {
          if (loading) return <p>Učitavanje...</p>;
          if (!data.currentUser) return <HomePage />;
          return (
            <div>
              <p>
                <b>Korisničko ime:</b> {data.currentUser.name}
              </p>
              <p>
                <b>E-mail:</b> {data.currentUser.email}
              </p>
            </div>
          );
        }}
      </Query>
      <br />
      <StyledButtonContainer>
        <Query query={PROFILE_QUERY}>
          {({ data, loading }) => {
            if (!data.currentUser) {
              return null;
            } else if (
              data.currentUser.permissions.some((permission) =>
                ["ADMIN"].includes(permission)
              )
            ) {
              return (
                <>
                  <StyledButton onClick={routeToPermissions}>
                    Administracija korisnika
                  </StyledButton>
                  <br />
                  <StyledButton onClick={routeToAdoptions}>
                    Pregled udomljavanja
                  </StyledButton>
                  <br />
                  <StyledButton onClick={routeToFriends}>
                    Pregled prijateljstava
                  </StyledButton>
                </>
              );
            } else if (
              data.currentUser.permissions.some((permission) =>
                ["PERMISSIONUPDATE"].includes(permission)
              )
            ) {
              return (
                <>
                  <StyledButton onClick={routeToPermissions}>
                    Administracija korisnika
                  </StyledButton>
                </>
              );
            } else {
              return null;
            }
          }}
        </Query>
        <br />
        <User>
          {({ data: { currentUser } }) => <>{currentUser && <Signout />}</>}
        </User>
        <br />
        <Query query={CURRENT_USER_QUERY}>
          {({ data, loading }) => {
            if (!data.currentUser) {
              return null;
            }
            return (
              <>
                <StyledButton>
                  <Link
                    href={{
                      pathname: "userupdate",
                      query: { id: data.currentUser.id },
                    }}
                  >
                    <a>Uredi korisnički račun</a>
                  </Link>
                </StyledButton>
                <br />
                <DeleteUser id={data.currentUser.id}>
                  Izbriši korisnički račun
                </DeleteUser>
              </>
            );
          }}
        </Query>
      </StyledButtonContainer>
    </StyledProfilePage>
  );
};

const routeToPermissions = () => {
  Router.push({
    pathname: "/permissions",
  });
};

const routeToAdoptions = () => {
  Router.push({
    pathname: "/adoptions",
  });
};

const routeToFriends = () => {
  Router.push({
    pathname: "/friends",
  });
};

export default ProfileComponent;
