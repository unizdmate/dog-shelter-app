import { Query } from "react-apollo";
import gql from "graphql-tag";
import Table from "./styles/Table";
import { CURRENT_USER_QUERY } from "./User";

const ALL_ADOPTIONS_QUERY = gql`
  query {
    adoptions {
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

const AdoptionsComponent = (props) => {
  return (
    <>
      <h2>Pregled udomljavanja</h2>
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
            <Query query={ALL_ADOPTIONS_QUERY}>
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
                    {data.adoptions.map((adoption) => (
                      <AdoptionsList key={adoption.id} adoption={adoption} />
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

const AdoptionsList = (props) => {
  const adoption = props.adoption;

  return (
    <tr>
      <td>{adoption.userName}</td>
      <td>{adoption.userPhoneNo}</td>
      <td>{adoption.dogName}</td>
      <td>{formatedDate(adoption.createdAt)}</td>
      <td>
        <img src={adoption.dogImage} style={{ width: "100%" }} />
      </td>
    </tr>
  );
};

export default AdoptionsComponent;
