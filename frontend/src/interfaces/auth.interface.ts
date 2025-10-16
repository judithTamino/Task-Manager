export interface IToken {
  id: string;
  role: string;
}

export interface ISignup {
  profilePic: string;
  name: string;
  email: string;
  password: string;
  adminInviteToken: string;
}
