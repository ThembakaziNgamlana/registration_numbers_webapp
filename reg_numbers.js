export default function regNumApp() {
 // regNumApp.js

const registrationNumbers = [];
let selectedTown = "";

function reset() {
  registrationNumbers.length = 0;
  selectedTown = "";
}

function addRegistration(registration) {
  if (isValidRegistration(registration)) {
    registrationNumbers.push(registration);
  }
}

function isValidRegistration(registration) {
  const pattern = /^[A-Z]{2}\s\d{3}\s\d{3}$/;
  return pattern.test(registration);
}

function getRegistrationsForTown() {
  return registrationNumbers.filter((reg) => reg.startsWith(selectedTown));
}

return {
  reset,
  addRegistration,
  getRegistrationsForTown,
  setSelectedTown: (town) => {
    selectedTown = town;
  },
};
 

}

