import Image, { StaticImageData } from "next/image";
import Fancybox from "@/components/common/Fancybox";

import bigCarousel_1 from "@/assets/images/listing/img_43.jpg";
import bigCarousel_2 from "@/assets/images/listing/img_44.jpg";
import bigCarousel_3 from "@/assets/images/listing/img_45.jpg";
import bigCarousel_4 from "@/assets/images/listing/img_46.jpg";

import smallCarousel_1 from "@/assets/images/listing/img_43_s.jpg";
import smallCarousel_2 from "@/assets/images/listing/img_44_s.jpg";
import smallCarousel_3 from "@/assets/images/listing/img_45_s.jpg";
import smallCarousel_4 from "@/assets/images/listing/img_46_s.jpg";

const largeThumb: string[] = ["1", "2", "3"];

interface DataType {
  big_carousel: StaticImageData[];
  small_carousel: StaticImageData[];
}

const gallery_data: DataType = {
  big_carousel: [bigCarousel_1, bigCarousel_2, bigCarousel_3, bigCarousel_4],
  small_carousel: [
    smallCarousel_1,
    smallCarousel_2,
    smallCarousel_3,
    smallCarousel_4,
  ],
};

const { big_carousel, small_carousel } = gallery_data;

const MediaGallery = ({ gallery }: { gallery?: string[] }) => {
  const images =
    Array.isArray(gallery) && gallery.length > 0
      ? gallery
      : ["/assets/images/media/no_image.jpg"];
  return (
    <div className="media-gallery mt-100 xl-mt-80 lg-mt-60">
      <div id="media_slider" className="carousel slide row">
        <div className="col-lg-10">
          <div className={` bg-white border-20 md-mb-20 shadow4 p-30`}>
            <div className="position-relative z-1 overflow-hidden border-20">
              <div className="carousel-inner">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`carousel-item${idx === 0 ? " active" : ""}`}
                  >
                    <img
                      src={
                        img.startsWith("http")
                          ? img
                          : `https://cpanel.roomfinder237.com/${img}`
                      }
                      alt="Property"
                      className="w-100 border-20"
                      style={{ maxHeight: 400, objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
              {images.length > 1 && (
                <>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#media_slider"
                    data-bs-slide="prev"
                  >
                    <i className="bi bi-chevron-left"></i>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#media_slider"
                    data-bs-slide="next"
                  >
                    <i className="bi bi-chevron-right"></i>
                    <span className="visually-hidden">Next</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaGallery;
