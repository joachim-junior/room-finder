"use client";
import { useState } from "react";
import VideoPopup from "@/modals/VideoPopup";

const VideoBanner = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <div className="video-banner-one mt-150 xl-mt-120 md-mt-80">
        <div className="container">
          <div
            className="bg-wrapper position-relative z-1 overflow-hidden d-flex align-items-center justify-content-center"
            style={{ backgroundImage: `url(/assets/images/media/img_50.jpg)` }}
          >
            <div className="text-center text-white mb-4">
              <h3 className="text-white mb-3">Discover RoomFinder</h3>
              <p className="fs-18">
                Watch how we&apos;re revolutionizing real estate in Cameroon
              </p>
            </div>
            <a
              onClick={() => setIsVideoOpen(true)}
              style={{ cursor: "pointer" }}
              className="fancybox video-icon d-flex align-items-center justify-content-center rounded-circle tran3s"
            >
              <i className="fa-solid fa-play"></i>
            </a>
          </div>
        </div>
      </div>
      {/* video modal start */}
      <VideoPopup
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId={"dQw4w9WgXcQ"}
      />
      {/* video modal end */}
    </>
  );
};

export default VideoBanner;
