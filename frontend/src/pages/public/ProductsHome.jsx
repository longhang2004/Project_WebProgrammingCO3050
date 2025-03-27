import FixedBanner from "../../components/FixedBanner";
import ProductList from "../../components/ProductList";
import BannerSlider from "../../components/SliderBanner";

function ProductsHome() {
  return (<div>
        <BannerSlider />
        <ProductList productsList={Array(20).fill({
    name: "Vivo X200 Pro",
    price: "1.000.000đ",
    image: "https://cdn.mobilecity.vn/mobilecity-vn/images/2024/10/w300/vivo-x200-pro-xanh-duong.jpg.webp",
  })}/>
        <FixedBanner />
    </div>
  );
}

export default ProductsHome;