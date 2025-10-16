import { jwtDecode } from 'jwt-decode';
import type { IToken } from '../interfaces/auth.interface';


// Decode jwt token
export const decodeJwtToken = (token: string) : IToken => jwtDecode(token);