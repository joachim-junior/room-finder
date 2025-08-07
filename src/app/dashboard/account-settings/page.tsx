import DashboardAccountSettings from "@/components/dashboard/account-settings";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Dashboard Account Settings - Roomfinder",
};

const AccountSettingsPage = () => {
  return (
    <Wrapper>
      <DashboardAccountSettings />
    </Wrapper>
  );
};

export default AccountSettingsPage;
