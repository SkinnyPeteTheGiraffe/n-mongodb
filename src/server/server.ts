import { Db } from 'mongodb';
import { MONGO_COLLECTION, MONGO_DEFAULT, MONGO_HOST } from './data/constants';
import { connect, isDatabaseReady } from './mongo';
import { count, destroy, find, insert, update } from './mongo/actions';
import { checkParameters, generateLogMessage } from './utils';
import LogLevel from './data/logLevel';

// Get Database connection info from ConVar
const host: string = GetConvar(MONGO_HOST, MONGO_DEFAULT);
const collection: string = GetConvar(MONGO_COLLECTION, MONGO_DEFAULT);

// Connect to database
const database: Db = connect(host, collection);

if (!database) {
  console.log(generateLogMessage(LogLevel.ERROR, 'Database return false, which indicates a error has occurred!'))
}
//
// Start: Export functions
//
exports('connected', () => isDatabaseReady(database));

exports('count', count(database));

exports('insert', () => insert(database));
exports('insertOne', (params, callback) => {
  if (checkParameters(params)) {
    params.documents = [params.document];
    params.document = null;
  }
  return insert(database)(params, callback);
});
exports('find', find(database));
exports('findOne', (params, callback) => {
  if (checkParameters(params)) params.limit = 1;
  return find(database)(params, callback);
});

exports('update', update(database));
exports('updateOne', (params, callback) => {
  return update(database)(params, callback, true);
});

exports('delete', destroy(database));
exports('deleteOne', (params, callback) => {
  return destroy(database)(params, callback, true);
});
//
// End: Export functions
//
