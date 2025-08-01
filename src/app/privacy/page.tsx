import PrivacyPolicy from "@/components/inner-pages/privacy";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Privacy Policy - RoomFinder",
  description:
    "Privacy Policy for RoomFinder - Real Estate Platform in Cameroon",
};

const PrivacyPage = () => {
  return (
    <Wrapper>
      <PrivacyPolicy />
    </Wrapper>
  );
};

export default PrivacyPage;
