import { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import Form from "./styles/Form";
import StyledButton from "./styles/StyledButton";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ALL_DOGS_QUERY } from "./DogsToAdopt";

const ADOPT_DOG_MUTATION = gql`
  mutation ADOPT_DOG_MUTATION(
    $dogId: String!
    $dogName: String!
    $dogImage: String!
    $userId: String!
    $userName: String!
    $userEmail: String!
    $userPhoneNo: String!
    $userAddress: String!
    $userAreaCode: String!
    $userCity: String!
  ) {
    adopt(
      dogId: $dogId
      dogName: $dogName
      dogImage: $dogImage
      userId: $userId
      userName: $userName
      userEmail: $userEmail
      userPhoneNo: $userPhoneNo
      userAddress: $userAddress
      userAreaCode: $userAreaCode
      userCity: $userCity
    ) {
      id
    }
  }
`;

const DELETE_DOG_MUTATION = gql`
  mutation DELETE_DOG_MUTATION($id: ID!) {
    deleteDog(id: $id) {
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

const StyledConfirmAdoptContainer = styled.div`
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

const StyledConfirmedAdoptionItem = styled.div`
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

const ConfirmAdoptModal = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [state, setState] = useState({
    dogId: props.dogId,
    dogName: props.dogName,
    dogImage: props.dogImage,
    userId: props.userId,
    userName: props.userName,
    userEmail: props.userEmail,
    userPhoneNo: "",
    userAddress: "",
    userAreaCode: "",
    userCity: "",
  });

  const handleChange = (ev) => {
    const { name, type, value } = ev.target;
    const val = type === "number" ? parseFloat(value) : value;
    setState({ ...state, [name]: val });
  };

  const update = (cache, payload) => {
    //update cache memorije da se poslije brisanja rezultat pokaže na stranici
    //1. učitati cache
    const data = cache.readQuery({ query: ALL_DOGS_QUERY });
    //2. filtrirati izbrisani objekt
    data.dogs = data.dogs.filter((dog) => dog.id !== payload.data.deleteDog.id);
    //3, vratiti preostale objekte
    cache.writeQuery({ query: ALL_DOGS_QUERY, data });
    window.location.reload();
  };

  return (
    <>
      <button
        style={{ cursor: "pointer" }}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Udomi
      </button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        ariaHideApp={false}
        style={modalStyle}
      >
        <StyledModalContainer>
          <StyledConfirmAdoptContainer>
            <StyledConfirmedAdoptionItem>
              <h2>{props.dogName} ti se zahvaljuje što ga želiš udomiti!</h2>
              <img
                src={props.dogImage}
                style={{ width: "100%", padding: "1rem" }}
              ></img>
              <p>
                {props.userName}, {props.dogName} ti se zahvaljuje, a i mi u
                njegovo ime što ga želiš udomiti!
              </p>
              <p>
                Prije udomljavanja je potrebno da se uvjerimo kako naši mali
                štićenici odlaze u prave ruke, stoga dogovaramo dva sastanka:
                Jedan u tvom domu da se uvjerimo kako imaš sve potrebne uvjete
                za držanje ljubimaca, a drugi u našem prostoru da se uvjerimo u
                tvoje kvalitetno ophođenje prema životinjama. Nakon uspješno
                održanih sastanaka, naše ćeš prostore napustiti s novim
                četveronožnim ljubimcem!
              </p>

              <p>
                Molimo te stoga da provjeriš jesu li podaci s desne strane
                ispravno uneseni te da nakon toga klikom na "Potvrdi"
                kompletiraš proces.
              </p>
            </StyledConfirmedAdoptionItem>
            <StyledConfirmedAdoptionItem>
              <h2>
                {props.userName}, molimo te da provjeriš ispravnost podataka:
              </h2>
              <Mutation
                mutation={ADOPT_DOG_MUTATION}
                variables={state}
                onCompleted={() => setIsOpen(false)}
              >
                {(adopt, { error, loading }) => {
                  return (
                    <Mutation
                      mutation={DELETE_DOG_MUTATION}
                      variables={{ id: props.dogId }}
                      update={update}
                    >
                      {(deleteDog, { error, loading }) => {
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
                                userAddress: "",
                                userAreaCode: "",
                                userCity: "",
                              });
                              deleteDog();
                              const response = await adopt();
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
                              <label htmlFor="userAddress">
                                Adresa
                                <input
                                  type="text"
                                  name="userAddress"
                                  id="userAddress"
                                  placeholder="Adresa"
                                  value={state.userAddress}
                                  required
                                  onChange={handleChange}
                                />
                              </label>
                              <label htmlFor="userAreaCode">
                                Poštanski broj
                                <input
                                  type="text"
                                  name="userAreaCode"
                                  id="userAreaCode"
                                  placeholder="Poštanski broj"
                                  value={state.userAreaCode}
                                  required
                                  pattern="[0-9]{5}"
                                  title="Molimo unesite 5 znamenki"
                                  onChange={handleChange}
                                />
                              </label>
                              <label htmlFor="userCity">
                                Grad / Općina / Mjesto
                                <input
                                  type="text"
                                  name="userCity"
                                  id="userCity"
                                  placeholder="Grad, općina ili mjesto"
                                  value={state.userCity}
                                  required
                                  onChange={handleChange}
                                />
                              </label>
                              <br />
                              <StyledButtonContainer>
                                <StyledButton type="submit">
                                  Potvrdi
                                </StyledButton>
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
                                      userAddress: "",
                                      userAreaCode: "",
                                      userCity: "",
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
                  );
                }}
              </Mutation>
              <br />
              <b>Naši će te volonteri kontaktirati u najkraćem mogućem roku!</b>
            </StyledConfirmedAdoptionItem>
          </StyledConfirmAdoptContainer>
        </StyledModalContainer>
      </Modal>
    </>
  );
};

export default ConfirmAdoptModal;
