export interface User {
  _id: string;
  _type: 'user';
  displayName: string;
  emailAddress: string;
  country: string;
  region: string;
  // Optional fields from Azure AD
  upn?: string;
  og?: string;
  mailNickName?: string;
  mailboxType?: string;
  department?: string;
  title?: string;
} 