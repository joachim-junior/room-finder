import Image, { StaticImageData } from "next/image";

import icon_1 from "@/assets/images/icon/icon_47.svg";
import icon_2 from "@/assets/images/icon/icon_48.svg";
import icon_3 from "@/assets/images/icon/icon_49.svg";
import icon_4 from "@/assets/images/icon/icon_50.svg";
import icon_5 from "@/assets/images/icon/icon_51.svg";

const CommonPropertyOverview = ({
  propetydetails,
}: {
  propetydetails: any;
}) => {
  return (
    <ul className="style-none d-flex flex-wrap align-items-center justify-content-between">
      <li>
        <Image src={icon_1} alt="" className="lazy-img icon" />
        <span className="fs-20 color-dark">
          Sqft . {propetydetails.sqrft || "-"}
        </span>
      </li>
      <li>
        <Image src={icon_2} alt="" className="lazy-img icon" />
        <span className="fs-20 color-dark">
          Bed . {propetydetails.beds || "-"}
        </span>
      </li>
      <li>
        <Image src={icon_3} alt="" className="lazy-img icon" />
        <span className="fs-20 color-dark">
          Bath . {propetydetails.bathroom || "-"}
        </span>
      </li>
      <li>
        <Image src={icon_4} alt="" className="lazy-img icon" />
        <span className="fs-20 color-dark">Kitchen . -</span>
      </li>
      <li>
        <Image src={icon_5} alt="" className="lazy-img icon" />
        <span className="fs-20 color-dark">
          Type . {propetydetails.property_title || "-"}
        </span>
      </li>
    </ul>
  );
};

export default CommonPropertyOverview;
