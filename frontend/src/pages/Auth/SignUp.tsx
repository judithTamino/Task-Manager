import { useState, type FunctionComponent } from 'react';
import { Formik, Form } from 'formik';
import AuthLayout from '../../components/layouts/AuthLayout';
import { signupSchema } from '../../schemas/user.schema';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';

interface SignUpProps {}

const initialValues = {
  profilePic: null,
  fullName: '',
  email: '',
  password: '',
  adminInviteToken: '',
};

const SignUp: FunctionComponent<SignUpProps> = () => {
  const [profilePic, setProfilePic] = useState<any>(null);
  const handleSignup = () => {};
  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>

        <Formik initialValues={initialValues} validationSchema={signupSchema} onSubmit={handleSignup}>
          <Form>
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            </div>
          </Form>
        </Formik>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
