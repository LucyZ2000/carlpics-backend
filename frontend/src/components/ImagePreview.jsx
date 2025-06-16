import '../css/imagepreview.css';

const ImagePreview = (props) => {
  return (
    <div className="poster">
      <img
        src={props.link}
        className="card-img-top"
        alt="Set Image"
      />
      <div className="setdescription">
        <p>{props.title}</p>
        <p>{props.years}</p>
      </div>
    </div>
  );
};

export default ImagePreview;
