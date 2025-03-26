import FixedBanner from "../../components/FixedBanner";
import ProductList from "../../components/ProductList";
import BannerSlider from "../../components/SliderBanner";

function ProductsHome() {
  return (<>
        <BannerSlider />
        <ProductList />
        <FixedBanner />
    </>
  );
}

export default ProductsHome;