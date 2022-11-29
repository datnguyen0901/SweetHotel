import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  bookingInputs,
  finalizationInputs,
  hotelInputs,
  orderInputs,
  roleInputs,
  roomInputs,
  serviceInputs,
  userInputs,
} from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import {
  bookingColumns,
  finalizationColumns,
  hotelColumns,
  orderColumns,
  roleColumns,
  roomAttendantColumns,
  roomColumns,
  roomNumbersColumns,
  serviceColumns,
  userColumns,
} from "./datatablesource";
import NewHotel from "./pages/newHotel/NewHotel";
import NewRoom from "./pages/newRoom/NewRoom";
import NewRole from "./pages/newRole/NewRole";
import NewBooking from "./pages/newBooking/NewBooking";
import EditRole from "./pages/newRole/EditRole";
import Edit from "./pages/new/Edit";
import EditHotel from "./pages/newHotel/EditHotel";
import EditRoom from "./pages/newRoom/EditRoom";
import EditBooking from "./pages/newBooking/EditBooking";
import CalendarManage from "./pages/newRoom/Calendar";
import RoomNumbers from "./pages/newRoom/RoomNumbers";
import NewService from "./pages/newService/NewService";
import EditService from "./pages/newService/EditService";
import EditOrder from "./pages/newOrder/EditOrder";
import NewOrder from "./pages/newOrder/NewOrder";
import ListBooking from "./pages/newBooking/ListBooking";
import NewFinalization from "./pages/newFinalization/NewFinalization";
import EditFinalization from "./pages/newFinalization/EditFinalization";
import {
  useTranslation,
  withTranslation,
} from "react-i18next";
import {
  bookingColumnsVN,
  finalizationColumnsVN,
  hotelColumnsVN,
  orderColumnsVN,
  roleColumnsVN,
  roomAttendantColumnsVN,
  roomColumnsVN,
  roomNumbersColumnsVN,
  serviceColumnsVN,
  userColumnsVN,
} from "./datatablesourceVN";
import {
  bookingInputsVN,
  finalizationInputsVN,
  hotelInputsVN,
  orderInputsVN,
  roleInputsVN,
  roomInputsVN,
  serviceInputsVN,
  userInputsVN,
} from "./formSourceVN";
import ListRoomAttendant from "./pages/newRoomAttendant/ListRoomAttendant";
import ListAuditing from "./pages/newAuditing/ListRoomAttendant";
import ListStats from "./pages/newStats/ListStats";
import useFetch from "./hooks/useFetch";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
      return <Navigate to="/login" />;
    }
    if (!user.isAdmin) {
      localStorage.removeItem("user");
      // clear cookies access token
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      return <Navigate to="/login" />;
    }

    return children;
  };

  // get hotelId from login user by roleId, set default is customer
  const userData = JSON.parse(
    localStorage.getItem("user")
  ) || { roleId: "62b94302966d649ae7c461de" };
  // get role.name of user
  const { data } = useFetch(`/roles/${userData.roleId}`);

  const AdminRoute = ({ children }) => {
    if (data) {
      // 62a07cba02af48b2f8a38d9b is roleId of Admin
      if (userData.roleId !== "62a07cba02af48b2f8a38d9b") {
        alert(
          "You don't have permission to access this page"
        );
        return <Navigate to="/" />;
      }
    }

    return children;
  };

  const RoleRoute = ({ children }) => {
    if (data) {
      if (data.name === "Receptionist") {
        alert(
          "You don't have permission to access this page"
        );
        return <Navigate to="/" />;
      }
    }

    return children;
  };

  const [t, i18n] = useTranslation("common");

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="users">
              <Route
                index
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <List columns={userColumns} />
                    ) : (
                      <List columns={userColumnsVN} />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path=":userId"
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <Edit
                        inputs={userInputs}
                        title="Edit User"
                      />
                    ) : (
                      <Edit
                        inputs={userInputsVN}
                        title="Chỉnh sửa người dùng"
                      />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <New
                        inputs={userInputs}
                        title="Add New User"
                      />
                    ) : (
                      <New
                        inputs={userInputsVN}
                        title="Thêm mới người dùng"
                      />
                    )}
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="roles">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <AdminRoute>
                      {i18n.language === "en" ? (
                        <List columns={roleColumns} />
                      ) : (
                        <List columns={roleColumnsVN} />
                      )}
                    </AdminRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":productId"
                element={
                  <ProtectedRoute>
                    <RoleRoute>
                      {i18n.language === "en" ? (
                        <EditRole
                          inputs={roleInputs}
                          title="Edit Role"
                        />
                      ) : (
                        <EditRole
                          inputs={roleInputsVN}
                          title="Chỉnh sửa vai trò"
                        />
                      )}
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <RoleRoute>
                      {i18n.language === "en" ? (
                        <NewRole
                          inputs={roleInputs}
                          title="Add New Role"
                        />
                      ) : (
                        <NewRole
                          inputs={roleInputsVN}
                          title="Thêm mới vai trò"
                        />
                      )}
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="hotels">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <AdminRoute>
                      {i18n.language === "en" ? (
                        <List columns={hotelColumns} />
                      ) : (
                        <List columns={hotelColumnsVN} />
                      )}
                    </AdminRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":hotelId"
                element={
                  <ProtectedRoute>
                    <RoleRoute>
                      {i18n.language === "en" ? (
                        <EditHotel
                          inputs={hotelInputs}
                          title="Edit Hotel"
                        />
                      ) : (
                        <EditHotel
                          inputs={hotelInputsVN}
                          title="Chỉnh sửa khách sạn"
                        />
                      )}
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <RoleRoute>
                      {i18n.language === "en" ? (
                        <NewHotel
                          inputs={hotelInputs}
                          title="Add New Hotel"
                        />
                      ) : (
                        <NewHotel
                          inputs={hotelInputsVN}
                          title="Thêm mới khách sạn"
                        />
                      )}
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="rooms">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <AdminRoute>
                      {i18n.language === "en" ? (
                        <List columns={roomColumns} />
                      ) : (
                        <List columns={roomColumnsVN} />
                      )}
                    </AdminRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path=":roomId"
                element={
                  <ProtectedRoute>
                    <RoleRoute>
                      {i18n.language === "en" ? (
                        <EditRoom
                          inputs={roomInputs}
                          title="Edit Room"
                        />
                      ) : (
                        <EditRoom
                          inputs={roomInputsVN}
                          title="Chỉnh sửa phòng"
                        />
                      )}
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="calendar/:roomId"
                element={
                  <ProtectedRoute>
                    <CalendarManage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="roomnumbers/:roomId"
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <RoomNumbers
                        columns={roomNumbersColumns}
                      />
                    ) : (
                      <RoomNumbers
                        columns={roomNumbersColumnsVN}
                      />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <RoleRoute>
                      {i18n.language === "en" ? (
                        <NewRoom
                          inputs={roomInputs}
                          title="Add New Room"
                        />
                      ) : (
                        <NewRoom
                          inputs={roomInputsVN}
                          title="Thêm mới phòng"
                        />
                      )}
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="bookings">
              <Route
                index
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <ListBooking
                        columns={bookingColumns}
                      />
                    ) : (
                      <ListBooking
                        columns={bookingColumnsVN}
                      />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path=":bookingId"
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <EditBooking
                        inputs={bookingInputs}
                        title="Edit Booking"
                      />
                    ) : (
                      <EditBooking
                        inputs={bookingInputsVN}
                        title="Chỉnh sửa đặt phòng"
                      />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <NewBooking
                        inputs={bookingInputs}
                        title="Add New Booking"
                      />
                    ) : (
                      <NewBooking
                        inputs={bookingInputsVN}
                        title="Thêm mới đặt phòng"
                      />
                    )}
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="services">
              <Route
                index
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <List columns={serviceColumns} />
                    ) : (
                      <List columns={serviceColumnsVN} />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path=":productId"
                element={
                  <ProtectedRoute>
                    <RoleRoute>
                      {i18n.language === "en" ? (
                        <EditService
                          inputs={serviceInputs}
                          title="Edit Service"
                        />
                      ) : (
                        <EditService
                          inputs={serviceInputsVN}
                          title="Chỉnh sửa dịch vụ"
                        />
                      )}
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <RoleRoute>
                      {i18n.language === "en" ? (
                        <NewService
                          inputs={serviceInputs}
                          title="Add New Service"
                        />
                      ) : (
                        <NewService
                          inputs={serviceInputsVN}
                          title="Thêm mới dịch vụ"
                        />
                      )}
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="orders">
              <Route
                index
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <List columns={orderColumns} />
                    ) : (
                      <List columns={orderColumnsVN} />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path=":productId"
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <EditOrder
                        inputs={orderInputs}
                        title="Edit Order"
                      />
                    ) : (
                      <EditOrder
                        inputs={orderInputsVN}
                        title="Chỉnh sửa đặt dịch vụ"
                      />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <NewOrder
                        inputs={orderInputs}
                        title="Add New Order"
                      />
                    ) : (
                      <NewOrder
                        inputs={orderInputsVN}
                        title="Thêm mới đặt dịch vụ"
                      />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="new/:productId"
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <NewOrder
                        inputs={orderInputs}
                        title="Add New Order"
                      />
                    ) : (
                      <NewOrder
                        inputs={orderInputsVN}
                        title="Thêm mới đặt dịch vụ"
                      />
                    )}
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="finalizations">
              <Route
                index
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <List columns={finalizationColumns} />
                    ) : (
                      <List
                        columns={finalizationColumnsVN}
                      />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path=":productId"
                element={
                  <ProtectedRoute>
                    <RoleRoute>
                      {i18n.language === "en" ? (
                        <EditFinalization
                          inputs={finalizationInputs}
                          title="Edit Finalization"
                        />
                      ) : (
                        <EditFinalization
                          inputs={finalizationInputsVN}
                          title="Chỉnh sửa kết toán"
                        />
                      )}
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <NewFinalization
                        inputs={finalizationInputs}
                        title="Add New Finalization"
                      />
                    ) : (
                      <NewFinalization
                        inputs={finalizationInputsVN}
                        title="Thêm mới kết toán"
                      />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="new/:productId"
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <NewFinalization
                        inputs={finalizationInputs}
                        title="Add New Finalization"
                      />
                    ) : (
                      <NewFinalization
                        inputs={finalizationInputsVN}
                        title="Thêm mới kết toán"
                      />
                    )}
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="roomAttendants">
              <Route
                index
                element={
                  <ProtectedRoute>
                    {i18n.language === "en" ? (
                      <ListRoomAttendant
                        columns={roomAttendantColumns}
                      />
                    ) : (
                      <ListRoomAttendant
                        columns={roomAttendantColumnsVN}
                      />
                    )}
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="auditing">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <RoleRoute>
                      {i18n.language === "en" ? (
                        <ListAuditing
                          columns={roomAttendantColumns}
                        />
                      ) : (
                        <ListAuditing
                          columns={roomAttendantColumnsVN}
                        />
                      )}
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="stats">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <RoleRoute>
                      {i18n.language === "en" ? (
                        <ListStats
                          columns={roomAttendantColumns}
                        />
                      ) : (
                        <ListStats
                          columns={roomAttendantColumnsVN}
                        />
                      )}
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="single"
              element={
                <ProtectedRoute>
                  <Single />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default withTranslation("common")(App);
