import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useContext,
} from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';
import type { IUser } from '../interfaces/user.interface';
import { toast } from 'react-hot-toast';
import { isAxiosError } from 'axios';

interface IAuth {
  token: string | null;
  user: IUser | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuth | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER);
      setUser(response.data.user);
    } catch (error) {
      if (isAxiosError(error)) toast.error(error.response?.data.msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) return;

    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      setLoading(false);
      return;
    }

    fetchUser();
  }, []);

  const login = (accessToken: string) => {
    setToken(accessToken);
    localStorage.setItem('token', accessToken); // Save token
    setLoading(false);
    fetchUser();
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const values: IAuth = { user, token, loading, login, logout };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = (): IAuth => {
  const context = useContext(AuthContext) as IAuth;
  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
};

export default AuthProvider;
