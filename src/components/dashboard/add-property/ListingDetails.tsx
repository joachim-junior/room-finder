import NumberNiceSelect from "@/ui/NumberNiceSelect";

interface ListingDetailsProps {
  formData: any;
  onFormDataChange: (section: string, field: string, value: any) => void;
}

const ListingDetails = ({
  formData,
  onFormDataChange,
}: ListingDetailsProps) => {
  const selectHandler = (e: any) => {};

  return (
    <div className="bg-white card-box border-20 mt-40">
      <h4 className="dash-title-three">Listing Details</h4>
      <div className="row align-items-end">
        <div className="col-md-6">
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="size">Size in ft*</label>
            <input
              type="text"
              id="size"
              placeholder="Ex: 3,210 sqft"
              value={formData.size}
              onChange={(e) => onFormDataChange("", "size", e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="bedrooms">Bedrooms*</label>
            <NumberNiceSelect
              className="nice-select"
              options={[
                { value: 0, text: 0 },
                { value: 1, text: 1 },
                { value: 2, text: 2 },
                { value: 3, text: 3 },
                { value: 4, text: 4 },
                { value: 5, text: 5 },
              ]}
              defaultCurrent={0}
              onChange={(e) => onFormDataChange("", "bedrooms", e)}
              name="bedrooms"
              placeholder=""
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="bathrooms">Bathrooms*</label>
            <NumberNiceSelect
              className="nice-select"
              options={[
                { value: 0, text: 0 },
                { value: 1, text: 1 },
                { value: 2, text: 2 },
                { value: 3, text: 3 },
                { value: 4, text: 4 },
                { value: 5, text: 5 },
              ]}
              defaultCurrent={0}
              onChange={(e) => onFormDataChange("", "bathrooms", e)}
              name="bathrooms"
              placeholder=""
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="kitchens">Kitchens*</label>
            <NumberNiceSelect
              className="nice-select"
              options={[
                { value: 0, text: 0 },
                { value: 1, text: 1 },
                { value: 2, text: 2 },
                { value: 3, text: 3 },
              ]}
              defaultCurrent={0}
              onChange={(e) => onFormDataChange("", "kitchens", e)}
              name="kitchens"
              placeholder=""
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="garages">Garages</label>
            <NumberNiceSelect
              className="nice-select"
              options={[
                { value: 0, text: 0 },
                { value: 1, text: 1 },
                { value: 2, text: 2 },
                { value: 3, text: 3 },
                { value: 4, text: 4 },
              ]}
              defaultCurrent={0}
              onChange={(e) => onFormDataChange("", "garages", e)}
              name="garages"
              placeholder=""
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="garage_size">Garage Size</label>
            <input
              type="text"
              id="garage_size"
              placeholder="Ex: 1,230 sqft"
              value={formData.garage_size}
              onChange={(e) =>
                onFormDataChange("", "garage_size", e.target.value)
              }
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="year_built">Year Built*</label>
            <input
              type="text"
              id="year_built"
              placeholder="Type Year"
              value={formData.year_built}
              onChange={(e) =>
                onFormDataChange("", "year_built", e.target.value)
              }
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="floors">Floors No*</label>
            <NumberNiceSelect
              className="nice-select"
              options={[
                { value: 0, text: 0 },
                { value: 1, text: 1 },
                { value: 2, text: 2 },
                { value: 3, text: 3 },
                { value: 4, text: 4 },
                { value: 5, text: 5 },
              ]}
              defaultCurrent={0}
              onChange={(e) => onFormDataChange("", "floors", e)}
              name="floors"
              placeholder=""
            />
          </div>
        </div>
        <div className="col-12">
          <div className="dash-input-wrapper">
            <label htmlFor="listing_description">Description*</label>
            <textarea
              className="size-lg"
              id="listing_description"
              placeholder="Write about property..."
              value={formData.listing_description || ""}
              onChange={(e) =>
                onFormDataChange("", "listing_description", e.target.value)
              }
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
