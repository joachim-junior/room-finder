import DashboardReferral from "@/components/dashboard/referral";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Dashboard Referral - Roomfinder",
};

const ReferralPage = () => {
  return (
    <Wrapper>
      <DashboardReferral />
    </Wrapper>
  );
};

export default ReferralPage;
