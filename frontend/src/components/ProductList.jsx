function ProductList() {
    const products = Array(20).fill({
      name: "Sản phẩm",
      price: "1.000.000đ",
      image: "product.jpg",
    });
  
    return (
      <div className="px-[100px] my-8">
        <h2 className="text-2xl font-bold mb-4">Sản phẩm hot</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={index} className="border rounded-md overflow-hidden shadow-md">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p>{product.price}</p>
                <button className="mt-2 bg-primary text-white px-4 py-2 rounded-md">
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default ProductList;