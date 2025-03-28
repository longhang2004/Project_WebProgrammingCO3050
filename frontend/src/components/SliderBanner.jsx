function BannerSlider() {
    return (
      <div className="md:px-[100px] my-4">
        <div className="relative w-full h-64 overflow-hidden flex justify-between">
          <img src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/17/58/17580fa67278ff7a25e05b3c310a40e5.png" alt="Banner 1" className="w-1/2 h-full object-contain border-white" />
          <img src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/17/58/17580fa67278ff7a25e05b3c310a40e5.png" alt="Banner 1" className="w-1/2 h-full object-contain border-white hidden sm:block" />
        </div>
      </div>
    );
  }
  
  export default BannerSlider;