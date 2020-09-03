import { Db, MongoClient } from 'mongodb';
import { MONGO_COLLECTION, MONGO_DEFAULT, MONGO_HOST } from './data/constants';
import {  isDatabaseReady } from './mongo';
import { count, destroy, find, insert, update } from './mongo/actions';
import { checkParameters, generateLogMessage } from './utils';
import LogLevel from './data/logLevel';

// Get Database connection info from ConVar
const host: string = GetConvar(MONGO_HOST, MONGO_DEFAULT);
const collection: string = GetConvar(MONGO_COLLECTION, MONGO_DEFAULT);

// Connect to database
let database: Db;
if (host != 'default' && collection != 'default') {
  MongoClient.connect(host, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (err) return console.log(generateLogMessage(LogLevel.ERROR, err.message));
    database = client.db(collection);

    console.log(generateLogMessage(LogLevel.INFO, `Connected to database "${collection}".`));
    emit('onDatabaseConnect', collection);
  });
} else {
  if (host == 'default')
    console.log(generateLogMessage(LogLevel.ERROR, `Convar ${MONGO_HOST} not set (see README)`));
  if (collection == 'default')
    console.log(generateLogMessage(LogLevel.ERROR, `Convar ${MONGO_COLLECTION} not set (see README)`));
}

//
// Start: Export functions
//
global.exports('connected', () => isDatabaseReady(database));

global.exports('count', (params, callback) => count(database)(params, callback));

global.exports('insert', (params, callback) => insert(database)(params, callback));
global.exports('insertOne', (params, callback) => {
  if (checkParameters(params)) {
    params.documents = [params.document];
    params.document = null;
  }
  return insert(database)(params, callback);
});

global.exports('find', (params, callback) => find(database)(params, callback));
global.exports('findOne', (params, callback) => {
  if (checkParameters(params)) params.limit = 1;
  return find(database)(params, callback);
});

global.exports('update', (params, callback) => update(database)(params, callback, false));
global.exports('updateOne', (params, callback) => {
  return update(database)(params, callback, true);
});

global.exports('delete', (params, callback) => destroy(database)(params, callback, false));
global.exports('deleteOne', (params, callback) => {
  return destroy(database)(params, callback, true);
});
//
// End: Export functions
//
