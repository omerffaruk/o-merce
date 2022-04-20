import React from "react";

function Rating(props) {
  const { rating, numReviews, caption } = props;
  return (
    <div className="rating">
      <span>
        <i
          className={
            rating >= 0.75
              ? "fas fa-star"
              : rating >= 0.25
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>
      <span>
        <i
          className={
            rating >= 1.75
              ? "fas fa-star"
              : rating >= 1.25
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>
      <span>
        <i
          className={
            rating >= 2.75
              ? "fas fa-star"
              : rating >= 2.25
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>
      <span>
        <i
          className={
            rating >= 3.75
              ? "fas fa-star"
              : rating >= 3.25
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>
      <span>
        <i
          className={
            rating >= 4.75
              ? "fas fa-star"
              : rating >= 4.25
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>
      {caption ? (
        <span>{caption}</span>
      ) : (
        <span>{" " + numReviews + " reviews"}</span>
      )}
    </div>
  );
}

export default Rating;
