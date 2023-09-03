// For when data that should have been filled by an init function is missing.
export class InitializationError extends Error {
  constructor(message) {
    super(message);
    this.name = "InitializationError";
  }
}

// For when the Google Sheets API returns successfully,
// but with missing or unexpected data; e.g. when
// the sheet's contents are not what the app assumes them to be.
export class SheetError extends Error {
  constructor(message) {
    super(message);
    this.name = "SheetError";
  }
}

// For when a function is missing an argument that has a default,
// but the default was only provided for type hinting and not meant
// to be used.
export function DefaultArgumentError(message = "") {
  const errorMessage =
    "The default argument was only for documentation and type inference! " +
    message;
  Error.call(this, errorMessage);
  this.name = "DefaultArgumentError";
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, DefaultArgumentError);
  }
}

DefaultArgumentError.prototype = Object.create(Error.prototype);
DefaultArgumentError.prototype.constructor = DefaultArgumentError;
