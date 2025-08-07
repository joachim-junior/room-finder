import DashboardProfile from "@/components/dashboard/profile";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Dashboard Profile - Roomfinder",
};

const ProfilePage = () => {
  return (
    <Wrapper>
      <DashboardProfile />
    </Wrapper>
  );
};

export default ProfilePage;
