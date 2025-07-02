import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter the email'),
  password: Yup.string().required('Please enter the password'),
});

export const signupSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter the email'),
  password: Yup.string().required('Please enter the password'),
  fullName: Yup.string().required('Please enter full name'),
});
