import { GraphQLError } from 'graphql'

type ObjectValues<T> = T[keyof T]

export const ErrorCode = {
  MAINENANCE_MODE: 'MAINENANCE_MODE',
  // Account Errors
  UNINITIALIZED_OR_DELETED: 'UNINITIALIZED_OR_DELETED',
  LOGGED_OUT: 'LOGGED_OUT',
  VERIFY_FAILED: 'VERIFY_FAILED',
  INVALID_SC_NAME: 'INVALID_SC_NAME',
  INVALID_SHIP_CODE: 'INVALID_SHIP_CODE',
  SC_NAME_TAKEN: 'SC_NAME_TAKEN',
  NOT_FOUND: 'NOT_FOUND',
  // Session Errors
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  SESSION_NO_READ: 'SESSION_NO_READ',
  SESSION_NO_WRITE: 'SESSION_NO_WRITE',
  SESSION_NOT_A_MEMBER: 'SESSION_NOT_A_MEMBER',
  SESSION_NOT_ACTIVE: 'SESSION_NOT_ACTIVE',
  SESSIONJOIN_NOT_ON_LIST: 'SESSIONJOIN_NOT_ON_LIST',
  SESSIONJOIN_NOT_VERIFIED: 'SESSIONJOIN_NOT_VERIFIED',
  SESSION_USER_INPUT_ERROR: 'SESSION_USER_INPUT_ERROR',
  // Work order Errors
  WORKORDER_NO_READ: 'WORKORDER_NO_READ',
  WORKORDER_NO_WRITE: 'WORKORDER_NO_WRITE',
  // Scouting find Errors
  SCOUTING_FIND_NO_READ: 'SCOUTING_FIND_NO_READ',
  SCOUTING_FIND_NO_WRITE: 'SCOUTING_FIND_NO_WRITE',
  // General Object Errors
  NOTE_TOO_LONG: 'NOTE_TOO_LONG',
  // General Errors
  SERVER_ERROR: 'SERVER_ERROR',
  // Plan Error
  PLAN_ERROR: 'PLAN_ERROR',
  // Invalid scouting prospector leaderboard name
  INVALID_SURVEYOR_NAME: 'INVALID_SURVEYOR_NAME',
  SURVEYOR_NOT_VERIFIED: 'SURVEYOR_NOT_VERIFIED',
} as const
export type ErrorCode = ObjectValues<typeof ErrorCode>

export const ErrorCodeMessages: Record<ErrorCode, string> = {
  MAINENANCE_MODE: 'Down for maintenance',
  NOT_FOUND: 'Not found',
  // Account Errors
  UNINITIALIZED_OR_DELETED: 'Uninitialized or deleted User',
  LOGGED_OUT: 'You are logged out',
  VERIFY_FAILED: 'Verification failed',
  INVALID_SC_NAME: 'Invalid Star Citizen username',
  INVALID_SHIP_CODE: 'Invalid ship code',
  SC_NAME_TAKEN: 'Star Citizen username is already taken',
  // Session Errors
  SESSION_NOT_FOUND: 'Session not found',
  SESSION_NO_READ: 'You do not have read access to this Session',
  SESSION_NO_WRITE: 'You do not have write access to this Session',
  SESSION_NOT_A_MEMBER: 'You are not a member of this Session',
  SESSION_NOT_ACTIVE: 'Session is not active',
  SESSION_USER_INPUT_ERROR: 'Session user input error',

  SESSIONJOIN_NOT_ON_LIST: 'This session requires you to be mentioned to join',
  SESSIONJOIN_NOT_VERIFIED: 'This session requires only verified users and you are not verified',
  // Work order Errors
  WORKORDER_NO_READ: 'You do not have read access to this Work Order',
  WORKORDER_NO_WRITE: 'You do not have write access to this Work Order',
  // Scouting find Errors
  SCOUTING_FIND_NO_READ: 'You do not have read access to this Scouting Find',
  SCOUTING_FIND_NO_WRITE: 'You do not have write access to this Scouting Find',
  // General Object Errors
  NOTE_TOO_LONG: 'Note is too long',
  // General Errors
  SERVER_ERROR: 'Server error',
  // Plan Error
  PLAN_ERROR: 'Plan error. You are not authorized to perform this action with your current plan.',
  INVALID_SURVEYOR_NAME: 'Invalid Prospector Leaderboard Name',
  SURVEYOR_NOT_VERIFIED: 'Must be verified to be a surveyor',
}

export const APIError = (code: ErrorCode, msg?: string) => {
  return new GraphQLError(msg || ErrorCodeMessages[code], {
    extensions: { code },
  })
}
