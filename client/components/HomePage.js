import styled from "styled-components";
import hp_dog_01 from "../static/hp_dog_01.jpg";
import hp_dog_02 from "../static/hp_dog_02.jpg";
import hp_dog_03 from "../static/hp_dog_03.jpg";
import happy_dog_01 from "../static/happy_dog_01.jpg";
import happy_dog_02 from "../static/happy_dog_02.jpg";
import StyledButton from "./styles/StyledButton";
import Modal from "react-modal";
import { useState } from "react";

const StyledCenteredDiv = styled.div`
  text-align: center;
  display: flex;
  flex: 1;
  grid-gap: 1rem;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const StyledHPContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 2rem;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.offWhite};
  box-shadow: ${(props) => props.theme.boxShadow};
  position: relative;
  h2 {
    line-height: 2;
    flex-grow: 1;
    padding: 0 3rem;
    font-size: 1.5rem;
  }

  p {
    line-height: 2;
    font-weight: 300;
    flex-grow: 1;
    padding: 0 3rem;
    font-size: 1.5rem;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s ease-out;
  }
  .image-container {
    overflow: hidden;
    height: 250px;
    @media (max-width: 900px) {
      height: 300px;
    }
  }
  .image-container img:hover {
    transform: scale(1.2);
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

const HomePage = (props) => {
  const [dirModalIsOpen, setDirModalIsOpen] = useState(false);
  const [adoptModalIsOpen, setAdoptModalIsOpen] = useState(false);
  const [friendModalIsOpen, setFriendModalIsOpen] = useState(false);
  return (
    <>
      <StyledCenteredDiv>
        <StyledHPContainer>
          <div className="image-container">
            <img src={hp_dog_01} alt="pocetna slika" />
          </div>
          <div className="details">
            <h2>Kako do nas?</h2>
          </div>
          <StyledButton
            onClick={() => {
              setDirModalIsOpen(true);
            }}
          >
            Saznaj više
          </StyledButton>
          <Modal
            isOpen={dirModalIsOpen}
            onRequestClose={() => setDirModalIsOpen(false)}
            ariaHideApp={false}
            style={modalStyle}
          >
            <h2>Kako do nas?</h2>
            <div style={{ borderBottom: "solid 1px black" }} />
            <DisplayIFrame iframe={iframe} />
          </Modal>
        </StyledHPContainer>
        <StyledHPContainer>
          <div className="image-container">
            <img src={hp_dog_02} alt="pocetna slika" />
          </div>
          <div className="details">
            <h2>Kako udomiti?</h2>
          </div>
          <StyledButton
            onClick={() => {
              setAdoptModalIsOpen(true);
            }}
          >
            Saznaj više
          </StyledButton>
          <Modal
            isOpen={adoptModalIsOpen}
            onRequestClose={() => setAdoptModalIsOpen(false)}
            ariaHideApp={false}
            style={modalStyle}
          >
            <AdoptText />
          </Modal>
        </StyledHPContainer>
        <StyledHPContainer>
          <div className="image-container">
            <img src={hp_dog_03} alt="pocetna slika" />
          </div>
          <div className="details">
            <h2>Kako postati prijatelj?</h2>
          </div>
          <StyledButton
            onClick={() => {
              setFriendModalIsOpen(true);
            }}
          >
            Saznaj više
          </StyledButton>
          <Modal
            isOpen={friendModalIsOpen}
            onRequestClose={() => setFriendModalIsOpen(false)}
            ariaHideApp={false}
            style={modalStyle}
          >
            <FriendText />
          </Modal>
        </StyledHPContainer>
      </StyledCenteredDiv>
    </>
  );
};

const modalStyle = {
  overlay: {
    backgroundColor: "#3A3A3A",
    opacity: "99%",
    zIndex: "5",
  },
  content: {
    positon: "absolute",
    height: "95%",
    width: "75%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "5px",
    backgroundColor: "white",
    textAlign: "center",
  },
};

const iframe = `<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6664.019725847222!2d15.227493310966045!3d44.14053996417268!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xf56e4832fadcfa67!2sZadarski%20Azil!5e0!3m2!1sen!2shr!4v1601121748925!5m2!1sen!2shr" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`;

const DisplayIFrame = (props) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : "" }}
    />
  );
};

const AdoptText = () => {
  return (
    <>
      <h2>Kako udomiti?</h2>
      <div style={{ borderBottom: "solid 1px black" }} />
      <p>
        Nakon što se na našim stranicama odabrali kojega će te od naših malih
        štićenika udomiti, morate ispuniti formular s osobnim podacima kako bi
        naši volonter stupili s vama u kontakt.
      </p>
      <p>
        Naime, prije udomljavanja je potrebno da se uvjerimo kako naši mali
        štićenici odlaze u prave ruke, stoga dogovaramo dva sastanka: Jedan u
        vašem domu da se uvjerimo kako imate sve potrebne uvjete za držanje
        ljubimca, a drugi u našem prostoru da se uvjerimo u vaše kvalitetno
        ophođenje prema životinjama.
      </p>

      <p>
        Nakon uspješno održanih sastanaka, naše ćete prostore napustiti s vašim
        novim četveronožnim ljubimcem!
      </p>
      <div
        style={{
          width: "100%",
          display: "flex",
          flex: "1",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={happy_dog_01} style={{ width: "40%" }} />
      </div>
    </>
  );
};

const FriendText = () => {
  return (
    <>
      <h2>Kako postati prijatelj?</h2>
      <div style={{ borderBottom: "solid 1px black" }} />
      <p>
        Program "Budi mi prijatelj" osmišljen je za one koji kod kuće nemaju
        uvjete za držanje ljubimaca, a žele imati svog četveronožnog prijatelja!
      </p>
      <p>
        Nakon što se na našim stranicama odabrali s kojim od naših malih
        štićenika želite postati prijatelj, morate ispuniti formular s osobnim
        podacima kako bi naši volonter stupili s vama u kontakt.
      </p>
      <p>
        Naime, prije nego što vam povjerimo u ruke nekoga od naših štićenika,
        dogovaramo sastanak u našem prostoru da se uvjerimo u vaše kvalitetno
        ophođenje prema životinjama.
      </p>

      <p>
        Nakon uspješno održanog sastanaka, svoga prijatelja možete posjećivati
        bilo kojim danom tijekom radnog vremena Azila te s njime provoditi
        kvalitetno vrijeme!
      </p>
      <div
        style={{
          width: "100%",
          display: "flex",
          flex: "1",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={happy_dog_02} style={{ width: "40%" }} />
      </div>
    </>
  );
};

export default HomePage;
