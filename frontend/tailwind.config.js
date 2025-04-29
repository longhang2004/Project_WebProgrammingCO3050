/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Xanh dương làm màu chủ đạo
      },
    },
  },
  plugins: [],
};

// // tailwind.config.js
// import colors from 'tailwindcss/colors'; // *** Dùng import thay vì require ***

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}"
//   ],
//   theme: {
//     extend: {
//       colors: {
//         // Định nghĩa màu chủ đạo (Primary) - dựa trên màu gốc của bạn và mở rộng
//         primary: {
//           light: colors.blue[400],
//           DEFAULT: '#3B82F6', // Màu gốc bạn đã chọn (tương đương blue-500)
//           medium: colors.blue[600], // Thêm sắc độ trung bình
//           dark: colors.blue[700],
//           darker: colors.blue[800],
//           // Màu chữ phù hợp trên nền primary (ví dụ: text-primary-content)
//           content: colors.white,
//         },
//         // Màu phụ (Secondary)
//         secondary: {
//           light: colors.sky[400],
//           DEFAULT: colors.sky[500],
//           dark: colors.sky[600],
//           content: colors.white,
//         },
//         // Màu nền (Surface/Background)
//         background: {
//           DEFAULT: colors.gray[100], // Nền chính của trang
//           // Có thể thêm các sắc độ khác nếu cần: light, dark
//         },
//         surface: {
//           DEFAULT: colors.white,       // Nền cho các card, header,...
//           dark: colors.gray[800],      // Nền tối (ví dụ: footer)
//           accent: colors.blue[50],     // Nền nhấn nhẹ (hover,...)
//         },
//         // Màu chữ (Text) - Đặt tên có tiền tố 'text-' để dễ phân biệt
//         text: {
//           DEFAULT: colors.gray[900],    // Chữ chính (ví dụ: text-text)
//           main: colors.gray[800],       // Alias nếu muốn
//           muted: colors.gray[500],      // Chữ phụ
//           'on-primary': colors.white,   // Chữ trên nền primary
//           'on-dark': colors.gray[200],  // Chữ trên nền tối (surface-dark)
//           link: colors.blue[600],       // Màu link
//           'link-hover': colors.blue[700],// Màu link hover
//         },
//         // Màu nhấn (Accent) - cho button, badge,...
//         accent: {
//           DEFAULT: colors.orange[500],
//           hover: colors.orange[600],
//           content: colors.white, // Chữ trên nền accent
//         },
//         // Màu viền (Border)
//         border: {
//           DEFAULT: colors.gray[300], // Viền mặc định (thay gray-200 để rõ hơn chút)
//           dark: colors.gray[700],    // Viền trên nền tối
//           light: colors.gray[100],   // Viền sáng (nếu cần)
//         },
//         // Trạng thái
//         success: colors.green[500],
//         error: colors.red[600], // Đậm hơn chút
//         warning: colors.yellow[500],

//       },
//       fontFamily: {
//         // sans: ['Inter', 'sans-serif'], // Ví dụ thay đổi font
//       },
//       // Thêm các tùy chỉnh khác nếu cần (spacing, borderRadius,...)
//     },
//   },
//   plugins: [],
// };