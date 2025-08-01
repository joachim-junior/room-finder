import NiceSelect from "@/ui/NiceSelect";

interface OverviewProps {
  formData: any;
  onFormDataChange: (section: string, field: string, value: any) => void;
  propertyTypes: any[];
}

const Overview = ({
  formData,
  onFormDataChange,
  propertyTypes,
}: OverviewProps) => {
  const selectHandler = (e: any) => {};

  return (
    <div className="bg-white card-box border-20">
      <h4 className="dash-title-three">Overview</h4>
      <div className="dash-input-wrapper mb-30">
        <label htmlFor="title">Property Title*</label>
        <input
          type="text"
          id="title"
          placeholder="Your Property Name"
          value={formData.title}
          onChange={(e) => onFormDataChange("", "title", e.target.value)}
        />
      </div>
      <div className="dash-input-wrapper mb-30">
        <label htmlFor="description">Description*</label>
        <textarea
          className="size-lg"
          id="description"
          placeholder="Write about property..."
          value={formData.description}
          onChange={(e) => onFormDataChange("", "description", e.target.value)}
        ></textarea>
      </div>
      <div className="row align-items-end">
        <div className="col-md-6">
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="category">Category*</label>
            <NiceSelect
              className="nice-select"
              options={propertyTypes.map((type) => ({
                value: type.id.toString(),
                text: type.title,
              }))}
              defaultCurrent={0}
              onChange={(e) => onFormDataChange("", "category", e)}
              name="category"
              placeholder=""
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="listed_in">Listed in*</label>
            <NiceSelect
              className="nice-select"
              options={[
                { value: "rent", text: "Rent" },
                { value: "sell", text: "Sell" },
                { value: "buy", text: "Buy" },
              ]}
              defaultCurrent={0}
              onChange={(e) => onFormDataChange("", "listed_in", e)}
              name="listed_in"
              placeholder=""
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="price">Price*</label>
            <input
              type="text"
              id="price"
              placeholder="Your Price"
              value={formData.price}
              onChange={(e) => onFormDataChange("", "price", e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="yearly_tax_rate">Yearly Tax Rate*</label>
            <input
              type="text"
              id="yearly_tax_rate"
              placeholder="Tax Rate"
              value={formData.yearly_tax_rate}
              onChange={(e) =>
                onFormDataChange("", "yearly_tax_rate", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
