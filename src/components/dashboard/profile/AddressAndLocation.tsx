import NiceSelect from "@/ui/NiceSelect";

interface AddressAndLocationProps {
  formData: any;
  onFormDataChange: (section: string, field: string, value: any) => void;
}

const AddressAndLocation = ({
  formData,
  onFormDataChange,
}: AddressAndLocationProps) => {
  const selectHandler = (e: any) => {};

  return (
    <div className="bg-white card-box border-20 mt-40">
      <h4 className="dash-title-three">Address & Location</h4>
      <div className="row">
        <div className="col-12">
          <div className="dash-input-wrapper mb-25">
            <label htmlFor="address">Address*</label>
            <input
              type="text"
              id="address"
              placeholder="19 Yawkey Way"
              value={formData.address}
              onChange={(e) => onFormDataChange("", "address", e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="dash-input-wrapper mb-25">
            <label htmlFor="country">Country*</label>
            <NiceSelect
              className="nice-select"
              options={[
                { value: "1", text: "Afghanistan" },
                { value: "2", text: "Albania" },
                { value: "3", text: "Algeria" },
                { value: "4", text: "Andorra" },
                { value: "5", text: "Angola" },
                { value: "6", text: "Antigua and Barbuda" },
                { value: "7", text: "Argentina" },
                { value: "8", text: "Armenia" },
                { value: "9", text: "Australia" },
                { value: "10", text: "Austria" },
                { value: "11", text: "Azerbaijan" },
                { value: "12", text: "Bahamas" },
                { value: "13", text: "Bahrain" },
                { value: "14", text: "Bangladesh" },
                { value: "15", text: "Barbados" },
                { value: "16", text: "Belarus" },
                { value: "17", text: "Belgium" },
                { value: "18", text: "Belize" },
                { value: "19", text: "Benin" },
                { value: "20", text: "Bhutan" },
              ]}
              defaultCurrent={0}
              onChange={(e) => onFormDataChange("", "country", e)}
              name="country"
              placeholder=""
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="dash-input-wrapper mb-25">
            <label htmlFor="city">City*</label>
            <input
              type="text"
              id="city"
              placeholder="Enter city name"
              value={formData.city}
              onChange={(e) => onFormDataChange("", "city", e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="dash-input-wrapper mb-25">
            <label htmlFor="zip_code">Zip Code*</label>
            <input
              type="number"
              id="zip_code"
              placeholder="1708"
              value={formData.zip_code}
              onChange={(e) => onFormDataChange("", "zip_code", e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div className="dash-input-wrapper mb-25">
            <label htmlFor="state">State*</label>
            <input
              type="text"
              id="state"
              placeholder="Enter state name"
              value={formData.state}
              onChange={(e) => onFormDataChange("", "state", e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="dash-input-wrapper mb-25">
            <label htmlFor="latitude">Latitude*</label>
            <input
              type="number"
              id="latitude"
              step="any"
              placeholder="4.0511"
              value={formData.latitude}
              onChange={(e) => onFormDataChange("", "latitude", e.target.value)}
            />
            <small className="text-muted">
              Enter latitude coordinate (e.g., 4.0511)
            </small>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="dash-input-wrapper mb-25">
            <label htmlFor="longitude">Longitude*</label>
            <input
              type="number"
              id="longitude"
              step="any"
              placeholder="9.7679"
              value={formData.longitude}
              onChange={(e) =>
                onFormDataChange("", "longitude", e.target.value)
              }
            />
            <small className="text-muted">
              Enter longitude coordinate (e.g., 9.7679)
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressAndLocation;
