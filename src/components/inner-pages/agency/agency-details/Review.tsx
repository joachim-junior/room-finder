import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Review = ({ style, reviewlist = [], total_review = 0 }: any) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const maxReviewsToShow = 2;
  const displayedReviews = showAllReviews
    ? reviewlist
    : reviewlist.slice(0, maxReviewsToShow);

  if (!reviewlist || reviewlist.length === 0) {
    return <div className="review-wrapper mb-35">No reviews yet.</div>;
  }

  return (
    <>
      <div className="review-wrapper mb-35">
        {displayedReviews.map((item: any, idx: number) => (
          <div key={idx} className="review">
            <img
              src={
                item.user_img?.startsWith("http")
                  ? item.user_img
                  : `https://cpanel.roomfinder237.com/${item.user_img}`
              }
              alt="User"
              className="rounded-circle avatar"
              width={50}
              height={50}
              style={{ objectFit: "cover" }}
            />
            <div className="text">
              <div className="d-sm-flex justify-content-between">
                <div>
                  <h6 className="name">{item.user_title}</h6>
                </div>
                <ul className="rating style-none d-flex xs-mt-10">
                  <li>
                    <span className="fst-italic me-2">
                      ({item.user_rate} Rating)
                    </span>
                  </li>
                  {[...Array(Math.round(item.user_rate || 0))].map((_, i) => (
                    <li key={i}>
                      <i className="fa-sharp fa-solid fa-star"></i>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="fs-20 mt-20 mb-30">{item.user_desc}</p>
              <div className="d-flex review-help-btn">
                <Link href="#" className="me-5">
                  <i className="fa-sharp fa-regular fa-thumbs-up"></i>
                  <span>Helpful</span>
                </Link>
                <Link href="#">
                  <i className="fa-sharp fa-regular fa-flag-swallowtail"></i>
                  <span>Flag</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {reviewlist.length > maxReviewsToShow && (
        <div
          className={`load-more-review text-uppercase w-100 tran3s ${
            style ? "border-15 tran3s" : "fw-500 inverse rounded-0"
          }`}
          onClick={() => setShowAllReviews(!showAllReviews)}
        >
          {showAllReviews ? "SHOW LESS" : "VIEW ALL REVIEWS"}{" "}
          <i
            className={`bi bi-arrow-${showAllReviews ? "down" : "up"}-right`}
          ></i>
        </div>
      )}
    </>
  );
};

export default Review;
