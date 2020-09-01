import { Collection, Db } from 'mongodb';
import { generateLogMessage } from '../utils';
import LogLevel from '../data/logLevel';

/**
 * Checks database connection, returning true if connected otherwise false.
 *
 * @param database the reference to check if connected
 */
export const isDatabaseReady: (database: Db) => boolean = database => {
  if (!database) {
    console.log(generateLogMessage(LogLevel.ERROR, 'Database is not connected.'));
    return false;
  }
  return true;
};

/**
 * Retrieves the collection from the given parameters object, otherwise false.
 *
 * @param database the reference to retrieve the collection from
 * @param parameters the parameters used to retrieve the collection
 */
export const getParametersCollection: (database: Db, parameters: any) => Collection | false = (
  database,
  parameters,
) => {
  if (!parameters.collection) return false;
  return database.collection(parameters.collection);
};
