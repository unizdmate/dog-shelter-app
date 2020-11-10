import Link from "next/link";
import UpdateDog from "../components/UpdateDog";

const DogUpdate = (props) => {
  return (
    <div>
      <UpdateDog id={props.query.id} />
    </div>
  );
};

export default DogUpdate;
