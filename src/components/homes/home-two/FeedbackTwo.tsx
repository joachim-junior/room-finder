"use client";
import Image, { StaticImageData } from "next/image";
import Slider from "react-slick";
import BrandOne from "@/components/common/brand/BrandOne";

import feedbackIcon from "@/assets/images/icon/icon_14.svg";
import feedbackShape_1 from "@/assets/images/shape/shape_25.svg";
import feedbackShape_2 from "@/assets/images/shape/shape_26.svg";
import feedbackShape_3 from "@/assets/images/shape/shape_27.svg";
const feedbackThumbPlaceholder =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXA-Uu5DzOUC3DEEh789elx46nvfe-0s-7xg&s";

interface DataType {
  id: number;
  desc: JSX.Element;
  title: string;
  country: string;
  thumb: StaticImageData | string;
}

const feedback_data: DataType[] = [
  {
    id: 1,
    desc: (
      <>
        &quot;Roomfinder made booking my guesthouse in Bamenda so easy and
        secure! Highly recommended.&quot;
      </>
    ),
    title: "Emmanuel Njoya",
    country: "Bamenda, Cameroon",
    thumb: feedbackThumbPlaceholder,
  },
  {
    id: 2,
    desc: (
      <>
        &quot;I found the perfect place in Douala and the payment process was
        seamless.&quot;
      </>
    ),
    title: "Brenda Tabe",
    country: "Douala, Cameroon",
    thumb: feedbackThumbPlaceholder,
  },
  {
    id: 3,
    desc: (
      <>
        &quot;Quick booking and great support. I’ll use Roomfinder again for my
        next stay in Buea!&quot;
      </>
    ),
    title: "Samuel Fomum",
    country: "Buea, Cameroon",
    thumb: feedbackThumbPlaceholder,
  },
];

const FeedbackTwo = () => {
  const setting = {
    dots: true,
    arrows: false,
    centerPadding: "0px",
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 300000,
  };

  return (
    <div className="feedback-section-three mt-170 xl-mt-150 lg-mt-100">
      <div className="container">
        <div className="bg-line position-relative z-1 pt-200 xl-pt-150 lg-pt-80 pb-180 xl-pb-150">
          <div className="row gx-lg-0">
            <div className="col-lg-5 col-md-8">
              <div className="title-one">
                <div className="upper-title color">CLIENT Feedback</div>
                <h2 className="font-garamond text-white fs-lg">
                  Don’t Trust us, Trust Our{" "}
                  <span className="color">Client.</span>
                </h2>
              </div>
            </div>
            <div className="col-lg-6 ms-auto">
              <div className="feedback-bg-wrapper md-mt-60 position-relative z-1">
                <div className="icon d-flex align-items-center justify-content-center rounded-circle">
                  <Image src={feedbackIcon} alt="" className="lazy-img" />
                </div>
                <Slider {...setting} className="feedback-slider-one">
                  {feedback_data.map((item) => (
                    <div key={item.id} className="item">
                      <div className="feedback-block-three">
                        <blockquote>{item.desc}</blockquote>
                        <div className="d-flex justify-content-end align-items-center">
                          <div className="text-end pe-3 pe-lg-5">
                            <div className="name fs-22 text-white mb-5">
                              {item.title}
                            </div>
                            <div className="fs-18 text-white opacity-75">
                              {item.country}
                            </div>
                          </div>
                          <Image
                            src={item.thumb}
                            alt=""
                            className="avatar"
                            width={60}
                            height={60}
                            style={{ borderRadius: "50%" }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              console.log(
                                `Feedback avatar failed to load: ${target.src}`
                              );
                              target.src = "/images/placeholder.jpg";
                            }}
                            onLoad={() => {
                              console.log(
                                `Feedback avatar loaded successfully: ${item.thumb}`
                              );
                            }}
                            unoptimized={typeof item.thumb === "string"}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>

                <div className="rating-box">
                  <Image src={feedbackShape_1} alt="" className="lazy-img" />
                  <div className="rate fw-500">
                    9.3 <br />
                    <span>Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Image
            src={feedbackShape_2}
            alt=""
            className="lazy-img shapes shape_01"
          />
          <Image
            src={feedbackShape_3}
            alt=""
            className="lazy-img shapes shape_02"
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackTwo;
