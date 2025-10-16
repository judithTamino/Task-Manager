import { Formik, Form } from 'formik';
import AuthLayout from '../../components/layouts/AuthLayout';
import { signupSchema } from '../../schemas/auth.schema';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/Inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import type { ISignup } from '../../interfaces/auth.interface';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

interface SignUpProps {}

const initialValues = {
  profilePic: '',
  name: '',
  email: '',
  password: '',
  adminInviteToken: '',
};

const SignUp: React.FC<SignUpProps> = () => {
const navigate = useNavigate();

  const handleSignup = async (values: ISignup) => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.REGISTER, values);
      navigate('/login');
    } catch (error) {
      if (isAxiosError(error)) toast.error(error.response?.data.msg);
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={signupSchema}
          onSubmit={handleSignup}
        >
          {({ dirty, isValid }) => (
            <Form>
              <ProfilePhotoSelector name='profilePic' />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input
                  label='Full Name'
                  placeholder='Judith Tamino'
                  type='text'
                  name='name'
                />

                <Input
                  label='Email Address'
                  placeholder='judith@email.com'
                  type='text'
                  name='email'
                />

                <Input
                  label='Password'
                  placeholder='Min 8 Characters'
                  type='password'
                  name='password'
                />

                <Input
                  label='Admin Invite Token'
                  placeholder='6 Digit Code'
                  type='text'
                  name='adminInviteToken'
                />
              </div>

              <button
                type='submit'
                disabled={!dirty || !isValid}
                className='btn-primary'
              >
                SIGN UP
              </button>

              <p className='text-[13px] text-slate-800 mt-3 mb-2'>
                Already have an account?
                <Link
                  className='font-medium text-primary underline'
                  to='/login'
                >
                  Login
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
