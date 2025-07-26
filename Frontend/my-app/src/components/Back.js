
import { useNavigate } from 'react-router-dom';

import { BsArrowLeft } from 'react-icons/bs';

const BackButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <button onClick={handleClick}> <BsArrowLeft size={16} /></button>
  );
};

export default BackButton;