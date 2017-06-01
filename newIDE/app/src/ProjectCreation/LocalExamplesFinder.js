// @flow

import optionalRequire from '../Utils/OptionalRequire.js';
import path from 'path';
const electron = optionalRequire('electron');
const app = electron ? electron.remote.app : null;
const fs = optionalRequire('fs');
const process = optionalRequire('process');

const tryPath = (
  path: string,
  onExists: (string) => void,
  onNoAccess: Function
) =>
  fs.access(path, fs.constants.R_OK, err => {
    if (!err) onExists(path);
    else onNoAccess();
  });

export const findExamples = (cb: (?string) => void) => {
  if (!process || !fs) return '';

  const appPath = app ? app.getAppPath() : process.cwd();

  // First try to find examples in app resources folder
  tryPath(path.join(appPath, '..', 'examples'), cb, () => {
    tryPath(
      path.join(appPath, '..', '..', 'app', 'resources', 'examples'),
      cb,
      () => {
        cb(null);
      }
    );
  });
};
