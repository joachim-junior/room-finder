import Image from "next/image";
import Link from "next/link";

interface ReviewData {
  id: number;
  property_title: string;
  property_image: string;
  booking_date: string;
  check_in: string;
  check_out: string;
  total_rate: number;
  rate_text: string;
  is_rated: boolean;
  book_status: string;
  property_price: number;
  total_amount: number;
  customer_name: string;
  customer_mobile: string;
}

interface UserReviewProps {
  reviews: ReviewData[];
}

const UserReview = ({ reviews }: UserReviewProps) => {
  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <li key={i}>
          <i
            className={`fa-sharp fa-solid fa-star ${
              i <= rating ? "text-warning" : "text-muted"
            }`}
          ></i>
        </li>
      );
    }
    return stars;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      {reviews.map((review) => (
        <div key={review.id} className="review">
          <div className="avatar-placeholder rounded-circle d-flex align-items-center justify-content-center bg-primary text-white fw-bold">
            {review.customer_name.charAt(0).toUpperCase()}
          </div>
          <div className="text">
            <div className="d-sm-flex justify-content-between">
              <div>
                <h6 className="name">{review.customer_name}</h6>
                <div className="time fs-16">
                  {formatDate(review.booking_date)}
                </div>
                <div className="property-info mt-2">
                  <small className="text-muted">
                    <strong>Property:</strong> {review.property_title}
                  </small>
                  <br />
                  <small className="text-muted">
                    <strong>Stay:</strong> {formatDate(review.check_in)} -{" "}
                    {formatDate(review.check_out)}
                  </small>
                </div>
              </div>
              <ul className="rating style-none d-flex xs-mt-10">
                <li>
                  <span className="fst-italic me-2">
                    ({review.total_rate.toFixed(1)} Rating)
                  </span>
                </li>
                {renderStars(review.total_rate)}
              </ul>
            </div>
            <p className="fs-20 mt-20 mb-30">{review.rate_text}</p>

            <div className="booking-details mb-20 p-3 bg-light rounded">
              <div className="row">
                <div className="col-md-6">
                  <small className="text-muted">
                    <strong>Booking Status:</strong> {review.book_status}
                  </small>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">
                    <strong>Total Amount:</strong>{" "}
                    {review.total_amount.toLocaleString()} XAF
                  </small>
                </div>
              </div>
            </div>

            <div className="d-flex review-help-btn">
              <Link href="#" className="me-5">
                <i className="fa-sharp fa-regular fa-thumbs-up"></i>
                <span>Helpful</span>
              </Link>
              <Link href="#" className="me-5">
                <i className="fa-sharp fa-regular fa-flag-swallowtail"></i>
                <span>Flag</span>
              </Link>
              <Link href="#">
                <i className="fa-sharp fa-regular fa-reply"></i>
                <span>Reply</span>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserReview;
