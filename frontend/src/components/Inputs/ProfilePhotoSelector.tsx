import { useRef, useState, type FunctionComponent } from 'react';

interface ProfilePhotoSelectorProps {
  image: any;
  setImage: any;
}

const ProfilePhotoSelector: FunctionComponent<ProfilePhotoSelectorProps> = ({
  image,
  setImage,
}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState<any>(null);

  const handleImage = (event) => {
    const file = event.target.files[0];
    if (file)
      // update the image state
      setImage(file);

    // generate preview URL from the file
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };
  return <></>;
};

export default ProfilePhotoSelector;
