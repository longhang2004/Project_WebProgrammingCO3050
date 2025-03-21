
import Slider from "react-slick";

const BannerProduct = () => {
  const settings = {
    dots: true, 
    infinite: true, 
    speed: 500, 
    slidesToShow: 1, 
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 2000, 
    arrows: false, 
  };

  const banners = [
    { id: 1, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/intel%20gen%2013.png", alt: "Banner 1" },
    { id: 2, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/cate-acer-06-11.png", alt: "Banner 2" },
    { id: 3, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/msi-cate-20-11-sieu-deal-cuoi-nam-new.jpg", alt: "Banner 3" },
  ];
  const secondBanners = [
    { id: 1, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/cate-imac-04-11.jpg", alt: "Banner 1" },
    { id: 2, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/cate-acer-06-11.png", alt: "Banner 2" },
    { id: 3, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/intel%20evo.png", alt: "Banner 3" },
  ];

  return (
    <div className="flex gap-4 mb-12">
      {/* Slider 1 */}
      <div className="w-1/2 overflow-hidden">
        <Slider {...settings}>
          {banners.map((banner) => (
            <div key={banner.id}>
              <img
                src={banner.image}
                alt={banner.alt}
                className="object-cover rounded-lg shadow-md"
              />
            </div>
          ))}
        </Slider>
      </div>
  
      {/* Slider 2 */}
      <div className="w-1/2 overflow-hidden">
        <Slider {...settings}>
          {secondBanners.map((banner) => (
            <div key={banner.id}>
              <img
                src={banner.image}
                alt={banner.alt}
                className="object-cover rounded-lg shadow-md"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BannerProduct;