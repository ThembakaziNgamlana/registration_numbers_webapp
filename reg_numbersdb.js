export default function registationDB(db) {

async function insertRegistrationNumber (registrationNumber, townid) {
  //const regPrefix = await db.any('SELECT reg_prefix FROM towns WHERE id= $1'
 // const  town = await db.oneOrNone('SELECT town_name=$1  FROM towns WHERE id = $2', [townName, townid])
return  await db.none('INSERT INTO registration_numbers (registration_number, town_id) VALUES ($1, $2)', [registrationNumber, townid])

}

async function getAllRegistrationNumbers() {
  try {
    // Your implementation to retrieve all registration numbers
    const registrationNumbers = await db.manyOrNone('SELECT registration_number FROM registration_numbers');
    return registrationNumbers;
  } catch (error) {
    // Handle any errors that occur during database query
    console.error('Error retrieving all registration numbers:', error);
    throw error;
  }
}


async function getAllTowns() {
  return await db.manyOrNone('SELECT registration_number FROM registration_numbers;');
}

async function getTownId(townName){
  return await db.oneOrNone('SELECT id FROM towns WHERE town_name =$1', [townName])
}

async function getRegByTown(townName){
return await db.manyOrNone('SELECT registration_number FROM registration_numbers JOIN towns ON registration_numbers.town_id = towns.id WHERE towns.town_name = $1', [townName])
}


async function doesRegNumExist(townName) {
  const result = await db.oneOrNone('SELECT registration_number FROM registration_numbers WHERE registration_number =$1', [townName]);
  return result;
}

async function refreshDatabase() {
  await db.none('DELETE FROM  registration_numbers');
}


return{
  //insertTown,
  insertRegistrationNumber,
  getAllTowns,
  refreshDatabase,
  getTownId,
 getRegByTown,
 doesRegNumExist,
 getAllRegistrationNumbers
}





  }