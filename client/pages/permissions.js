import SignedIn from "./../components/SignedIn";
import HasPermission from "./../components/HasPermission";
import PermissionsComponent from "./../components/Permissions";

const Permissions = (props) => {
  return (
    <div>
      <SignedIn>
        <HasPermission>
          <PermissionsComponent />
        </HasPermission>
      </SignedIn>
    </div>
  );
};

export default Permissions;
