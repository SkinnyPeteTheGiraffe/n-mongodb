import LogLevel from './data/logLevel';

export const checkParameters: (params: any) => boolean = (params) => typeof params === 'object';

export const generateLogMessage: (level: LogLevel, message: string) => string = (level = LogLevel.INFO, message) => `[MongoDB][${level}]: ${message}`;
