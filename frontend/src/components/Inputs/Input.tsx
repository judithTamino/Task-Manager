import { useState, type FunctionComponent } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { useField } from 'formik';

interface InputProps {
  label: string;
  placeholder: string;
  type: string;
  name: string;
}

const Input: FunctionComponent<InputProps> = ({
  label,
  type,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [field, meta] = useField(props);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label htmlFor={props.name} className='text-[13px] text-slate-800'>
        {label}
      </label>
      <div className='input-box'>
        <input
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          {...field}
          {...props}
          className='w-full bg-transparent outline-none'
        />
        {type === 'password' && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className='text-primary cursor-pointer'
                onClick={() => toggleShowPassword()}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className='text-slate-400 cursor-pointer'
                onClick={() => toggleShowPassword()}
              />
            )}
          </>
        )}
      </div>
      {meta.touched && meta.error ? (
        <p className='text-red-500 text-xs pb-2.5'>{meta.error}</p>
      ) : null}
    </div>
  );
};

export default Input;
