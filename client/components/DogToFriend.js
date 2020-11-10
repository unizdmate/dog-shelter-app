import PropTypes from "prop-types";
import Name from "./styles/Name";
import DogItemStyles from "./styles/DogItemStyles";
import Link from "next/link";
import DeleteDog from "./DeleteDog";
import { Query } from "react-apollo";
import { CURRENT_USER_QUERY } from "./User";
import ConfirmFriendModal from "./ConfirmFriendModal";

const DogToFriend = (props) => {
  DogToFriend.propTypes = {
    dog: PropTypes.object.isRequired,
  };
  const { dog } = props;
  return (
    <Query query={CURRENT_USER_QUERY}>
      {({ data, error, loading }) => {
        const user = data.currentUser;
        return (
          <DogItemStyles>
            {dog.image && <img src={dog.image} alt={dog.name}></img>}
            <Name>
              <Link href={{ pathname: "/dog", query: { id: dog.id } }}>
                <a>{dog.name}</a>
              </Link>
            </Name>
            <b>{dog.breed}</b>
            <p>{dog.description}</p>
            <div className="buttonList">
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
                      <a>Uredi</a>
                    </Link>
                  );
                }}
              </Query>
              <Query query={CURRENT_USER_QUERY}>
                {({ data, loading }) => {
                  if (!data.currentUser) {
                    return (
                      <Link href="/signup">
                        <a>Za postati prijatelj, morate biti prijavljeni</a>
                      </Link>
                    );
                  }
                  return (
                    <ConfirmFriendModal
                      dogId={dog.id}
                      dogName={dog.name}
                      dogImage={dog.largeImage}
                      userId={user.id}
                      userName={user.name}
                      userEmail={user.email}
                    />
                  );
                }}
              </Query>
              <Query query={CURRENT_USER_QUERY}>
                {({ data, loading }) => {
                  if (
                    !data.currentUser ||
                    !data.currentUser.permissions.some((permission) =>
                      ["ADMIN", "DOGDELETE"].includes(permission)
                    )
                  ) {
                    return null;
                  }
                  return <DeleteDog id={dog.id}>Izbriši</DeleteDog>;
                }}
              </Query>
            </div>
          </DogItemStyles>
        );
      }}
    </Query>
  );
};

export default DogToFriend;
