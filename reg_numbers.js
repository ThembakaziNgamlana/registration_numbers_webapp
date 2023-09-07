export default function regNumApp() {
  const registrationNumbers = [];
  const validFormats = [/^[A-Z]{2}\s\d{3}\s\d{3}$/, /^\d{3}-\d{3}$/]; // Define valid registration number formats

  function addRegistrationNumber(number, town) {
    // Validate the registration number format
    const validFormat = validFormats.some(format => format.test(number));
    if (!validFormat) {
      return { success: false, message: 'Invalid registration number format.' };
    }

    // Check for duplicates
    const isDuplicate = registrationNumbers.some(item => item.number === number);
    if (isDuplicate) {
      return { success: false, message: 'Duplicate registration number.' };
    }

    registrationNumbers.push({ number, town });
    return { success: true, message: 'Registration number added successfully.' };
  }

  function filterRegistrationNumbers(selectedTown) {
    return registrationNumbers.filter(item => item.town === selectedTown);
  }

  function getAllRegistrationNumbers() {
    return registrationNumbers;
  }

  function resetRegistrationNumbers() {
    registrationNumbers.length = 0;
  }

  return {
    addRegistrationNumber,
    filterRegistrationNumbers,
    getAllRegistrationNumbers,
    resetRegistrationNumbers,
  };
}


