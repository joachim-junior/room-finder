"use client";
import NiceSelect from "@/ui/NiceSelect";
import MediaGallery from "./MediaGallery";
import Review from "@/components/inner-pages/agency/agency-details/Review";
import Sidebar from "./Sidebar";
import CommonBanner from "../listing-details-common/CommonBanner";
import CommonPropertyOverview from "../listing-details-common/CommonPropertyOverview";
import CommonPropertyFeatureList from "../listing-details-common/CommonPropertyFeatureList";
import CommonAmenities from "../listing-details-common/CommonAmenities";
import CommonPropertyVideoTour from "../listing-details-common/CommonPropertyVideoTour";
import CommonPropertyFloorPlan from "../listing-details-common/CommonPropertyFloorPlan";
import CommonNearbyList from "../listing-details-common/CommonNearbyList";
import CommonSimilarProperty from "../listing-details-common/CommonSimilarProperty";
import CommonProPertyScore from "../listing-details-common/CommonProPertyScore";
import CommonLocation from "../listing-details-common/CommonLocation";
import CommonReviewForm from "../listing-details-common/CommonReviewForm";
import BookingSection from "./BookingSection";

interface ListingDetailsOneAreaProps {
  propertyData: any;
}

const ListingDetailsOneArea = ({
  propertyData,
}: ListingDetailsOneAreaProps) => {
  // Add null checks to prevent runtime errors during static generation
  if (!propertyData) {
    return (
      <div className="listing-details-one theme-details-one bg-pink pt-180 lg-pt-150 pb-150 xl-pb-120">
        <div className="container">
          <div className="text-center">
            <h3>Loading property details...</h3>
          </div>
        </div>
      </div>
    );
  }

  const { propetydetails, facility, gallery, reviewlist, total_review } =
    propertyData || {};

  // Add null check for propetydetails
  if (!propetydetails) {
    return (
      <div className="listing-details-one theme-details-one bg-pink pt-180 lg-pt-150 pb-150 xl-pb-120">
        <div className="container">
          <div className="text-center">
            <h3>Property not found</h3>
          </div>
        </div>
      </div>
    );
  }

  const selectHandler = (e: any) => {};

  // Combine main image and gallery
  let galleryImages = Array.isArray(gallery) ? [...gallery] : [];
  const mainImage = propetydetails.image?.[0]?.image;
  if (mainImage && (!galleryImages.length || galleryImages[0] !== mainImage)) {
    galleryImages = [mainImage, ...galleryImages];
  }

  return (
    <div className="listing-details-one theme-details-one bg-pink pt-180 lg-pt-150 pb-150 xl-pb-120">
      <div className="container">
        <CommonBanner propetydetails={propetydetails} />
        {/* Pass main property image to MediaGallery */}
        <MediaGallery gallery={galleryImages} />
        <div className="property-feature-list bg-white shadow4 border-20 p-40 mt-50 mb-60">
          <h4 className="sub-title-one mb-40 lg-mb-20">Property Overview</h4>
          <CommonPropertyOverview propetydetails={propetydetails} />
        </div>
        <div className="row">
          <div className="col-xl-8">
            <div className="property-overview mb-50 bg-white shadow4 border-20 p-40">
              <h4 className="mb-20">Overview</h4>
              <p className="fs-20 lh-lg">{propetydetails.description}</p>
            </div>
            <div className="property-amenities bg-white shadow4 border-20 p-40 mb-50">
              <CommonAmenities facility={facility} />
            </div>
            <CommonSimilarProperty currentPropertyId={propetydetails.id} />
            <div className="review-panel-one bg-white shadow4 border-20 p-40 mb-50">
              <div className="position-relative z-1">
                <div className="d-sm-flex justify-content-between align-items-center mb-10">
                  <h4 className="m0 xs-pb-30">Reviews</h4>
                  <NiceSelect
                    className="nice-select"
                    options={[
                      { value: "01", text: "Newest" },
                      { value: "02", text: "Best Seller" },
                      { value: "03", text: "Best Match" },
                    ]}
                    defaultCurrent={0}
                    onChange={selectHandler}
                    name=""
                    placeholder=""
                  />
                </div>
                <Review
                  style={true}
                  reviewlist={reviewlist}
                  total_review={total_review}
                />
              </div>
            </div>
            <div className="review-form bg-white shadow4 border-20 p-40">
              <CommonReviewForm propertyId={propetydetails.id} />
            </div>
          </div>
          <div className="col-xl-4">
            <BookingSection property={propetydetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsOneArea;
