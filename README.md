# Dog Shelter Demo App

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)

# Mate Krezić / Sveučilište u Zadru
## Završni rad
###  Full stack web aplikacija namijenjena azilima za napuštene pse na primjeru Zadarskog azila 

  - Aplikacija nije spremna za produkciju
  - Aplikacija je izrađena u svrhu završnog rada na preddiplomskom stručnom studiju Informacijske tehnologije


#### Kako koristiti?

   - Dog Shelter Demo App zahtjeva [Node.js](https://nodejs.org/).
   - Potrebno je istovremeno pokrenuti klijentski i serverski dio aplikacije u zasebnim terminalima
   - Napomena: Ovo može potrajati po nekoliko minuta!

```sh
$ cd client
$ npm install
$ npm run dev
```

```sh
$ cd server
$ npm install
$ npm run dev
```

Aplikacija se potom pokreće na URL http://localhost:7777/

- Za pregled aplikacije iz perspektive registriranog korisnika, dovoljno je izraditi korisnički račun s proizvoljnim podacima
- Za pregled aplikacije iz perspektive administratora potrebno se prijaviti sa sljedećim podacima: email: demo@admin.net // password: d123

### Korištene Tehnologije
#### Front end
* [ReactJS](https://reactjs.org/): Javascript library za izgradnju korisničkih sučelja i UI komponenti
* [NextJS](https://nextjs.org/): Reactov framework koji posjeduje intuitivni sustav usmjeravanja s podrškom za dinamičke rute.
* [React-Apollo](https://github.com/apollographql/react-apollo): Omogućuje dohvaćanje podataka s GraphQL poslužitelja te manipulaciju podataka s istog.
* [Apollo-Client](https://www.apollographql.com/docs/react/api/core/ApolloClient/): Sveobuhvatan library za upravljanje stanjem u JavaScriptu, a koji omogućuje upravljanje lokalnim i udaljenim podacima s GraphQL-om.
* [Styled-Components](https://www.styled-components.com/): Koristeći tagged template literale i CSS, Styled-Components omogućuje pisanje stvarnog CSS koda za oblikovanje React komponenata.
* [React Modal](https://www.npmjs.com/package/react-modal): Library koji omogućuje brzu i jednostavnu izradu modala (skočnih komponenti).

#### Back end

* [Node.js](https://nodejs.org/): Runtime okruženje koje izvršava računalni kod pisan u jeziku Javascript.  
* [GraphQL Yoga](https://www.npmjs.com/package/graphql-yoga): U potpunosti opremljeni HTTP GraphQL poslužitelj s fokusom na jednostavno postavljanje i poboljšane performanse.
* [Prisma.io](https://www.prisma.io/): Open-source paket alata za upravljanje bazom podataka. Zamjenjuje tradicionalne ORM-ove.

#### Upitni jezik

* [GraphQL](https://graphql.org/): Open-source jezik za dohvaćanje i manipulaciju podacima. Nudi alternativu standardnoj REST arhitekturi API-ja.

Završna napomena: .env datoteke uključene su u ovaj repozitorij kako bi osigurale rad aplikacije u razvojnom okruženju. Prelaskom u produkcijsku fazu, potrebno ih je eliminirati.
