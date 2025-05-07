import React from 'react';
// Optional: Import icons if you use a library like react-icons
// import { FaCheckCircle, FaUsers, FaLightbulb, FaShippingFast, FaHeadset, FaShieldAlt } from 'react-icons/fa';

function AboutPage() {
  const companyName = "Công ty Điện Tử XYZ"; // Replace with your actual company name
  const yearFounded = 2020; // Replace with the founding year

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800"> {/* Changed background for better contrast */}
      {/* Optional Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Chào Mừng Đến Với {companyName}</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto px-4">
          Nơi công nghệ dẫn đầu và dịch vụ khách hàng là ưu tiên hàng đầu.
        </p>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12"> {/* Use container for better centering */}

        {/* Section 1: Our Story & Mission */}
        <section className="mb-12 bg-white p-6 md:p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-6 text-center md:text-left text-blue-700">Câu Chuyện Của Chúng Tôi</h2>
          <div className="md:flex md:items-center md:space-x-8">
            <div className="md:w-2/3">
              <p className="mb-4 text-lg leading-relaxed">
                {companyName} được thành lập vào năm {yearFounded} bởi một nhóm những người đam mê công nghệ với một mục tiêu đơn giản: mang đến cho khách hàng Việt Nam những sản phẩm điện tử chính hãng, cập nhật nhất với mức giá cạnh tranh và dịch vụ hậu mãi chu đáo.
              </p>
              <p className="mb-4 leading-relaxed">
                Chúng tôi nhận thấy rằng việc tìm kiếm các thiết bị điện tử đáng tin cậy như điện thoại thông minh, máy tính xách tay, và phụ kiện công nghệ cao cấp đôi khi có thể phức tạp. Vì vậy, chúng tôi đã xây dựng {companyName} trở thành điểm đến đáng tin cậy, nơi bạn có thể dễ dàng tìm thấy sản phẩm ưng ý, nhận được tư vấn chuyên nghiệp và trải nghiệm mua sắm trực tuyến mượt mà.
              </p>
              <h3 className="text-2xl font-semibold mt-6 mb-3 text-indigo-600">Tầm Nhìn & Sứ Mệnh</h3>
              <p className="mb-2">
                <strong>Tầm nhìn:</strong> Trở thành nhà bán lẻ điện tử trực tuyến hàng đầu tại Việt Nam, được khách hàng tin tưởng và lựa chọn đầu tiên khi có nhu cầu về các thiết bị công nghệ.
              </p>
              <p>
                <strong>Sứ mệnh:</strong> Cung cấp các sản phẩm điện tử chất lượng cao, chính hãng với giá cả hợp lý; đi kèm dịch vụ tư vấn chuyên sâu và hỗ trợ khách hàng tận tâm, nhằm nâng cao trải nghiệm công nghệ cho mọi người.
              </p>
            </div>
            <div className="md:w-1/3 mt-6 md:mt-0 flex justify-center">
              {/* Placeholder for an image - replace with your own */}
              <img
                src="https://via.placeholder.com/300x250?text=Ảnh+Công+Ty+hoặc+Sản+Phẩm"
                alt="Về chúng tôi - Công ty Điện Tử XYZ"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Why Choose Us? */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-8 text-center text-blue-700">Tại Sao Chọn {companyName}?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1: Quality Products */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300">
              {/* Optional Icon */}
              {/* <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-4" /> */}
              <div className="text-5xl text-green-500 mx-auto mb-4">✓</div> {/* Simple checkmark */}
              <h3 className="text-xl font-semibold mb-2">Sản Phẩm Chính Hãng</h3>
              <p className="text-gray-600">Cam kết 100% sản phẩm điện thoại, laptop và phụ kiện là hàng chính hãng, có nguồn gốc rõ ràng và bảo hành đầy đủ.</p>
            </div>

            {/* Feature 2: Expert Advice */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300">
              {/* Optional Icon */}
              {/* <FaLightbulb className="text-4xl text-yellow-500 mx-auto mb-4" /> */}
               <div className="text-5xl text-yellow-500 mx-auto mb-4">💡</div> {/* Lightbulb emoji */}
              <h3 className="text-xl font-semibold mb-2">Tư Vấn Chuyên Sâu</h3>
              <p className="text-gray-600">Đội ngũ tư vấn viên am hiểu công nghệ, sẵn sàng hỗ trợ bạn lựa chọn sản phẩm phù hợp nhất với nhu cầu.</p>
            </div>

            {/* Feature 3: Competitive Pricing */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300">
               <div className="text-5xl text-red-500 mx-auto mb-4">💲</div> {/* Money emoji */}
              <h3 className="text-xl font-semibold mb-2">Giá Cả Cạnh Tranh</h3>
              <p className="text-gray-600">Chúng tôi liên tục tối ưu quy trình để mang đến mức giá tốt nhất cho các sản phẩm công nghệ hàng đầu.</p>
            </div>

             {/* Feature 4: Fast Shipping */}
             <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300">
              {/* <FaShippingFast className="text-4xl text-blue-500 mx-auto mb-4" /> */}
               <div className="text-5xl text-blue-500 mx-auto mb-4">🚚</div> {/* Truck emoji */}
              <h3 className="text-xl font-semibold mb-2">Giao Hàng Nhanh Chóng</h3>
              <p className="text-gray-600">Hệ thống logistics hiệu quả đảm bảo đơn hàng đến tay bạn trong thời gian ngắn nhất.</p>
            </div>

             {/* Feature 5: Customer Support */}
             <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300">
              {/* <FaHeadset className="text-4xl text-purple-500 mx-auto mb-4" /> */}
              <div className="text-5xl text-purple-500 mx-auto mb-4">🎧</div> {/* Headphone emoji */}
              <h3 className="text-xl font-semibold mb-2">Hỗ Trợ Tận Tâm</h3>
              <p className="text-gray-600">Dịch vụ chăm sóc khách hàng trước, trong và sau khi mua hàng luôn sẵn sàng giải đáp mọi thắc mắc.</p>
            </div>

             {/* Feature 6: Secure Shopping */}
             <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300">
              {/* <FaShieldAlt className="text-4xl text-gray-700 mx-auto mb-4" /> */}
               <div className="text-5xl text-gray-700 mx-auto mb-4">🛡️</div> {/* Shield emoji */}
              <h3 className="text-xl font-semibold mb-2">Mua Sắm An Toàn</h3>
              <p className="text-gray-600">Bảo mật thông tin khách hàng và giao dịch an toàn là ưu tiên hàng đầu của chúng tôi.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Our Commitment */}
        <section className="mb-12 bg-white p-6 md:p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700">Cam Kết Của Chúng Tôi</h2>
          <div className="space-y-4">
            <p className="leading-relaxed">
              <strong className="text-indigo-600">Chất lượng sản phẩm:</strong> Chúng tôi chỉ làm việc với các nhà phân phối uy tín và các thương hiệu lớn để đảm bảo mọi sản phẩm bạn mua đều đạt tiêu chuẩn chất lượng cao nhất. Mỗi sản phẩm đều được kiểm tra kỹ lưỡng trước khi đến tay khách hàng.
            </p>
            <p className="leading-relaxed">
              <strong className="text-indigo-600">Trải nghiệm khách hàng:</strong> Từ giao diện website thân thiện, quy trình đặt hàng đơn giản, đến dịch vụ hỗ trợ nhanh chóng, chúng tôi luôn nỗ lực để mang đến cho bạn trải nghiệm mua sắm trực tuyến tuyệt vời.
            </p>
             <p className="leading-relaxed">
              <strong className="text-indigo-600">Luôn cập nhật:</strong> Thế giới công nghệ thay đổi không ngừng. Đội ngũ của {companyName} luôn cập nhật những xu hướng mới nhất, những sản phẩm tiên tiến nhất để đưa vào danh mục sản phẩm, giúp bạn luôn bắt kịp thời đại.
            </p>
          </div>
        </section>

        {/* Section 4: Our Team (Optional but recommended) */}
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-blue-700">Gặp Gỡ Đội Ngũ</h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg">
            Đằng sau {companyName} là một đội ngũ những người trẻ trung, năng động, và có chung niềm đam mê với công nghệ. Chúng tôi làm việc cùng nhau mỗi ngày để hiện thực hóa sứ mệnh của công ty.
          </p>
          {/* Placeholder for team members - You can create a grid or list here */}
          <div className="flex justify-center items-center bg-gray-200 rounded-lg p-8 h-48">
            <p className="text-gray-500 italic">[Khu vực hiển thị hình ảnh và thông tin đội ngũ]</p>
            {/* Example:
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><img src="..." alt="Member 1" className="rounded-full mx-auto"/><p>Tên 1</p><p className="text-sm text-gray-600">Chức vụ</p></div>
              <div><img src="..." alt="Member 2" className="rounded-full mx-auto"/><p>Tên 2</p><p className="text-sm text-gray-600">Chức vụ</p></div>
              ...
            </div>
            */}
          </div>
        </section>

         {/* Section 5: Call to Action */}
         <section className="text-center py-10 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg shadow-inner">
          <h2 className="text-3xl font-semibold mb-4 text-blue-800">Sẵn Sàng Khám Phá Thế Giới Công Nghệ?</h2>
          <p className="text-lg mb-6 max-w-xl mx-auto">
            Duyệt qua danh mục sản phẩm phong phú của chúng tôi hoặc liên hệ nếu bạn cần tư vấn thêm.
          </p>
          <div className="space-x-4">
            <a
              href="/" // Link to your product page
              className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300"
            >
              Xem Sản Phẩm
            </a>
            <a
              href="/contact" // Link to your contact page
              className="inline-block bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-300 transition duration-300"
            >
              Liên Hệ Chúng Tôi
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}

export default AboutPage;
