import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar'; // Giả định có sẵn

function ProductDetail() {
  // const { id } = useParams();
  const [product, setProduct] = useState({
    category: "Phone",
    name: "Vivo X200 Pro",
    images: ["https://cdn.mobilecity.vn/mobilecity-vn/images/2024/10/w300/vivo-x200-pro-xanh-duong.jpg.webp"],
    priceVariants: [
      { color: 'Black', storage: '64GB', price: 10000000 },
      { color: 'Black', storage: '128GB', price: 12000000 },
      { color: 'White', storage: '64GB', price: 10000000 },
      { color: 'White', storage: '128GB', price: 12000000 },
    ],
    // specs: {
    //   screen: '6.7 inch',
    //   camera: '64MP',
    //   battery: '5000mAh',
    //   os: 'Android 11',
    // },
    specs: ['6.7 inch', '64MP', '5000mAh', 'Android 11'],
    detailSpecs: {
      screen: '6.7 inch',
      camera: '64MP',
      battery: '5000mAh',
      os: 'Android 11',
    },
    promotion: "Giảm 10% khi mua online",
    colors: ['Black', 'White'],
    storage: ['64GB', '128GB'],
    comments: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Black');
  const [selectedStorage, setSelectedStorage] = useState('64GB');
  const [currentPrice, setCurrentPrice] = useState('');

  // useEffect(() => {
  //   fetch(`/api/product/${id}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setProduct(data);
  //       setSelectedColor(data.colors[0]);
  //       setSelectedStorage(data.storage[0]);
  //       setCurrentPrice(data.price);
  //       setLoading(false);
  //     })
  //     .catch((err) => console.error(err));
  // }, [id]);

  useEffect(() => {
    if (product) {
      const variant = product.priceVariants.find(
        (v) => v.color === selectedColor && v.storage === selectedStorage
      );
      if (variant) {
        setCurrentPrice(variant.price);
      }
    }
  }, [selectedColor, selectedStorage, product]);

  // if (loading) return <p>Đang tải...</p>;

  return (
    <div className="min-h-screen flex flex-col text-black">
      <div className="md:px-[100px] my-8 flex-1">
        {/* Tab đường dẫn */}
        <div className="text-white mb-4">
          <span>{product.category}</span> &gt; <span>{product.name}</span>
        </div>
        {/* Tên và đánh giá */}
        <div className="flex items-center mb-4">
          <h1 className="text-2xl text-white font-bold">{product.name}</h1>
          <div className="ml-4 flex items-center">
            <span className="text-yellow-500">★★★★☆</span>
            <span className="ml-2 text-white">(4.5/5)</span>
          </div>
        </div>
        {/* Grid 2 cột */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cột trái */}
          <div className='bg-white p-4 border rounded'>
            <div className="mb-4">
              <img src={product.images[0]} alt={product.name} className="w-full h-96 object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Thông số kỹ thuật</h2>
              <ul>
                {/* {product.specs.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))} */}
                {Object.entries(product.detailSpecs).map(([key, value], index) => (
                  <li key={index}>
                    <span className="font-bold">{key}:</span> {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Cột phải */}
          <div className='bg-white p-4 border rounded'>
            <h2 className="text-3xl font-bold text-red-500 mb-2">{currentPrice}</h2>
            <p className="mb-4">{product.promotion}</p>
            <div className="mb-4">
              <label className="block mb-2">Chọn màu:</label>
              <div className="flex gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-blue-900 rounded ${selectedColor === color ? 'bg-blue-400' : ''}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Chọn bộ nhớ:</label>
              <div className="flex gap-2">
                {product.storage.map((storage, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedStorage(storage)}
                    className={`px-4 py-2 border-blue-900 rounded ${selectedStorage === storage ? 'bg-blue-400' : ''}`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <button className="bg-blue-500 text-white px-6 py-2 rounded">Thêm vào giỏ hàng</button>
              <button className="bg-green-500 text-white px-6 py-2 rounded">Mua hàng</button>
            </div>
          </div>
        </div>
        {/* Phần bình luận */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Bình luận của khách hàng</h2>
          {product.comments.map((comment, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <p className="font-bold">{comment.user}</p>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;