import DashboardBookings from "@/components/dashboard/bookings";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Dashboard Bookings - Roomfinder",
};

const BookingsPage = () => {
  return (
    <Wrapper>
      <DashboardBookings />
    </Wrapper>
  );
};

export default BookingsPage;
