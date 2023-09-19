export const PENDING_DESCRIPTION_PREFIX = "[PENDING] ";

export type Institution = "PenFed" | "Comerica" | "Capital One" | "Unknown";

// Data to enter in Tiller Transactions sheet for Direct Express transactions
export const DIRECT_EXPRESS = Object.freeze({
  ACCOUNT_NAME: "Direct Express",
  ACCOUNT_NUMBER: "xxxx0947",
  INSTITUTION: "Comerica",
});

export const BACKUP_POSTFIX = "Backup";
