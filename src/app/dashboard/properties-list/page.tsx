import DashboardPropertiesList from "@/components/dashboard/properties-list";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Dashboard Properties List - Roomfinder",
};

const PropertiesListPage = () => {
  return (
    <Wrapper>
      <DashboardPropertiesList />
    </Wrapper>
  );
};

export default PropertiesListPage;
