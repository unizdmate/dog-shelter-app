import DogsToAdopt from "./../components/DogsToAdopt";

const Adopt = (props) => (
  <div>
    <DogsToAdopt page={parseFloat(props.query.page) || 1} />
  </div>
);

export default Adopt;
