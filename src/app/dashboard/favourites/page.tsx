import DashboardFavourites from "@/components/dashboard/favourites";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Dashboard Favourites - Roomfinder",
};

const FavouritesPage = () => {
  return (
    <Wrapper>
      <DashboardFavourites />
    </Wrapper>
  );
};

export default FavouritesPage;
