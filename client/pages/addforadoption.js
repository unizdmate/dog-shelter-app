import CreateDog from "../components/CreateDog";
import SignedIn from "./../components/SignedIn";
import { Query } from "react-apollo";
import { CURRENT_USER_QUERY } from "../components/User";

const AddForAdoption = (props) => {
  return <CreateDog />;
};

const HasPermission = (props) => {
  return (
    <Query query={CURRENT_USER_QUERY}>
      {({ data, loading }) => {
        if (loading) return <p>Učitavanje...</p>;
        if (
          !data.currentUser.permissions.some((permission) =>
            ["ADMIN", "DOGCREATE"].includes(permission)
          )
        ) {
          return <h2>Pokušavate pristupiti zaštićenom dijelu aplikacije</h2>;
        }
        return props.children;
      }}
    </Query>
  );
};

export default AddForAdoption;
