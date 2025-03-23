import Header from "../../components/Header";
import ProductList from "../../components/ProductList";
import BannerSlider from "../../components/SliderBanner";

function ProductsHome() {
  return (<>
        <BannerSlider />
        <ProductList />
        <Header />
    </>
  );
}

export default ProductsHome;