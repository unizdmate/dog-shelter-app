import styled from "styled-components";
import ProfileComponent from "../components/Profile";

const ColumnStyles = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Profile = (props) => {
  return (
    <ColumnStyles>
      <ProfileComponent />
    </ColumnStyles>
  );
};

export default Profile;
