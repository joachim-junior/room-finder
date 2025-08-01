import Wrapper from "@/layouts/Wrapper";
import inner_blog_data from "@/data/inner-data/BlogData";
import Image from "next/image";
import { notFound } from "next/navigation";
import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";

export async function generateStaticParams() {
  return inner_blog_data.map((blog) => ({ id: blog.id.toString() }));
}

export default function BlogDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const blog = inner_blog_data.find((b) => b.id.toString() === params.id);
  if (!blog) return notFound();

  return (
    <Wrapper>
      <BreadcrumbThree
        title={blog.title}
        link="/blog_01"
        link_title="Blog"
        sub_title="Blog Details"
        style={false}
      />
      <div className="blog-details border-top mt-130 xl-mt-100 pt-100 xl-pt-80 mb-150 xl-mb-100">
        <div className="container">
          <div className="row gx-xl-5">
            <div className="col-lg-8">
              <article className="blog-post-meta">
                {blog.img && (
                  <figure
                    className="post-img position-relative m0"
                    style={{
                      position: "relative",
                      marginBottom: "100px",
                      zIndex: 1,
                    }}
                  >
                    <Image
                      src={blog.img}
                      alt={blog.title}
                      width={800}
                      height={400}
                      style={{
                        position: "static",
                        display: "block",
                        width: "100%",
                        height: "auto",
                        zIndex: 1,
                      }}
                    />
                    <div className="fw-500 date d-inline-block">
                      {blog.date}
                    </div>
                  </figure>
                )}
                <div
                  className="post-data pt-50 md-pt-30"
                  style={{ clear: "both", marginTop: 120 }}
                >
                  <h3 className="blog-title">{blog.title}</h3>
                  <div className="mb-3">
                    <strong>Author:</strong> {blog.author}
                  </div>
                  <p style={{ whiteSpace: "pre-line" }}>{blog.desc}</p>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-4">
                      <strong>Tags:</strong>{" "}
                      {blog.tags.map((tag, i) => (
                        <span key={tag} className="badge bg-secondary me-2">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </div>
            {/* Related Blogs Sidebar */}
            <div className="col-lg-4">
              {blog.related && blog.related.length > 0 && (
                <div className="related-blogs-sidebar">
                  <h5 className="mb-4">Related Blogs</h5>
                  {blog.related.slice(0, 3).map((relId) => {
                    const relBlog = inner_blog_data.find((b) => b.id === relId);
                    if (!relBlog) return null;
                    return (
                      <a
                        href={`/blog_details/${relBlog.id}`}
                        key={relId}
                        className="card mb-3 text-decoration-none text-dark"
                        style={{
                          border: "1px solid #eee",
                          borderRadius: 8,
                          overflow: "hidden",
                        }}
                      >
                        {relBlog.img && (
                          <div style={{ height: 140, overflow: "hidden" }}>
                            <Image
                              src={relBlog.img}
                              alt={relBlog.title}
                              width={400}
                              height={140}
                              style={{ objectFit: "cover", width: "100%" }}
                            />
                          </div>
                        )}
                        <div className="card-body">
                          <h6 className="card-title mb-0">{relBlog.title}</h6>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
