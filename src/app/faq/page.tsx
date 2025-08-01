import Faq from "@/components/inner-pages/faq";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "FAQ - RoomFinder",
  description:
    "Frequently Asked Questions about RoomFinder - Real Estate Platform in Cameroon",
};

const index = () => {
  return (
    <Wrapper>
      <Faq />
    </Wrapper>
  );
};

export default index;
