// import React, { useEffect, useState } from 'react'
// import Select from './Select'
// import { apiGetPublicProvinces, apiGetPublicDistrict } from '../apis/app'

// const Address = ({ onAddressChange }) => {
//   const [provinces, setProvinces] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [province, setProvince] = useState();
//   const [district, setDistrict] = useState();
//   const [reset, setReset] = useState(false);
//   const [houseNumber, setHouseNumber] = useState('');

//   const fetchPublicProvinces = async () => {
//     const response = await apiGetPublicProvinces()
//     if(response.status === 200){
//       setProvinces(response?.data?.results)
//     }
//   }

//   const fetchPublicDistrict = async () => {
//     const response = await apiGetPublicDistrict(province)
//     if(response.status === 200) {
//       setDistricts(response?.data?.results)
//     }
//   }

//   useEffect(() => { 
//     fetchPublicProvinces()
//   }, [])

//   useEffect(() => { 
//     setDistrict(null);
//     province && fetchPublicDistrict();
//     !province ? setReset(true) : setReset(false);
//     !province && setDistricts([]);
//   }, [province])
  
//   const deliveryAddress = [
//     houseNumber ? houseNumber.trim() : '',
//     district
//       ? districts?.find((item) => item.district_id === district)?.district_name
//       : '',
//     province
//       ? provinces?.find((item) => item.province_id === province)?.province_name
//       : '',
//   ]
//     .filter(Boolean)
//     .join(', ');

//   // Update parent component whenever address changes
//   useEffect(() => {
//     onAddressChange && onAddressChange(deliveryAddress);
//   }, [deliveryAddress, onAddressChange]);

//   return (
//     <div className="flex gap-8">
//       <div className="flex flex-col flex-1 gap-8">
//         <div className="flex items-center gap-4">
//           <Select type="province" value={province} setValue={setProvince} label="Tỉnh/Thành phố" options={provinces} />
//           <Select reset={reset} type="district" value={district} setValue={setDistrict} label="Quận/Huyện" options={districts} />
//         </div>
//         <div className="flex flex-col gap-2">
//           <label className="font-semibold" htmlFor="house-number">Số nhà, tên đường</label>
//           <input
//             id="house-number"
//             placeholder="Ví dụ: 268 Lý Thường Kiệt, Phường 14"
//             className="w-full p-2 border border-gray-200 rounded-md shadow-inner outline-none"
//             value={houseNumber}
//             onChange={(e) => setHouseNumber(e.target.value)}
//           />
//         </div>
//         <div className="flex flex-col gap-2">
//           <label className="font-semibold" htmlFor="exactly-address">Địa chỉ giao hàng</label>
//           <input
//             id="exactly-address"
//             readOnly
//             className="w-full p-2 bg-gray-300 border border-gray-200 rounded-md shadow-inner outline-none"
//             value={deliveryAddress}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Address;