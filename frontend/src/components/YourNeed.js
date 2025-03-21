import React from 'react'
import "../css/YourNeed.css"

function YourNeed() {
  return (
    <div className="YourNeed">
        <div className="chapter">
            <div className="chapter-line"></div>
            <div className="chapter-name">
                Nhu cầu của bạn là gì?
            </div>
        </div>

        <div className="YN-container">
            <div className="YN-item" style={{ backgroundColor: "#032F30" }}>
                <div className="YNi-name">Đơn giản</div>
                <img className="YNi-image" src="https://www.laptopvip.vn/images/ab__webp/detailed/36/laptop-latitude-14-5410-gallery-4-www.laptopvip.vn-1714622691.webp" alt="" />
            </div>
            <div className="YN-item" style={{ backgroundColor: "#0A7075" }}>
                <div className="YNi-name">Hiện đại</div>
                <img className="YNi-image" src="https://www.notebookcheck.info/uploads/tx_nbc2/Acer_Nitro5_3.png" alt="" />
            </div>
            <div className="YN-item" style={{ backgroundColor: "#0C969C" }}>
                <div className="YNi-name">Cao cấp</div>
                <img className="YNi-image" src="https://product.hstatic.net/200000348419/product/iphone_15_pro_max_chinh_hang_viet_nam_0_9de037cb058c4139bb9d17723197a64f_master.png" alt="" />
            </div>
            <div className="YN-item" style={{ backgroundColor: "#6BA3BE" }}>
                <div className="YNi-name">Độc quyền</div>
                <img className="YNi-image" src="https://vn.store.asus.com/media/catalog/product/cache/74e490e088db727ef90851ac50e1fa20/t/h/thumb-7b.png" alt="" />
            </div>
            <div className="YN-item" style={{ backgroundColor: "#274D60" }}>
                <div className="YNi-name">Thời trang</div>
                <img className="YNi-image" src="https://sony.scene7.com/is/image/sonyglobalsolutions/Primary_image_1-1?$mediaCarouselSmall$&fmt=png-alpha" alt="" />
            </div>
        </div>
    </div>

  )
}

export default YourNeed