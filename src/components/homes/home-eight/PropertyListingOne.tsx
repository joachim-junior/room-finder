"use client";
import { useState } from "react";
import feature_listing_data from "@/data/home-data/FeaturedListingData";
import Link from "next/link";
import BookingModal from "@/components/modals/BookingModal";
import { useAuth } from "@/contexts/AuthContext";

const PropertyListingOne = () => {
  const { isAuthenticated } = useAuth();
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    guesthouse: any;
  }>({
    isOpen: false,
    guesthouse: null,
  });

  const handleBookNow = (guesthouse: any) => {
    setBookingModal({
      isOpen: true,
      guesthouse,
    });
  };

  const closeBookingModal = () => {
    setBookingModal({
      isOpen: false,
      guesthouse: null,
    });
  };

  return (
    <div className="property-listing-one mt-170 xl-mt-120">
      <div className="container container-large">
        <div className="position-relative">
          <div className="title-one text-center mb-25 lg-mb-10 wow fadeInUp">
            <h3>Featured Guesthouses</h3>
            <p className="fs-22 mt-xs">
              Discover amazing guesthouses in Cameroon&apos;s top cities.
            </p>
          </div>

          <div className="row gx-xxl-5">
            {feature_listing_data
              .filter((items) => items.page === "home_8")
              .map((item) => (
                <div
                  key={item.id}
                  className="col-lg-4 col-md-6 mt-40 wow fadeInUp"
                  data-wow-delay={item.data_delay_time}
                >
                  <div
                    className={`listing-card-four overflow-hidden d-flex align-items-end position-relative z-1 ${item.item_bg_img}`}
                  >
                    <div className="tag fw-500">{item.tag}</div>
                    <div className="property-info tran3s w-100">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="pe-3">
                          <Link
                            href="/listing_details_04"
                            className="title fw-500 tran4s"
                          >
                            {item.title}
                          </Link>
                          <div className="address tran4s">{item.address}</div>
                        </div>
                        <div className="d-flex gap-2">
                          <Link
                            href="/listing_details_04"
                            className="btn-four inverse"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          <button
                            onClick={() => handleBookNow(item)}
                            className="btn-four"
                            title={
                              isAuthenticated ? "Book Now" : "Login to Book"
                            }
                          >
                            <i className="bi bi-calendar-check"></i>
                          </button>
                        </div>
                      </div>

                      <div className="pl-footer tran4s">
                        <ul className="style-none feature d-flex flex-wrap align-items-center justify-content-between">
                          {item.property_info.map((info, i) => (
                            <li key={i}>
                              <strong className="color-dark fw-500">
                                {info.total_feature}
                              </strong>
                              <span className="fs-16">{info.feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="text-center mt-100 md-mt-60">
            <Link href="/listing_06" className="btn-eight">
              <span>Explore All</span> <i className="bi bi-arrow-up-right"></i>
            </Link>
          </div>
        </div>
      </div>

      {bookingModal.isOpen && (
        <BookingModal
          isOpen={bookingModal.isOpen}
          onClose={closeBookingModal}
          guesthouse={bookingModal.guesthouse}
        />
      )}
    </div>
  );
};

export default PropertyListingOne;
