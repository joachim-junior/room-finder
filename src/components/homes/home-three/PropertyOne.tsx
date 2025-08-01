"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import BookingModal from "@/components/modals/BookingModal";
import { useAuth } from "@/contexts/AuthContext";

import lineShape from "@/assets/images/shape/shape_37.svg";

interface DataType {
  id: number;
  tag: string;
  title: string;
  address: string;
  property_info?: JSX.Element[];
  icon?: string[];
  item_bg_img: string;
  class_name?: string;
}

const property_data: DataType[] = [
  {
    id: 1,
    tag: "Available",
    title: "Bamenda Mountain Guesthouse",
    address: "Bamenda, Northwest Region, Cameroon",
    property_info: [
      <>
        <span>2</span> beds
      </>,
      <>
        <span>1</span> bath
      </>,
      <>
        <span>4</span> guests
      </>,
      <>
        <span>WiFi</span> included
      </>,
    ],
    icon: ["heart", "bookmark", "calendar-check"],
    item_bg_img: "property-item-1",
  },
  {
    id: 2,
    tag: "Available",
    title: "Buea Silicon Lodge",
    address: "Buea, Southwest Region, Cameroon",
    item_bg_img: "property-item-2",
    class_name: "md-mt-40",
  },
  {
    id: 3,
    tag: "Available",
    title: "Limbe Beach Retreat",
    address: "Limbe, Southwest Region, Cameroon",
    item_bg_img: "property-item-3",
    class_name: "mt-40",
  },
];

const PropertyOne = () => {
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
    <div className="property-listing-three position-relative z-1 mt-170 xl-mt-140 lg-mt-120">
      <div className="container container-large">
        <div className="position-relative">
          <div className="title-one mb-60 lg-mb-40 wow fadeInUp">
            <h2 className="font-garamond star-shape">
              Featured <em>Guesthouses</em>{" "}
              <span className="star-shape">
                <Image src={lineShape} alt="" className="lazy-img" />
              </span>
            </h2>
            <p className="fs-22 m0">
              Discover amazing guesthouses in Cameroon&apos;s top cities.
            </p>
          </div>

          <div className="row gx-xxl-5">
            {property_data.slice(0, 1).map((item) => (
              <div key={item.id} className="col-lg-8 d-flex">
                <div
                  className="listing-card-three w-100 h-100 position-relative z-1 wow fadeInUp"
                  style={{
                    backgroundImage: `url(/assets/images/listing/img_12.jpg)`,
                  }}
                >
                  <div className="w-100 h-100 d-flex flex-column">
                    <div className="tag fw-500 text-uppercase">{item.tag}</div>
                    <div className="mt-100 mt-sm-auto wrapper d-flex flex-wrap justify-content-between align-items-center">
                      <div className="property-name h-100">
                        <h5 className="text-white mb-15">{item.title}</h5>
                        <p className="m0 text-white">{item.address}</p>
                      </div>
                      <div className="property-info h-100">
                        <ul className="style-none feature d-flex flex-wrap align-items-center justify-content-between pb-5">
                          {item.property_info?.map((list, i) => (
                            <li key={i} className="d-flex align-items-center">
                              <div className="fs-16">{list}</div>
                            </li>
                          ))}
                        </ul>
                        <div className="d-sm-flex justify-content-between align-items-center mt-10">
                          <ul className="style-none d-flex action-icons">
                            {item.icon?.map((icon, index) => (
                              <li key={index}>
                                {icon === "calendar-check" ? (
                                  <button
                                    onClick={() => handleBookNow(item)}
                                    className="btn-four rounded-circle"
                                    title={
                                      isAuthenticated
                                        ? "Book Now"
                                        : "Login to Book"
                                    }
                                  >
                                    <i className="bi bi-calendar-check"></i>
                                  </button>
                                ) : (
                                  <Link href="#">
                                    <i className={`fa-light fa-${icon}`}></i>
                                  </Link>
                                )}
                              </li>
                            ))}
                          </ul>
                          <Link
                            href="/listing_details_05"
                            className="btn-ten xs-mt-20"
                          >
                            <span>Full Details</span>{" "}
                            <i className="bi bi-arrow-up-right"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="col-lg-4 d-flex">
              <div className="w-100 h-100">
                <div className="row h-100">
                  {property_data.slice(1, 3).map((item) => (
                    <div key={item.id} className="col-lg-12 col-md-6">
                      <div
                        className={`listing-card-two w-100 position-relative z-1 ${item.class_name} wow fadeInUp ${item.item_bg_img}`}
                      >
                        <div className="w-100 h-100 d-flex flex-column">
                          <div className="tag fw-500 text-uppercase">
                            {item.tag}
                          </div>
                          <div className="mt-auto d-lg-flex justify-content-between align-items-center">
                            <div className="md-mb-20">
                              <h5 className="text-white">{item.title}</h5>
                              <p className="m0 text-white">{item.address}</p>
                            </div>
                            <div className="d-flex gap-2">
                              <Link
                                href="/listing_details_05"
                                className="btn-four rounded-circle inverse stretched-link"
                              >
                                <i className="bi bi-eye"></i>
                              </Link>
                              <button
                                onClick={() => handleBookNow(item)}
                                className="btn-four rounded-circle"
                                title={
                                  isAuthenticated ? "Book Now" : "Login to Book"
                                }
                              >
                                <i className="bi bi-calendar-check"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="section-btn text-center md-mt-60">
            <Link href="/listing_04" className="btn-five md">
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

export default PropertyOne;
