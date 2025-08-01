import Link from "next/link";
import Image from "next/image";
import DeleteModal from "@/modals/DeleteModal";

import profileIcon_1 from "@/assets/images/dashboard/icon/icon_23.svg";
import profileIcon_2 from "@/assets/images/dashboard/icon/icon_24.svg";
import profileIcon_3 from "@/assets/images/dashboard/icon/icon_25.svg";

const Profile = () => {
  const handleDeleteAccount = (e: React.MouseEvent) => {
    e.preventDefault();
    // Trigger custom event to open delete modal
    const event = new CustomEvent("openDeleteModal");
    document.dispatchEvent(event);
  };

  return (
    <>
      <div className="user-name-data">
        <ul className="dropdown-menu" aria-labelledby="profile-dropdown">
          <li>
            <Link
              className="dropdown-item d-flex align-items-center"
              href="/dashboard/account-settings"
            >
              <Image src={profileIcon_2} alt="" className="lazy-img" />
              <span className="ms-2 ps-1">Account Settings</span>
            </Link>
          </li>
          <li>
            <button
              className="dropdown-item d-flex align-items-center"
              onClick={handleDeleteAccount}
              style={{
                background: "none",
                border: "none",
                width: "100%",
                textAlign: "left",
              }}
            >
              <Image src={profileIcon_3} alt="" className="lazy-img" />
              <span className="ms-2 ps-1">Delete Account</span>
            </button>
          </li>
        </ul>
      </div>
      <DeleteModal />
    </>
  );
};

export default Profile;
