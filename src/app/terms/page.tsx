import TermsConditions from "@/components/inner-pages/terms";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Terms & Conditions - RoomFinder",
  description:
    "Terms and Conditions for RoomFinder - Real Estate Platform in Cameroon",
};

const TermsPage = () => {
  return (
    <Wrapper>
      <TermsConditions />
    </Wrapper>
  );
};

export default TermsPage;
