export interface User {
    id: number;

  fullName: string;

  email: string;

  role: 'ADMIN' | 'USER';

  facebookConnected: boolean;
}
