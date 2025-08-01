const CommonAmenities = ({ facility }: { facility: any[] }) => {
  return (
    <>
      <h4 className="mb-20">Amenities</h4>
      {facility && facility.length > 0 ? (
        <ul className="style-none d-flex flex-wrap justify-content-between list-style-two">
          {facility.map((item, i) => (
            <li key={i}>{item.title}</li>
          ))}
        </ul>
      ) : (
        <p className="fs-20 lh-lg pb-25">No amenities listed.</p>
      )}
    </>
  );
};

export default CommonAmenities;
