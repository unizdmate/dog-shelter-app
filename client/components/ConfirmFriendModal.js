import { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import Form from "./styles/Form";
import StyledButton from "./styles/StyledButton";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const BECOME_FRIEND_MUTATION = gql`
  mutation BECOME_FRIEND_MUTATION(
    $dogId: String!
    $dogName: String!
    $dogImage: String!
    $userId: String!
    $userName: String!
    $userEmail: String!
    $userPhoneNo: String!
  ) {
    becomeFriend(
      dogId: $dogId
      dogName: $dogName
      dogImage: $dogImage
      userId: $userId
      userName: $userName
      userEmail: $userEmail
      userPhoneNo: $userPhoneNo
    ) {
      id
    }
  }
`;

const modalStyle = {
  overlay: {
    backgroundColor: "#3A3A3A",
    opacity: "99%",
    zIndex: "5",
  },
  content: {
    positon: "absolute",
    height: "95%",
    width: "80%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "5px",
    backgroundColor: "white",
    textAlign: "center",
  },
};

const StyledModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StyledConfirmFriendContainer = styled.div`
  display: flex;
  flex: 1;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.offWhite};
  padding-left: 10rem;
  padding-right: 10rem;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const StyledConfirmedFriendItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  width: 50%;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-around;
`;

const ConfirmFriendModal = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [state, setState] = useState({
    dogId: props.dogId,
    dogName: props.dogName,
    dogImage: props.dogImage,
    userId: props.userId,
    userName: props.userName,
    userEmail: props.userEmail,
    userPhoneNo: "",
  });

  const handleChange = (ev) => {
    const { name, type, value } = ev.target;
    const val = type === "number" ? parseFloat(value) : value;
    setState({ ...state, [name]: val });
  };

  return (
    <>
      <button
        style={{ cursor: "pointer" }}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Budi mi prijatelj
      </button>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        ariaHideApp={false}
        style={modalStyle}
      >
        <StyledModalContainer>
          <StyledConfirmFriendContainer>
            <StyledConfirmedFriendItem>
              <h2>
                {props.dogName} ti se zahvaljuje što mu želiš biti prijatelj!
              </h2>
              <img
                src={props.dogImage}
                style={{ width: "100%", padding: "1rem" }}
              ></img>
              <p>
                {props.userName}, {props.dogName} ti se zahvaljuje, a i mi u
                njegovo ime što mu želiš biti prijatelj!
              </p>
              <p>
                Prije nego što ti povjerimo u ruke nekoga od naših štićenika,
                dogovaramo sastanak u našem prostoru da se uvjerimo u vaše
                kvalitetno ophođenje prema životinjama.
              </p>

              <p>
                Molimo te stoga da provjeriš jesu li podaci s desne strane
                ispravno uneseni te da nakon toga klikom na "Potvrdi"
                kompletiraš proces.
              </p>
            </StyledConfirmedFriendItem>
            <StyledConfirmedFriendItem>
              <h2>
                {props.userName}, molimo te da provjeriš ispravnost podataka:
              </h2>
              <Mutation
                mutation={BECOME_FRIEND_MUTATION}
                variables={state}
                onCompleted={() => setIsOpen(false)}
              >
                {(becomeFriend, { error, loading }) => {
                  return (
                    <Form
                      method="post"
                      onSubmit={async (ev) => {
                        ev.preventDefault();
                        setState({
                          ...state,
                          dogId: props.dogId,
                          dogName: props.dogName,
                          dogImage: props.dogImage,
                          userId: props.userId,
                          userName: "",
                          userEmail: "",
                          userPhoneNo: "",
                        });
                        const response = await becomeFriend();
                      }}
                    >
                      <fieldset disabled={loading} aria-busy={loading}>
                        <h2>Korisnički podaci</h2>
                        <label htmlFor="userEmail">
                          E-mail adresa
                          <input
                            type="email"
                            id="userEmail"
                            name="userEmail"
                            placeholder="E-mail"
                            value={state.userEmail}
                            required
                            pattern="^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
                            title="Molimo unesite ispravnu e-mail adresu"
                            onChange={handleChange}
                          />
                        </label>
                        <label htmlFor="userName">
                          Korisničko ime
                          <input
                            type="text"
                            name="userName"
                            id="userName"
                            placeholder="Ime"
                            value={state.userName}
                            required
                            onChange={handleChange}
                          />
                        </label>
                        <label htmlFor="userPhoneNo">
                          Broj telefona ili mobitela
                          <input
                            type="text"
                            name="userPhoneNo"
                            id="userPhoneNo"
                            placeholder="Tel ili mob"
                            value={state.userPhoneNo}
                            required
                            pattern="[0-9]{9,10}"
                            title="Molimo unesite 9 ili 10 znamenki u formatu 09xxxxxxx"
                            onChange={handleChange}
                          />
                        </label>
                        <br />
                        <StyledButtonContainer>
                          <StyledButton type="submit">Potvrdi</StyledButton>
                          <StyledButton
                            type="reset"
                            onClick={async () => {
                              await setIsOpen(false);
                              setState({
                                dogId: props.dogId,
                                dogName: props.dogName,
                                dogImage: props.dogImage,
                                userId: props.userId,
                                userName: props.userName,
                                userEmail: props.userEmail,
                                userPhoneNo: "",
                              });
                            }}
                          >
                            Odustani
                          </StyledButton>
                        </StyledButtonContainer>
                      </fieldset>
                    </Form>
                  );
                }}
              </Mutation>
              <br />
              <b>Naši će te volonteri kontaktirati u najkraćem mogućem roku!</b>
            </StyledConfirmedFriendItem>
          </StyledConfirmFriendContainer>
        </StyledModalContainer>
      </Modal>
    </>
  );
};

export default ConfirmFriendModal;
