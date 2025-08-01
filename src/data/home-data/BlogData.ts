interface DataType {
  id: number;
  page: string;
  class_name: string;
  date: string;
  info_name: string;
  info_time: number;
  title: string;
  data_delay_time?: string;
}

const blog_data: DataType[] = [
  {
    id: 1,
    page: "home_2",
    class_name: "blog-item-1",
    date: "10 MAY",
    info_name: "Esther Ngu .",
    info_time: 7,
    title: "The Rise of Guesthouses in Cameroon’s Major Cities",
  },
  {
    id: 2,
    page: "home_2",
    class_name: "blog-item-2",
    date: "22 APR",
    info_name: "Jean-Paul Fote . ",
    info_time: 6,
    title: "How to Choose the Perfect Guesthouse for Your Stay in Cameroon",
    data_delay_time: "0.1s",
  },
  {
    id: 3,
    page: "home_2",
    class_name: "blog-item-3",
    date: "15 MAR",
    info_name: "Brenda Tabe . ",
    info_time: 5,
    title: "Retail Opportunities Near Cameroon’s Top Guesthouses",
    data_delay_time: "0.2s",
  },
  {
    id: 4,
    page: "home_2",
    class_name: "blog-item-4",
    date: "02 FEB",
    info_name: "Samuel Fomum . ",
    info_time: 8,
    title:
      "Safety and Comfort: What to Expect from Modern Guesthouses in Cameroon",
    data_delay_time: "0.3s",
  },

  // home_4

  {
    id: 1,
    page: "home_4",
    class_name: "blog-item-1",
    date: "08 JAN",
    info_name: "Mark Quins . ",
    info_time: 8,
    title: "Print, publishing qui visual ux layout mockups.",
  },
  {
    id: 2,
    page: "home_4",
    class_name: "blog-item-2",
    date: "17 AUG",
    info_name: "Rashed Kabir . ",
    info_time: 7,
    title: "Designer’s Checklist for Every UX/UI Project.",
  },
  {
    id: 3,
    page: "home_4",
    class_name: "blog-item-3",
    date: "21 SEP",
    info_name: "Rashed Kabir . ",
    info_time: 8,
    title: "Spending Habits, 13 Tips for grow Your Money.",
  },
];

export default blog_data;
