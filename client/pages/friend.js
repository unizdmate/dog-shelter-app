import DogsToFriend from "./../components/DogsToFriend";

const Friend = (props) => (
  <div>
    <DogsToFriend page={parseFloat(props.query.page) || 1} />
  </div>
);

export default Friend;
