/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { getParametersCollection, isDatabaseReady } from './index';
import { Db } from 'mongodb';
import { exportDocuments, safeCallback, safeObjectArgument } from './utils';
import { checkParameters, generateLogMessage } from '../utils';
import LogLevel from '../data/logLevel';

export const find = (database: Db) => (params: any, callback: () => void): void => {
  if (!isDatabaseReady(database)) return;
  if (!checkParameters(params))
    return console.log(generateLogMessage(LogLevel.ERROR, `exports.find: Invalid params object.`));

  const collection = getParametersCollection(database, params);
  if (!collection)
    return console.log(
      generateLogMessage(
        LogLevel.ERROR,
        `exports.insert: Invalid collection "${params.collection}"`,
      ),
    );

  const query = safeObjectArgument(params.query);
  const options = safeObjectArgument(params.options);

  let cursor = collection.find(query, options);
  if (params.limit) cursor = cursor.limit(params.limit);
  cursor.toArray((err, documents) => {
    if (err) {
      console.log(generateLogMessage(LogLevel.ERROR, `exports.find: Error "${err.message}".`));
      safeCallback(callback, false, err.message);
      return;
    }
    safeCallback(callback, true, exportDocuments(documents));
  });
};

export const insert = (database: Db) => (params: any, callback: (any) => void): void => {
  if (!isDatabaseReady(database)) return;
  if (!checkParameters(params))
    return console.log(
      generateLogMessage(LogLevel.ERROR, `exports.insert: Invalid params object.`),
    );

  const collection = getParametersCollection(database, params);
  if (!collection)
    return console.log(
      generateLogMessage(
        LogLevel.ERROR,
        `exports.insert: Invalid collection "${params.collection}"`,
      ),
    );

  const documents = params.documents;
  if (!documents || !Array.isArray(documents))
    return console.log(
      generateLogMessage(
        LogLevel.ERROR,
        `exports.insert: Invalid 'params.documents' value. Expected object or array of objects.`,
      ),
    );

  const options = safeObjectArgument(params.options);

  collection.insertMany(documents, options, (err, result) => {
    if (err) {
      console.log(generateLogMessage(LogLevel.ERROR, err.message));
      safeCallback(callback, false, err.message);
      return;
    }
    const arrayOfIds = [];
    // Convert object to an array
    for (const key in result.insertedIds) {
      if (Object.prototype.isPrototypeOf.call(result.insertedIds, key)) {
        arrayOfIds[parseInt(key)] = result.insertedIds[key].toString();
      }
    }
    safeCallback(callback, true, result.insertedCount, arrayOfIds);
  });
};

export const update = (database: Db) => (
  params: any,
  callback: (any) => void,
  isUpdateOne: boolean,
): void => {
  if (!isDatabaseReady(database)) return;
  if (!checkParameters(params))
    return console.log(
      generateLogMessage(LogLevel.ERROR, 'exports.update: Invalid params object.'),
    );

  const collection = getParametersCollection(database, params);
  if (!collection)
    return console.log(
      generateLogMessage(
        LogLevel.ERROR,
        `exports.insert: Invalid collection "${params.collection}"`,
      ),
    );

  const query = safeObjectArgument(params.query);
  const update = safeObjectArgument(params.update);
  const options = safeObjectArgument(params.options);

  const cb = (err, res) => {
    if (err) {
      console.log(generateLogMessage(LogLevel.ERROR, `exports.update: Error "${err.message}".`));
      safeCallback(callback, false, err.message);
      return;
    }
    safeCallback(callback, true, res.result.nModified);
  };
  isUpdateOne
    ? collection.updateOne(query, update, options, cb)
    : collection.updateMany(query, update, options, cb);
};

export const count = (database: Db) => (params: any, callback: (any) => void) => {
  if (!isDatabaseReady(database)) return;
  if (!checkParameters(params))
    return console.log(generateLogMessage(LogLevel.ERROR, `exports.count: Invalid params object.`));

  const collection = getParametersCollection(database, params);
  if (!collection)
    return console.log(
      generateLogMessage(
        LogLevel.ERROR,
        `exports.insert: Invalid collection "${params.collection}"`,
      ),
    );

  const query = safeObjectArgument(params.query);
  const options = safeObjectArgument(params.options);

  collection.countDocuments(query, options, (err, count) => {
    if (err) {
      console.log(generateLogMessage(LogLevel.ERROR, `exports.count: Error "${err.message}".`));
      safeCallback(callback, false, err.message);
      return;
    }
    safeCallback(callback, true, count);
  });
};

export const destroy = (database: Db) => (params: any, callback: (any) => void, isDeleteOne: boolean) => {
  if (!isDatabaseReady(database)) return;
  if (!checkParameters(params))
    return console.log(
      generateLogMessage(LogLevel.ERROR, `exports.delete: Invalid params object.`),
    );

  const collection = getParametersCollection(database, params);
  if (!collection)
    return console.log(
      generateLogMessage(
        LogLevel.ERROR,
        `exports.insert: Invalid collection "${params.collection}"`,
      ),
    );

  const query = safeObjectArgument(params.query);
  const options = safeObjectArgument(params.options);

  const cb = (err, res) => {
    if (err) {
      console.log(LogLevel.ERROR, `exports.delete: Error "${err.message}".`);
      safeCallback(callback, false, err.message);
      return;
    }
    safeCallback(callback, true, res.result.n);
  };
  isDeleteOne
    ? collection.deleteOne(query, options, cb)
    : collection.deleteMany(query, options, cb);
};
