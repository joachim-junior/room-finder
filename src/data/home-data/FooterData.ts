interface DataType {
  id: number;
  page: string;
  widget_title: string;
  widget_class?: string;
  widget_class2?: string;
  footer_link: {
    link: string;
    link_title: string;
  }[];
}

const footer_data: DataType[] = [
  {
    id: 1,
    page: "home_1",
    widget_class: "xs-mt-50",
    widget_title: "Links",
    footer_link: [
      { link: "/", link_title: "Home" },
      { link: "/about_us_01", link_title: "About Company" },
      { link: "/blog_01", link_title: "Blog" },
      { link: "/dashboard/dashboard-index", link_title: "Dashboard" },
    ],
  },
  {
    id: 2,
    widget_class: "xs-mt-30",
    page: "home_1",
    widget_title: "Legal",
    footer_link: [
      { link: "/terms", link_title: "Terms & conditions" },
      { link: "/cookies", link_title: "Cookie" },
      { link: "/privacy", link_title: "Privacy policy" },
      { link: "/faq", link_title: "Faq's" },
    ],
  },
  {
    id: 3,
    widget_class: "xs-mt-30",
    page: "home_1",
    widget_title: "New Listing",
    footer_link: [
      { link: "/listing_01", link_title: "Rent Apartments" },
      { link: "/listing_01", link_title: "Rent Studios" },
      { link: "/listing_01", link_title: "Rent Rooms" },
      { link: "/listing_01", link_title: "Rent Houses" },
    ],
  },

  // home two

  {
    id: 1,
    page: "home_3",
    widget_title: "Links",
    footer_link: [
      { link: "/", link_title: "Home" },
      { link: "/about_us_01", link_title: "About Company" },
      { link: "/blog_01", link_title: "Blog" },
      { link: "/dashboard/dashboard-index", link_title: "Dashboard" },
    ],
  },
  {
    id: 2,
    widget_class: "col-xxl-3 col-xl-4",
    page: "home_3",
    widget_title: "Legal",
    footer_link: [
      { link: "/terms", link_title: "Terms & conditions" },
      { link: "/cookies", link_title: "Cookie" },
      { link: "/privacy", link_title: "Privacy policy" },
      { link: "/faq", link_title: "Faq's" },
    ],
  },
  {
    id: 3,
    page: "home_3",
    widget_title: "New Listing",
    footer_link: [
      { link: "/listing_01", link_title: "Rent Apartments" },
      { link: "/listing_01", link_title: "Rent Studios" },
      { link: "/listing_01", link_title: "Rent Rooms" },
      { link: "/listing_01", link_title: "Rent Houses" },
    ],
  },

  // home four

  {
    id: 1,
    page: "home_4",
    widget_class: "col-lg-2",
    widget_title: "Links",
    footer_link: [
      { link: "/", link_title: "Home" },
      { link: "/about_us_01", link_title: "About Company" },
      { link: "/blog_01", link_title: "Blog" },
    ],
  },
  {
    id: 2,
    widget_class: "col-xl-2 col-lg-3",
    page: "home_4",
    widget_title: "New Listing",
    footer_link: [
      { link: "/listing_01", link_title: "Rent Apartments" },
      { link: "/listing_01", link_title: "Rent Studios" },
      { link: "/listing_01", link_title: "Rent Rooms" },
      { link: "/listing_01", link_title: "Rent Houses" },
    ],
  },
  {
    id: 3,
    widget_class: "col-xl-2 col-lg-3",
    page: "home_4",
    widget_title: "Legal",
    footer_link: [
      { link: "/terms", link_title: "Terms & conditions" },
      { link: "/cookies", link_title: "Cookie" },
      { link: "/privacy", link_title: "Privacy policy" },
      { link: "/faq", link_title: "Faq's" },
    ],
  },

  // home five

  {
    id: 1,
    page: "home_5",
    widget_class: "col-lg-3 ms-auto",
    widget_class2: "ps-xl-5",
    widget_title: "Links",
    footer_link: [
      { link: "/", link_title: "Home" },
      { link: "/about_us_01", link_title: "About Company" },
      { link: "/blog_01", link_title: "Blog" },
      { link: "/contact", link_title: "Contact" },
      { link: "/faq", link_title: "Faq's" },
    ],
  },
  {
    id: 2,
    widget_class: "col-lg-3",
    page: "home_5",
    widget_title: "Legal",
    footer_link: [
      { link: "/terms", link_title: "Terms & conditions" },
      { link: "/cookies", link_title: "Cookie" },
      { link: "/privacy", link_title: "Privacy policy" },
    ],
  },
  {
    id: 3,
    widget_class: "col-lg-2",
    page: "home_5",
    widget_title: "New Listing",
    footer_link: [
      { link: "/listing_01", link_title: "Rent Apartments" },
      { link: "/listing_01", link_title: "Rent Studios" },
      { link: "/listing_01", link_title: "Rent Rooms" },
      { link: "/listing_01", link_title: "Rent Houses" },
    ],
  },
];

export default footer_data;
