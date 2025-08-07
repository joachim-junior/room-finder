import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderTwo from "@/layouts/headers/HeaderTwo";
import BlogThreeArea from "./BlogThreeArea";
import FancyBanner from "@/components/common/FancyBanner";

const BlogThree = () => {
  return (
    <>
      <HeaderTwo />
      <BreadcrumbOne
        title="Blog Full Width"
        link="#"
        link_title="Pages"
        sub_title="Blog"
        style={true}
      />
      <BlogThreeArea />
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default BlogThree;
