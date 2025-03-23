function BannerSlider() {
    return (
      <div className="px-[100px] my-4">
        <div className="relative w-full h-64 overflow-hidden">
          <img src="banner1.jpg" alt="Banner 1" className="w-full h-full object-cover" />
          {/* Bạn có thể thêm logic chuyển ảnh bằng React state hoặc thư viện như react-slick */}
        </div>
      </div>
    );
  }
  
  export default BannerSlider;