export default function regNumApp() {
        const registrationNumbers =[];
        let selectedTown = "";
       // let reg = [];
       let errorMessage = '';
       let townName= '';
       
        function reset() {
          //registrationNumbers =[];
          registrationNumbers.length = 0;
          selectedTown = "";
         // reg ={};
          townName = '';
       }

       function registationsFormat(registrationNumber) {
        // Define a regular expression pattern for the desired format
        const regFormat = /^[A-Z]{2}\s\d{3}\s\d{3}$/;
      
        // Test if the registrationNumber matches the pattern
        if (regFormat.test(registrationNumber)) {
          // If it matches, transform the registrationNumber
          let transformed = registrationNumber.replace(/\s/g, ''); // Remove spaces
          transformed = transformed.toUpperCase(); // Convert to uppercase
          return transformed;
        } else {
          // If it doesn't match, return the original registrationNumber
          return registrationNumber;
        }
      }
      




        function addRegistration(registration) {
          if (errorMsg(registration)) {
            reg = registrationNumbers.push(registration);
        }
        
        }
        function getRegistrationsNumbers(){
        return registrationNumbers;
        }

      //  function townID(registration){
      //   let townName = '';
      //   if(registration){
      //     townName = 'Registration not entered';
      //   }
      //    else if(registration.startsWith('CA')){
      //       townName = 'CapeTown';
      //    }
      //    else if(registration.startsWith('CJ')){
      //       townName = 'Paarl';
      //    }
      //    else if(registration.startsWith('CW')){
      //       townName = 'George';
      //    }
        
      //      return townName
      //  }
     
      function townID(registration) {
        if (typeof registration === 'string') { // Check if registration is a string
          if (registration.startsWith('CA')) {
            townName = 'CapeTown';
          } else if (registration.startsWith('CJ')) {
            townName = 'Paarl';
          } else if (registration.startsWith('CW')) {
            townName = 'George';
          }
        } else {
          // Handle the case where registration is not a string
          townName = ''; // or set it to an appropriate default value
        }
        return townName;
      }
      

       function errorMsg(registration , townName) {
        if (registration === null ) {
          return 'Please enter your registration number' ;
        } else if (townName === null) {
          return'Town not selected' ;
        }
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
          registationsFormat
        };
        }
 



