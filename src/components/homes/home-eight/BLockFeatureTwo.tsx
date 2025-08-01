import Image from "next/image"
import feature_data from "@/data/home-data/FeatureData"

const BLockFeatureTwo = () => {
   return (
      <div className="block-feature-fourteen pt-120 xl-pt-100 pb-140 xl-pb-100 mt-170 xl-mt-120">
         <div className="container container-large">
            <div className="title-one text-center wow fadeInUp">
               <h3 className="text-white">Why Choose Us</h3>
               <p className="fs-24 mt-xs text-white">Your leading real estate advocate, transforming houses into dreams. </p>
            </div>

            <div className="card-bg-wrapper wow fadeInUp mt-70 lg-mt-50">
               <div className="row">
                  {feature_data.filter((items) => items.page === "home_6_feature_1").map((item) => (
                     <div key={item.id} className="col-lg-4">
                        <div className="card-style-eight mt-45 wow fadeInUp">
                           <div className="d-flex align-items-start pe-xxl-5">
                              <Image src={item.icon ? item.icon : ""} alt="" className="lazy-img icon" />
                              <div className="text">
                                 <h5 className="text-white">{item.title}</h5>
                                 <p>{item.desc}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   )
}

export default BLockFeatureTwo
