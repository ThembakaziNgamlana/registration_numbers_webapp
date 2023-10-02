import { strict as assert } from 'assert';
import pgPromise from 'pg-promise';
import registrationDB from '../reg_numbersdb.js'; // Adjust the path as needed

const pgp = pgPromise();


const connectionString = 'postgres://otsqntws:PMjDMvfDxKFBm-fOWGQNRC3CPqlIMiHa@dumbo.db.elephantsql.com/otsqntws?ssl=true';

const db = pgp(connectionString);
const registrationDBInstance = registrationDB(db);

describe('RegistrationDB Functions', function () {
  this.slow(3000);
  this.timeout(5000); // Set a timeout for the entire test suite

  beforeEach(async function () {
    // Clean the 'registration_numbers' table before each test run
    await db.none('DELETE FROM registration_numbers;');
  });

  describe('insertRegistrationNumber', () => {
    it('should insert a registration number into the database', async () => {
      const result = await registrationDBInstance.insertRegistrationNumber('ABC 123', 1);
      assert.strictEqual(result, null); // Assuming db.none() returns null on success
    });
  });

  describe('getAllTowns', () => {
    it('should retrieve all registration numbers from the database', async () => {
      // Insert test data first
      await registrationDBInstance.insertRegistrationNumber('ABC 123', 1);
      const registrationNumbers = await registrationDBInstance.getAllTowns();
      assert(Array.isArray(registrationNumbers));
      assert.strictEqual(registrationNumbers.length, 1);
      assert.strictEqual(registrationNumbers[0].registration_number, 'ABC 123');
    });
  });

  describe('getTownId', () => {
    it('should retrieve the town ID by town name', async () => {
      // Insert test data first
      await registrationDBInstance.insertRegistrationNumber('DEF 456', 2);
      const townId = await registrationDBInstance.getTownId('TownName'); // Replace with a valid town name
      assert.strictEqual(townId, null); // Assuming town doesn't exist
    });
  });

  describe('getRegByTown', () => {
    it('should retrieve registration numbers by town name', async () => {
      // Insert test data first
      await registrationDBInstance.insertRegistrationNumber('XYZ 789', 3);
      const registrationNumbers = await registrationDBInstance.getRegByTown('TownName'); // Replace with a valid town name
      assert(Array.isArray(registrationNumbers));
      assert.strictEqual(registrationNumbers.length, 0); // Assuming no matching town
    });
  });

  
  after(function () {
    db.$pool.end();
  });
});

