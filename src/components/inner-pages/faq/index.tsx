import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne";
import FaqArea from "./FaqArea";
import FancyBanner from "@/components/common/FancyBanner";

const Faq = () => {
  return (
    <>
      <BreadcrumbOne
        title="Frequently Asked Questions"
        link="#"
        link_title="Pages"
        sub_title="FAQ"
        style={false}
      />
      <FaqArea />
      <FancyBanner style={false} />
    </>
  );
};

export default Faq;
