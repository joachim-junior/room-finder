import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderTwo from "@/layouts/headers/HeaderTwo";
import BlogTwoArea from "./BlogTwoArea";
import FancyBanner from "@/components/common/FancyBanner";

const BlogTwo = () => {
  return (
    <>
      <HeaderTwo />
      <BreadcrumbThree
        title="Blog List"
        link="#"
        link_title="Pages"
        sub_title="Blog"
        style={false}
      />
      <BlogTwoArea />
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default BlogTwo;
