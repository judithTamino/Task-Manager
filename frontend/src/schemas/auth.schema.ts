import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter email'),
  password: Yup.string()
    .min(8, 'Password must be min 8 characters long')
    .required('Please enter password'),
});

export const signupSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter email'),
  password: Yup.string()
    .min(8, 'Password must be min 8 characters long')
    .required('Please enter password'),
  name: Yup.string().required('Please enter full name'),
});
