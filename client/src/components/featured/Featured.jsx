import useFetch from "../../hooks/useFetch.js";
import "./featured.css";

const Featured = () => {
  const { data, loading, error } = useFetch(
    "/hotels/countByCity?cities=HCM,HN,DN"
  );

  return (
    <div className="featured">
      {loading ? (
        "Loading, Please wait!"
      ) : (
        <>
          <div className="featuredItem">
            <img
              src="https://liengtam.com/wp-content/uploads/2021/08/3-thanh-pho-ho-chi-minh-ngay-nay.jpg"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Hồ Chí Minh</h1>
              <h2>{data[0]} properties</h2>
            </div>
          </div>

          <div className="featuredItem">
            <img
              src="https://gaz.com.vn/wp-content/uploads/2021/03/dia-diem-du-lich-noi-tieng-o-thu-do-ha-noi-ban-khong-nen-bo-lo-nhap-ho-khau-ha-noi_1511142628.jpeg"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Hà Nội</h1>
              <h2>{data[1]} properties</h2>
            </div>
          </div>
          <div className="featuredItem">
            <img
              src="https://res.klook.com/image/upload/c_crop,w_1125,h_624,x_1,y_0/w_1125,h_624/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/destination/ur2mrg23d91mex03l4mw.jpg"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Đà Nẵng</h1>
              <h2>{data[2]} properties</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Featured;
