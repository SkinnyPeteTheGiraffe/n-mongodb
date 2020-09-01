import { ObjectID } from 'mongodb';
import Immediate = NodeJS.Immediate;

export const exportDocument: (document: any) => any = document => {
  if (!document) return;
  if (document._id && typeof document._id !== 'string') {
    document._id = document._id.toString();
  }
  return document;
};

export const exportDocuments: (any) => any = documents => {
  if (!Array.isArray(documents)) return;
  return documents.map(document => exportDocument(document));
};

export const safeObjectArgument: (object: any) => any = object => {
  if (!object) return {};
  if (Array.isArray(object)) {
    return object.reduce((acc, value, index) => {
      acc[index] = value;
      return acc;
    }, {});
  }
  if (typeof object !== 'object') return {};
  if (object._id) object._id = new ObjectID(object._id);
  return object;
};

export const safeCallback: (cb: (any) => any, args: any) => Immediate | false = (cb, ...args) => {
  if (typeof cb === "function") return setImmediate(() => cb(...args));
  else return false;
};
