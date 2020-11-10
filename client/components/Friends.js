import { Query } from "react-apollo";
import gql from "graphql-tag";
import Table from "./styles/Table";
import { CURRENT_USER_QUERY } from "./User";

const ALL_FRIENDS_QUERY = gql`
  query {
    friends {
      id
      userName
      userPhoneNo
      dogName
      createdAt
      dogImage
    }
  }
`;

const formatedDate = (date) => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join(".");
};

const FriendsComponent = (props) => {
  return (
    <>
      <h2>Pregled prijateljstava</h2>
      <Query query={CURRENT_USER_QUERY}>
        {({ data, loading }) => {
          if (
            !data.currentUser ||
            !data.currentUser.permissions.some((permission) =>
              ["ADMIN"].includes(permission)
            )
          ) {
            return <h2>Pokušavate pristupiti zaštićenom dijelu aplikacije</h2>;
          }
          return (
            <Query query={ALL_FRIENDS_QUERY}>
              {({ data, loading, error }) => (
                <Table>
                  <thead>
                    <tr>
                      <th>Korisnik</th>
                      <th>Kontakt broj</th>
                      <th>Pas</th>
                      <th>Datum</th>
                      <th>Slika</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.friends.map((friend) => (
                      <FriendsList key={friend.id} friend={friend} />
                    ))}
                  </tbody>
                </Table>
              )}
            </Query>
          );
        }}
      </Query>
    </>
  );
};

const FriendsList = (props) => {
  const friend = props.friend;

  return (
    <tr>
      <td>{friend.userName}</td>
      <td>{friend.userPhoneNo}</td>
      <td>{friend.dogName}</td>
      <td>{formatedDate(friend.createdAt)}</td>
      <td>
        <img src={friend.dogImage} style={{ width: "100%" }} />
      </td>
    </tr>
  );
};

export default FriendsComponent;
