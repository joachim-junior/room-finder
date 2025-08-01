import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne";
import BLockFeatureOne from "./BLockFeatureOne";
import VideoBanner from "@/components/homes/home-seven/VideoBanner";
import BLockFeatureFive from "@/components/homes/home-one/BLockFeatureFive";
import FancyBanner from "@/components/common/FancyBanner";

const AboutUsOne = () => {
  return (
    <>
      <BreadcrumbOne
        title="About RoomFinder"
        sub_title="About us"
        style={false}
      />
      <BLockFeatureOne />
      <VideoBanner />
      <BLockFeatureFive style={true} />
      <FancyBanner style={false} />
    </>
  );
};

export default AboutUsOne;
