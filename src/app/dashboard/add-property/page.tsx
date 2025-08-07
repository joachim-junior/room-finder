import DashboardAddProperty from "@/components/dashboard/add-property";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Dashboard Add Property - Roomfinder",
};

const AddPropertyPage = () => {
  return (
    <Wrapper>
      <DashboardAddProperty />
    </Wrapper>
  );
};

export default AddPropertyPage;
