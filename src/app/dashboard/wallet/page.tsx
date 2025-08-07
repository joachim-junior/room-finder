import DashboardWallet from "@/components/dashboard/wallet";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Dashboard Wallet - Roomfinder",
};

const WalletPage = () => {
  return (
    <Wrapper>
      <DashboardWallet />
    </Wrapper>
  );
};

export default WalletPage;
