import Link from "next/link";
import UpdateUser from "../components/UpdateUser";

const UserUpdate = (props) => {
  return (
    <div>
      <UpdateUser id={props.query.id} />
    </div>
  );
};

export default UserUpdate;
