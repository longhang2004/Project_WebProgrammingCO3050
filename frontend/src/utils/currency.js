export const USD_TO_VND_RATE = 25000; // Ví dụ: 1 USD = 25,000 VND

/**
 * Định dạng một số tiền (được cho là USD) sang chuỗi VND.
 * @param {number | null | undefined} amountInUSD Số tiền bằng USD.
 * @param {number} exchangeRate Tỷ giá USD sang VND.
 * @returns {string} Chuỗi tiền tệ đã định dạng (VND) hoặc 'Liên hệ'.
 */
export const formatCurrencyVND = (amountInUSD, exchangeRate = USD_TO_VND_RATE) => {
    const numericAmountUSD = Number(amountInUSD);

    if (amountInUSD === null || amountInUSD === undefined || isNaN(numericAmountUSD)) {
        return 'Liên hệ'; // Hoặc một giá trị mặc định khác
    }

    const amountInVND = numericAmountUSD * exchangeRate;

    try {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amountInVND);
    } catch (error) {
        console.error("Error formatting currency to VND:", error, "Amount in USD:", amountInUSD, "Amount in VND:", amountInVND);
        return 'Lỗi giá'; // Hoặc giá trị USD gốc nếu không định dạng được
    }
};