import Image, { StaticImageData } from "next/image";

import icon_1 from "@/assets/images/dashboard/icon/icon_28.svg";

interface DataType {
  id: number;
  name: string;
  date: string;
  title: string;
  desc: string;
  icon?: StaticImageData;
  class_name?: string;
}

interface RecentMessageProps {
  recent_activity?: any[];
}

const RecentMessage = ({ recent_activity = [] }: RecentMessageProps) => {
  // Transform API data to match the component's expected format
  const message_data: DataType[] =
    recent_activity.length > 0
      ? recent_activity.map((activity, index) => ({
          id: activity.id || index + 1,
          name: `Activity ${activity.type || "unknown"}`,
          date: new Date(activity.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          title: `${activity.type || "Activity"} - ${
            activity.user_id || "User"
          }`,
          desc: `Recent activity recorded on ${new Date(
            activity.created_at
          ).toLocaleDateString()}`,
          class_name: index === 0 ? "primary" : "read border-0 pt-0",
        }))
      : [
          {
            id: 1,
            name: "No Recent Activity",
            date: "Today",
            title: "No recent messages or activities",
            desc: "You haven't had any recent activity. Check back later for updates.",
            class_name: "read border-0 pt-0",
          },
        ];

  return (
    <div className="message-wrapper">
      <div className="message-sidebar border-0">
        <div className="email-read-panel">
          {message_data.map((item) => (
            <div key={item.id} className={`email-list-item ${item.class_name}`}>
              <div className="email-short-preview position-relative p-3">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div
                    className="sender-name fw-bold"
                    style={{ fontSize: "14px" }}
                  >
                    {item.name}
                  </div>
                  <div className="date text-muted" style={{ fontSize: "12px" }}>
                    {item.date}
                  </div>
                </div>
                <div
                  className="mail-sub fw-semibold mt-2"
                  style={{ fontSize: "13px" }}
                >
                  {item.title}
                </div>
                <div
                  className="mail-text text-muted mt-1"
                  style={{ fontSize: "12px", lineHeight: "1.4" }}
                >
                  {item.desc}
                </div>
                {item.icon && (
                  <div className="attached-file-preview d-flex align-items-center mt-3">
                    <div className="file d-flex align-items-center me-2">
                      <Image
                        src={item.icon}
                        alt=""
                        className="lazy-img me-2"
                        style={{ width: "16px", height: "16px" }}
                      />
                      <span style={{ fontSize: "11px" }}>details.pdf</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentMessage;
