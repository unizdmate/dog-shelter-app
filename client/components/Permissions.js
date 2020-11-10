import { Query, Mutation } from "react-apollo";
import Error from "./ErrorMessage";
import gql from "graphql-tag";
import Table from "./styles/Table";
import StyledButton from "./styles/StyledButton";
import PropTypes from "prop-types";
import { useState } from "react";

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const UPDATE_USER_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const PermissionsComponent = (props) => {
  return (
    <Query query={ALL_USERS_QUERY}>
      {({ data, loading, error }) => (
        <div>
          <Error error={error} />
          <h2>Administracija korisnika</h2>
          <Table>
            <thead>
              <tr>
                <th>Ime</th>
                <th>E-mail</th>
                {allPermissions.map((permission) => (
                  <th key={permission}>{permission}</th>
                ))}
                <th>Promjene</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <UserPermissions key={user.id} user={user} />
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Query>
  );
};

const UserPermissions = (props) => {
  UserPermissions.propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  };
  const [state, setState] = useState({
    permissions: props.user.permissions,
  });

  const user = props.user;

  const handlePermissionChange = (ev) => {
    const checkbox = ev.target;
    //kopija trenutnih dopuštenja
    let updatedPermissions = [...state.permissions];
    //dodati ili izbaciti označeno dopuštenje?
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        (permission) => permission !== checkbox.value
      );
    }
    setState({ permissions: updatedPermissions });
  };
  return (
    <Mutation
      mutation={UPDATE_USER_PERMISSIONS_MUTATION}
      variables={{
        permissions: state.permissions,
        userId: props.user.id,
      }}
    >
      {(updatePermissions, { loading, error }) => (
        <>
          {error && (
            <tr>
              <td colSpan="10">
                <Error error={error} />
              </td>
            </tr>
          )}
          <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            {allPermissions.map((permission) => (
              <td key={permission}>
                <label htmlFor={`${user.id}-permission-${permission}`}>
                  <input
                    //veza sa labelom, kad se klikne bilo gdje unutar labele, označi se checkbox
                    id={`${user.id}-permission-${permission}`}
                    type="checkbox"
                    checked={state.permissions.includes(permission)}
                    value={permission}
                    onChange={handlePermissionChange}
                  />
                </label>
              </td>
            ))}
            <td>
              <StyledButton
                type="button"
                disabled={loading}
                onClick={updatePermissions}
              >
                Promijeni
              </StyledButton>
            </td>
          </tr>
        </>
      )}
    </Mutation>
  );
};

const allPermissions = [
  "ADMIN",
  "USER",
  "DOGCREATE",
  "DOGUPDATE",
  "DOGDELETE",
  "PERMISSIONUPDATE",
];

export default PermissionsComponent;
