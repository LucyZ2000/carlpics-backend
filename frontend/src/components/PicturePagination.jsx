import {useNavigate } from 'react-router-dom';
import '../css/picturepagination.css';

const PicturePagination = ({data, currentIndex}) => {
  const totalPics = data.length;
  const navigate = useNavigate();
  currentIndex = parseInt(currentIndex, 10);
  const goToPic = (newPicId) => {
    navigate(`/${newPicId}`);
  };

  return (
    <div className="pagination-container">
      <button
        onClick={() => goToPic(data[currentIndex - 1].id)}
        disabled={currentIndex === 0}
        className="pagination-button"
      >
        Previous
      </button>
      <span className="pagination-info">
        Pic {currentIndex + 1} of {totalPics}
      </span>
      <button
        onClick={() => goToPic(data[currentIndex + 1].id)}
        disabled={currentIndex === totalPics - 1}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
};

export default PicturePagination;
