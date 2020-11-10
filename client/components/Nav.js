import Link from "next/link";
import NavStyles from "./styles/NavStyles";
import User from "./User";
import { Query } from "react-apollo";
import { CURRENT_USER_QUERY } from "./User";

const Nav = () => {
  return (
    <User>
      {({ data: { currentUser } }) => (
        <NavStyles>
          <Link href="/adopt">
            <a>Udomi me</a>
          </Link>
          <Link href="/friend">
            <a>Budi mi prijatelj</a>
          </Link>
          {currentUser && (
            <>
              <Link href="/profile">
                <a>{currentUser.name}</a>
              </Link>
              <HasPermission>
                <Link href="/addforadoption">
                  <a>Dodaj</a>
                </Link>
              </HasPermission>
            </>
          )}
          {!currentUser && (
            <>
              <Link href="/signup">
                <a>Prijavi se</a>
              </Link>
            </>
          )}
        </NavStyles>
      )}
    </User>
  );
};

const HasPermission = (props) => {
  return (
    <Query query={CURRENT_USER_QUERY}>
      {({ data, loading }) => {
        if (loading) return <p>Učitavanje...</p>;
        if (
          !data.currentUser ||
          !data.currentUser.permissions.some((permission) =>
            ["ADMIN", "DOGCREATE"].includes(permission)
          )
        ) {
          return null;
        }
        return props.children;
      }}
    </Query>
  );
};

export default Nav;
