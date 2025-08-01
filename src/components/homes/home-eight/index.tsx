import HeaderFive from "@/layouts/headers/HeaderFive"
import Hero from "./Hero"
import BLockFeatureOne from "./BLockFeatureOne"
import PropertyListingOne from "./PropertyListingOne"
import FancyBannerOne from "./FancyBannerOne"
import BLockFeatureTwo from "./BLockFeatureTwo"
import Category from "../home-four/Category"
import BLockFeatureFour from "../home-one/BLockFeatureFour"
import FancyBannerTwo from "../home-two/FancyBannerTwo"
import Blog from "../home-two/Blog"
import FooterThree from "@/layouts/footers/FooterThree"
import Feedback from "./Feedback"

const HomeEight = () => {
  return (
    <div className="main-page-wrapper">
      <HeaderFive />
      <Hero />
      <BLockFeatureOne />
      <PropertyListingOne />
      <FancyBannerOne />
      <BLockFeatureTwo />
      <Category />
      <BLockFeatureFour />
      <Feedback />
      <Blog style={true} />
      <FancyBannerTwo/>
      <FooterThree />
    </div>
  )
}

export default HomeEight
