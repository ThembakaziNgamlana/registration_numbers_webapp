export default function regNumApp() {
        const registrationNumbers =[];
        let selectedTown = "";
        let reg = [];
        let townName= '';
       


        function reset() {
          //registrationNumbers =[];
          selectedTown = "";
          reg ={};
          townName = '';
       }

        function addRegistration(registration) {
          if (isValidRegistration(registration)) {
            reg = registrationNumbers.push(registration);
        }
        
        }
        function getRegistrationsNumbers(){
        return reg
        }

       function townID(registration){
       
         if(registration.startsWith('CA')){
            townName = 'CapeTown';
         }
         else if(registration.startsWith('CJ')){
            townName = 'Paarl';
         }
         else if(registration.startsWith('CW')){
            townName = 'George';
         }
            return townName
       }

  

        function getValidationMessage(){
          if(registrationNumbers){
            return `Registration number added successfully.`;
          }
         else{
          return "Invalid registration number format. Please enter a valid registration number.";
        }

        
        }
        function getRegistrationsForTownAndPrefix(prefix) {
          return registrationNumbers.filter((reg) => reg.startsWith(selectedTown) && reg.startsWith(prefix));
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
          isValidRegistration,
          townID,
        // getRegistrations,
        getRegistrationsNumbers,
        getValidationMessage,
         getRegistrationsForTownAndPrefix,
          getRegistrationsForTown,
          setSelectedTown: (town) => {
            selectedTown = town;
          },
        };
        }
 



