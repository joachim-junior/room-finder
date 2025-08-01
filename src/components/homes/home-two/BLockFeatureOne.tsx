import feature_data from "@/data/home-data/FeatureData";
import Link from "next/link";
import Image from "next/image";

const BLockFeatureOne = () => {
  return (
    <div className="block-feature-six mt-150 xl-mt-100">
      <div className="container">
        <div className="position-relative z-1">
          <div className="row">
            <div className="col-xl-9 m-auto">
              <div className="title-one text-center mb-35 lg-mb-20 wow fadeInUp">
                <h2 className="font-garamond">
                  Popular Guesthouse Destinations
                </h2>
                <p className="fs-22 mt-xs">
                  Discover amazing guesthouses and rooms in Cameroon&apos;s top
                  cities. Find your perfect stay in these popular destinations.
                </p>
              </div>
            </div>
          </div>

          <div className="row gx-xxl-5">
            {feature_data
              .filter((items) => items.page === "home_2_feature_1")
              .map((item) => (
                <div
                  key={item.id}
                  className="col-lg-4 col-md-6 wow fadeInUp"
                  data-wow-delay={item.data_delay_time}
                >
                  <div
                    className={`location-card-two position-relative z-1 d-flex align-items-center justify-content-center mt-30 ${item.item_bg}`}
                    style={
                      item.img ? { backgroundImage: `url(${item.img})` } : {}
                    }
                  >
                    <div className="content text-center">
                      <h5 className="text-white font-garamond">{item.title}</h5>
                    </div>
                    <Link href="/listing_05" className="stretched-link"></Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BLockFeatureOne;
