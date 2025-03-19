
// This file is kept for backward compatibility
// All functionality has been moved to specialized modules

import { 
  signIn, 
  signUp, 
  signOut 
} from './authService';

import { 
  getSession 
} from './sessionManager';

import { 
  resetUserPassword 
} from './passwordService';

import { 
  validateRole 
} from './utils';

// Re-export all functionality
export {
  signIn,
  signUp,
  signOut,
  getSession,
  resetUserPassword,
  validateRole
};
