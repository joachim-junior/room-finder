import DashboardMessage from "@/components/dashboard/message";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Dashboard Message - Roomfinder",
};

const MessagePage = () => {
  return (
    <Wrapper>
      <DashboardMessage />
    </Wrapper>
  );
};

export default MessagePage;
