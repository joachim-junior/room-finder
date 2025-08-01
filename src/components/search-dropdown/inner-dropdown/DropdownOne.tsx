import NiceSelect from "@/ui/NiceSelect";
import PriceRange from "../../common/PriceRange";
import Link from "next/link";
import { useEffect, useState } from "react";

const DropdownOne = ({
  handleBathroomChange,
  handleBedroomChange,
  handleSearchChange,
  handlePriceChange,
  maxPrice,
  priceValue,
  handleResetFilter,
  selectedAmenities,
  handleAmenityChange,
  handleLocationChange,
  handleStatusChange,
  propertyTypes = [],
  facilities = [],
  countries = [],
  filterOptionsLoading = false,
}: any) => {
  // Convert API data to NiceSelect options format
  const propertyTypeOptions = propertyTypes.map((type: any) => ({
    value: type.id.toString(),
    text: type.title,
  }));

  const countryOptions = countries.map((country: any) => ({
    value: country.id.toString(),
    text: country.name,
  }));

  const facilityOptions = facilities.map((facility: any) => ({
    value: facility.id.toString(),
    text: facility.title,
  }));

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="row gx-lg-5">
        <div className="col-12">
          <div className="input-box-one mb-35">
            <div className="label">Property Type</div>
            <NiceSelect
              className="nice-select fw-normal"
              options={[
                { value: "0", text: "All Types" },
                ...propertyTypeOptions,
              ]}
              defaultCurrent={0}
              onChange={handleStatusChange}
              name=""
              placeholder=""
            />
          </div>
        </div>

        <div className="col-12">
          <div className="input-box-one mb-35">
            <div className="label">Keyword</div>
            <input
              onChange={handleSearchChange}
              type="text"
              placeholder="Search properties..."
              className="type-input"
            />
          </div>
        </div>

        {countries.length > 0 && (
          <div className="col-12">
            <div className="input-box-one mb-50">
              <div className="label">Location</div>
              <NiceSelect
                className="nice-select location fw-normal"
                options={[
                  { value: "0", text: "All Locations" },
                  ...countryOptions,
                ]}
                defaultCurrent={0}
                onChange={handleLocationChange}
                name=""
                placeholder=""
              />
            </div>
          </div>
        )}

        <div className="col-sm-6">
          <div className="input-box-one mb-40">
            <div className="label">Bedroom</div>
            <NiceSelect
              className="nice-select fw-normal"
              options={[
                { value: "0", text: "Any" },
                { value: "1", text: "1" },
                { value: "2", text: "2" },
                { value: "3", text: "3" },
                { value: "4", text: "4" },
                { value: "5", text: "5+" },
              ]}
              defaultCurrent={0}
              onChange={handleBedroomChange}
              name=""
              placeholder=""
            />
          </div>
        </div>

        <div className="col-sm-6">
          <div className="input-box-one mb-40">
            <div className="label">Bath</div>
            <NiceSelect
              className="nice-select fw-normal"
              options={[
                { value: "0", text: "Any" },
                { value: "1", text: "1" },
                { value: "2", text: "2" },
                { value: "3", text: "3" },
                { value: "4", text: "4" },
                { value: "5", text: "5+" },
              ]}
              defaultCurrent={0}
              onChange={handleBathroomChange}
              name=""
              placeholder=""
            />
          </div>
        </div>

        <div className="col-12">
          <h6 className="block-title fw-bold mb-30">Amenities</h6>
          {filterOptionsLoading ? (
            <div className="text-center py-3">Loading amenities...</div>
          ) : (
            <ul className="style-none d-flex flex-wrap justify-content-between filter-input">
              {facilities.map((facility: any, i: number) => (
                <li key={i}>
                  <input
                    type="checkbox"
                    name="Amenities"
                    value={facility.title}
                    checked={selectedAmenities.includes(facility.title)}
                    onChange={handleAmenityChange}
                  />
                  <label>{facility.title}</label>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-12">
          <h6 className="block-title fw-bold mt-25 mb-15">Price range</h6>
          <div className="price-ranger">
            <div className="price-input d-flex align-items-center justify-content-between pt-5">
              <div className="field d-flex align-items-center">
                <input
                  type="number"
                  className="input-min"
                  value={priceValue[0]}
                  onChange={() => handlePriceChange}
                />
              </div>
              <div className="divider-line"></div>
              <div className="field d-flex align-items-center">
                <input
                  type="number"
                  className="input-max"
                  value={priceValue[1]}
                  onChange={() => handlePriceChange}
                />
              </div>
              <div className="currency ps-1">XAF</div>
            </div>
          </div>
          <PriceRange
            MAX={maxPrice}
            MIN={0}
            STEP={1}
            values={priceValue}
            handleChanges={handlePriceChange}
          />
        </div>

        <div className="col-12">
          <h6 className="block-title fw-bold mt-45 mb-20">SQFT</h6>
          <div className="d-flex align-items-center sqf-ranger">
            <input type="text" placeholder="Min" />
            <div className="divider"></div>
            <input type="text" placeholder="Max" />
          </div>
        </div>
        <div className="col-12">
          <button className="fw-500 text-uppercase tran3s apply-search w-100 mt-40 mb-25">
            <i className="fa-light fa-magnifying-glass"></i>
            <span>Search</span>
          </button>
        </div>

        <div className="col-12">
          <div className="d-flex justify-content-between form-widget">
            <a
              onClick={handleResetFilter}
              style={{ cursor: "pointer" }}
              className="tran3s"
            >
              <i className="fa-regular fa-arrows-rotate"></i>
              <span>Reset Filter</span>
            </a>
            <Link href="#" className="tran3s">
              <i className="fa-regular fa-star"></i>
              <span>Save Search</span>
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DropdownOne;
