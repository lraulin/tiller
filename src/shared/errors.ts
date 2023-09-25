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
    this.name = "InitializationError";
  }
}
