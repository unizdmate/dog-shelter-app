//funkcija koja provjerava postoji li presjek dopuštenja koje korisnik ima i dopuštenja koja mora imati za pristup određenom sadržaju

function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter((permissionTheyHave) =>
    // provjera da li je array s dopuštenjima sadržan u arrayu s potrebnim dopuštnjeima
    permissionsNeeded.includes(permissionTheyHave)
  );
  if (!matchedPermissions.length) {
    //Ako nema podudatanja => nema potrebnu razinu dopuštenja => error
    throw new Error("Nemate potrebno dopuštenje");
  }
}

exports.hasPermission = hasPermission;
