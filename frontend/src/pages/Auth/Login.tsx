import { type FunctionComponent } from 'react';
import { Formik, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import { loginSchema } from '../../schemas/auth.schema';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { decodeJwtToken } from '../../utils/helper';
import { toast } from 'react-hot-toast';
import { isAxiosError } from 'axios';
import { useAuth } from '../../context/auth.context';

interface LoginProps {}

interface ILogin {
  email: string;
  password: string;
}

const initialValues = {
  email: '',
  password: '',
};

const Login: FunctionComponent<LoginProps> = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Handle Login Form Sumbit
  const handleLogin = async (values: ILogin) => {
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, values);
      const { token } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        login(token);

        const role = decodeJwtToken(token).role;
        if (role === 'admin') navigate('/admin/dashboard');
        else navigate('/user/dashboard');
      }
    } catch (error) {
      if (isAxiosError(error)) toast.error(error.response?.data.msg);
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your details to login
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({ dirty, isValid }) => (
            <Form>
              <Input
                label='Email Address'
                placeholder='johnDoe@email.com'
                type='text'
                name='email'
              />
              <Input
                label='Password'
                placeholder='Min 8 Characters'
                type='password'
                name='password'
              />

              <button
                type='submit'
                disabled={!dirty || !isValid}
                className='btn-primary'
              >
                LOGIN
              </button>

              <p className='text-[13px] text-slate-800 mt-3'>
                Don`t have an account?{' '}
                <Link
                  className='font-medium text-primary underline'
                  to='/signup'
                >
                  Signup
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
};

export default Login;
