import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../css/picture.css';;
import PicturePagination from '../components/PicturePagination';
import NameForm from '../components/NameForm';

const Picture = ({data}) => {
  if (!data || data.length === 0) {
    return <div>No images available</div>;
  }
  const {picid} = useParams();
  const imageIndex = data.findIndex((img) => img.id === parseInt(picid, 10));
  const image = data[imageIndex];
  return (
    <>
      <Header />
      <div className="form-container">
        <div className="image-details">
          <h2>{image.title}</h2>
          <h3>{image.dates}</h3>
        </div>
        <img src={`${import.meta.env.VITE_API_URL}/image/${image.id}`}
          className="image-display"
          alt={image.title} />
        <div className="people-depicted">
          <p><b>People Depicted:</b> {image.people_depicted}</p>
        </div>
        <p><b>Add a name that is missing:</b></p>
        <NameForm picid = {picid}/>
        <PicturePagination data = {data} currentIndex = {imageIndex}/>
      </div>
    </>
  );
};

export default Picture;