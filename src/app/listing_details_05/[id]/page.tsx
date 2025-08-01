import ListingDetailsFiveArea from "@/components/ListingDetails/listing-details-5/ListingDetailsFiveArea";
import Wrapper from "@/layouts/Wrapper";
import { notFound } from "next/navigation";

async function getProperty(id: string) {
  const res = await fetch(
    "https://cpanel.roomfinder237.com/user_api/u_property_details.php",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pro_id: id,
        uid: "0",
      }),
    }
  );
  const data = await res.json();
  if (data.Result === "true" && data.propetydetails) {
    return data;
  }
  return null;
}

export default async function PropertyDetails({
  params,
}: {
  params: { id: string };
}) {
  const propertyData = await getProperty(params.id);
  if (!propertyData) return notFound();

  return (
    <Wrapper>
      <ListingDetailsFiveArea propertyData={propertyData} />
    </Wrapper>
  );
}
