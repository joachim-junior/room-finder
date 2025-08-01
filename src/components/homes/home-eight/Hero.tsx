"use client"
import Image from "next/image"

import icon_1 from "@/assets/images/icon/icon_75.svg"

const Hero = () => {
   return (
      <div className="hero-banner-eight z-1 pt-250 xl-pt-200 pb-250 xl-pb-150 lg-pb-100 position-relative">
         <div className="container position-relative">
            <div className="row">
               <div className="col-xl-9 col-lg-10 col-md-10 m-auto">
                  <h1 className="hero-heading text-white text-center wow fadeInUp">Find the Right <br /> Home for Your Family</h1>
                  <p className="fs-24 text-white text-center pt-35 wow fadeInUp" data-wow-delay="0.1s">We’ve more than 745,000 apartments, place & plot.</p>
               </div>
            </div>
            <div className="search-wrapper-four me-auto ms-auto mt-45 lg-mt-20 position-relative">
               <nav className="d-flex justify-content-center">
                  <div className="nav nav-tabs border-0" role="tablist">
                     <button className="nav-link active" id="buy-tab" data-bs-toggle="tab" data-bs-target="#buy" type="button" role="tab" aria-controls="buy" aria-selected="true">Rent</button>
                     <button className="nav-link" id="rent-tab" data-bs-toggle="tab" data-bs-target="#rent" type="button" role="tab" aria-controls="rent" aria-selected="false">SAle</button>
                  </div>
               </nav>
               <div className="bg-wrapper mt-30">
                  <div className="tab-content">
                     <div className="tab-pane fade show active" id="buy" role="tabpanel" aria-labelledby="buy-tab" tabIndex={0}>
                        <form onSubmit={(e) => e.preventDefault()} className="position-relative z-1">
                           <input type="text" placeholder="Type location name here..." />
                           <button className="tran3s"><Image src="" alt="" className="m-auto" /></button>
                        </form>
                     </div>
                     <div className="tab-pane fade" id="rent" role="tabpanel" aria-labelledby="rent-tab" tabIndex={0}>
                        <form onSubmit={(e) => e.preventDefault()} className="position-relative z-1">
                           <input type="text" placeholder="Type location name here..." />
                           <button className="tran3s"><Image src={icon_1} alt="" className="m-auto" /></button>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Hero
