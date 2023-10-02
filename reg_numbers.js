export default function regNumApp() {
  const registrationNumbers = [];
  let selectedTown = "";
  let errorMessage = '';
  let townName = '';
  let successMessage = '';

  function reset() {
    registrationNumbers.length = 0;
    selectedTown = "";
    townName = '';
  }

  function registationsFormat(registrationNumber) {
    const regFormat = /^[A-Z]{2}\s\d{3}\s\d{3}$/;
    if (regFormat.test(registrationNumber)) {
      let transformed = registrationNumber.replace(/\s/g, '');
      transformed = transformed.toUpperCase();
      return transformed;
    } else {
      return registrationNumber;
    }
  }

  function addRegistration(registration) {
    if (errorMsg(registration)) {
      registrationNumbers.push(registration);

      setTimeout(() => {
        errorMessage = ''; // Clear the errorMessage
        successMessage = ''; // Clear the successMessage
      }, 3000);
    }
  }

  function getRegistrationsNumbers() {
    return registrationNumbers;
  }

  function townID(registration) {
    if (typeof registration === 'string') {
      if (registration.startsWith('CA')) {
        townName = 'CapeTown';
      } else if (registration.startsWith('CJ')) {
        townName = 'Paarl';
      } else if (registration.startsWith('CW')) {
        townName = 'George';
      }
    } else {
      townName = '';
    }
    return townName;
  }

  function errorMsg(registration, townName) {
    if (registration === null) {
      errorMessage = 'Please enter your registration number';
      return false;
    } else if (townName === null) {
      errorMessage = 'Town not selected';
      return false;
    }
    return true;
  }

  function getRegistrationsForTown() {
    return registrationNumbers.filter((reg) => reg.startsWith(selectedTown));
  }

  return {
    reset,
    addRegistration,
    townID,
    getRegistrationsNumbers,
    errorMsg,
    getRegistrationsForTown,
    registationsFormat,
   // errorMessage,
   // successMessage,
  };
}


