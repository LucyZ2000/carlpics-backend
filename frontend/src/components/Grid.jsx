import ImagePreview from "./ImagePreview.jsx";
import "../css/grid.css";

function setClick(imageId) {
  window.location.href = `/${imageId}`;
}

const Grid = ({ images }) => {
  if (!images || images.length === 0) {
    return <div>No images available</div>;
  }

  return (
    <>
    <div className="grid-wrapper">
      <h1 className="page-title">Select an Image to Begin</h1>
      <div className="grid">
        {images.map((image) => (
          <div
            className="image-container"
            key={image.id}
            onClick={() => setClick(image.id)}
          >
            <ImagePreview
              title={image.title}
              years={image.dates}
              pictures={image.people_depicted}
              link={`https://carlpics-backend.onrender.com/image/${image.id}`}
            />
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Grid;
