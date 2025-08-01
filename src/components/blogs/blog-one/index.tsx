import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import BlogOneArea from "./BlogOneArea";
import FancyBanner from "@/components/common/FancyBanner";

const BlogOne = () => {
  return (
    <>
      <BreadcrumbThree
        title="Blog Grid"
        link="#"
        link_title="Pages"
        sub_title="Blog"
        style={false}
      />
      <BlogOneArea />
      <FancyBanner />
    </>
  );
};

export default BlogOne;
