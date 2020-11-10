import SingleDog from "./../components/SingleDog";

const Dog = (props) => {
  return (
    <div>
      <SingleDog id={props.query.id} />
    </div>
  );
};

export default Dog;
