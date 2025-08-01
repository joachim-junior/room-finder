import HeaderOne from "@/layouts/headers/HeaderOne";
import ListingDetailsOneArea from "./ListingDetailsOneArea";
import FancyBanner from "@/components/common/FancyBanner";
import FooterFour from "@/layouts/footers/FooterFour";

interface ListingDetailsOneProps {
  propertyData?: any;
}

const ListingDetailsOne = ({ propertyData }: ListingDetailsOneProps) => {
  return (
    <>
      <HeaderOne style={true} />
      <ListingDetailsOneArea propertyData={propertyData} />
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default ListingDetailsOne;
