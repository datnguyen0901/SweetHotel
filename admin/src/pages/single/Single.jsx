import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import ChartIndividualUser from "../../components/chart/ChartIndividualUser";
import ListIndividualUser from "../../components/table/TableIndividual";

const Single = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { data, loading, error } = useFetch(
    `/users/${user._id}`
  );

  const navigate = useNavigate();

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div
              className="editButton"
              onClick={() => navigate(`/users/${user._id}`)}
            >
              Edit
            </div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">
                  {data.fullName}
                </h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">
                    {data.email}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">
                    {data.phone}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">
                    {data.address}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Country:</span>
                  <span className="itemValue">
                    {data.country}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <ChartIndividualUser
              aspect={3 / 1}
              title="User Spending ( Last 6 Months)"
            />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <ListIndividualUser />
        </div>
      </div>
    </div>
  );
};

export default Single;
