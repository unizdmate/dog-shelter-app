import { Query } from "react-apollo";
import { CURRENT_USER_QUERY } from "./User";

const HasPermission = (props) => {
  return (
    <Query query={CURRENT_USER_QUERY}>
      {({ data, loading }) => {
        if (loading) return <p>Učitavanje...</p>;
        if (
          !data.currentUser.permissions.some((permission) =>
            ["ADMIN", "PERMISSIONUPDATE"].includes(permission)
          )
        ) {
          return <h2>Pokušavate pristupiti zaštićenom dijelu aplikacije</h2>;
        }
        return props.children;
      }}
    </Query>
  );
};

export default HasPermission;
