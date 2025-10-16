import { useField, useFormikContext } from 'formik';
import React, { useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

interface ProfilePhotoSelectorProps {
  // image: any;
  // setImage: any;
  name: string;
}

const ProfilePhotoSelector: React.FC<ProfilePhotoSelectorProps> = ({
  name,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [field,, helpers] = useField(name);
  const { setFieldValue } = useFormikContext();

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // update Formik state
    setFieldValue(name, file);

    // generate preview URL from the file
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleRemoveImage = () => {
    //setImage(null);
    helpers.setValue(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className='flex justify-center mb-6'>
      <input
        type='file'
        accept='image/*'
        ref={inputRef}
        onChange={handleImage}
        className='hidden'
      />

      {!field.value ? (
        <div className='w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer'>
          <LuUser className='text-4xl text-primary' />
          <button
            type='button'
            onClick={onChooseFile}
            className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className='relative'>
          <img
            src={previewUrl ?? URL.createObjectURL(field.value)}
            alt='profile photo'
            className='w-20 h-20 rounded-full object-cover'
          />
          <button
            type='button'
            onClick={handleRemoveImage}
            className='w-8 h-8 flex items-center justify-center bg-red-500 rounded-full absolute -bottom-1 -right-1 cursor-pointer'
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
