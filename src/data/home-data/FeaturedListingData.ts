interface DataType {
  id: number;
  page: string;
  tag: string;
  title: string;
  address: string;
  data_delay_time?: string;
  item_bg_img: string;
  property_info: {
    feature: string;
    total_feature: number;
  }[];
}
[];

const feature_listing_data: DataType[] = [
  {
    id: 1,
    page: "home_5",
    tag: "Rent",
    item_bg_img: "item-bg-1",
    title: "Blueberry villa.",
    address: "Mirpur 10, Stadium dhaka 1208",
    property_info: [
      { feature: "sqft", total_feature: 2137 },
      { feature: "bed", total_feature: 0o3 },
      { feature: "kitchen", total_feature: 0o1 },
      { feature: "bath", total_feature: 0o2 },
    ],
  },
  {
    id: 2,
    page: "home_5",
    tag: "Sell",
    item_bg_img: "item-bg-2",
    title: "Swimming Pool Villa",
    address: "127 green road, California, USA",
    data_delay_time: "0.1s",
    property_info: [
      { feature: "sqft", total_feature: 2137 },
      { feature: "bed", total_feature: 0o3 },
      { feature: "kitchen", total_feature: 0o1 },
      { feature: "bath", total_feature: 0o2 },
    ],
  },
  {
    id: 3,
    page: "home_5",
    tag: "Rent",
    item_bg_img: "item-bg-3",
    title: "Modern Duplex",
    address: "Twin tower, 32 street, Florida",
    data_delay_time: "0.2s",
    property_info: [
      { feature: "sqft", total_feature: 2137 },
      { feature: "bed", total_feature: 0o3 },
      { feature: "kitchen", total_feature: 0o1 },
      { feature: "bath", total_feature: 0o2 },
    ],
  },

  // home_8
  {
    id: 1,
    page: "home_8",
    tag: "Available",
    item_bg_img: "item-bg-1",
    title: "Bamenda Guesthouse",
    address: "Bamenda, Northwest Region, Cameroon",
    data_delay_time: "0.1s",
    property_info: [
      { feature: "bed", total_feature: 2 },
      { feature: "bath", total_feature: 1 },
      { feature: "guest", total_feature: 4 },
      { feature: "wifi", total_feature: 1 },
    ],
  },
  {
    id: 2,
    page: "home_8",
    tag: "Available",
    item_bg_img: "item-bg-2",
    title: "Buea Mountain Lodge",
    address: "Buea, Southwest Region, Cameroon",
    data_delay_time: "0.2s",
    property_info: [
      { feature: "bed", total_feature: 3 },
      { feature: "bath", total_feature: 2 },
      { feature: "guest", total_feature: 6 },
      { feature: "wifi", total_feature: 1 },
    ],
  },
  {
    id: 3,
    page: "home_8",
    tag: "Available",
    item_bg_img: "item-bg-3",
    title: "Limbe Beach House",
    address: "Limbe, Southwest Region, Cameroon",
    data_delay_time: "0.3s",
    property_info: [
      { feature: "bed", total_feature: 2 },
      { feature: "bath", total_feature: 1 },
      { feature: "guest", total_feature: 4 },
      { feature: "wifi", total_feature: 1 },
    ],
  },
  {
    id: 4,
    page: "home_8",
    tag: "Available",
    item_bg_img: "item-bg-1",
    title: "Douala City Guesthouse",
    address: "Douala, Littoral Region, Cameroon",
    data_delay_time: "0.1s",
    property_info: [
      { feature: "bed", total_feature: 1 },
      { feature: "bath", total_feature: 1 },
      { feature: "guest", total_feature: 2 },
      { feature: "wifi", total_feature: 1 },
    ],
  },
  {
    id: 5,
    page: "home_8",
    tag: "Available",
    item_bg_img: "item-bg-2",
    title: "Yaounde Central Lodge",
    address: "Yaounde, Centre Region, Cameroon",
    data_delay_time: "0.2s",
    property_info: [
      { feature: "bed", total_feature: 2 },
      { feature: "bath", total_feature: 1 },
      { feature: "guest", total_feature: 3 },
      { feature: "wifi", total_feature: 1 },
    ],
  },
  {
    id: 6,
    page: "home_8",
    tag: "Available",
    item_bg_img: "item-bg-3",
    title: "Kribi Coastal Retreat",
    address: "Kribi, South Region, Cameroon",
    data_delay_time: "0.3s",
    property_info: [
      { feature: "bed", total_feature: 3 },
      { feature: "bath", total_feature: 2 },
      { feature: "guest", total_feature: 6 },
      { feature: "wifi", total_feature: 1 },
    ],
  },
];

export default feature_listing_data;
