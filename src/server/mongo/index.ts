import { Collection, Db, MongoClient } from 'mongodb';
import { MONGO_COLLECTION, MONGO_HOST } from '../data/constants';
import { generateLogMessage } from '../utils';
import LogLevel from '../data/logLevel';

/**
 * Attempts to connect to a database with the given parameters. If the connection fails
 * will return false instead of {@link Db} reference.
 *
 * @param host the string containing the host used to connect to the mongo database
 * @param collection the string containing the collection to use within the database
 */
export const connect: (host: string, collection: string) => Db = (host, collection) => {
  let database: Db;
  if (host != 'default' && collection != 'default') {
    MongoClient.connect(host, { useNewUrlParser: true }, function (err, client) {
      if (err) return console.log(generateLogMessage(LogLevel.ERROR, err.message));
      database = client.db(collection);

      console.log(generateLogMessage(LogLevel.INFO, `Connected to database "${collection}".`));
      emit('onDatabaseConnect', collection);
    });
  } else {
    if (host == 'default')
      console.log(generateLogMessage(LogLevel.ERROR, ` Convar ${MONGO_HOST} not set (see README)`));
    if (collection == 'default')
      console.log(generateLogMessage(LogLevel.ERROR, `Convar ${MONGO_COLLECTION} not set (see README)`));
  }
  return database;
};

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
