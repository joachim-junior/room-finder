import CookiePolicy from "@/components/inner-pages/cookies";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Cookie Policy - RoomFinder",
  description:
    "Cookie Policy for RoomFinder - Real Estate Platform in Cameroon",
};

const CookiePage = () => {
  return (
    <Wrapper>
      <CookiePolicy />
    </Wrapper>
  );
};

export default CookiePage;
