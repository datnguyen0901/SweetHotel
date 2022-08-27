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
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import {
  bookingColumns,
  calendarColumns,
  finalizationColumns,
  hotelColumns,
  orderColumns,
  roleColumns,
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
import ViewBooking from "./pages/newBooking/ViewBooking";
import ListBooking from "./pages/newBooking/ListBooking";
import NewFinalization from "./pages/newFinalization/NewFinalization";
import EditFinalization from "./pages/newFinalization/EditFinalization";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user || user.isAdmin) {
      return <Navigate to="/login" />;
    }

    return children;
  };

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
                    <List columns={userColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":userId"
                element={
                  <ProtectedRoute>
                    <Edit
                      inputs={userInputs}
                      title="Edit User"
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <New
                      inputs={userInputs}
                      title="Add New User"
                    />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="roles">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={roleColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":productId"
                element={
                  <ProtectedRoute>
                    <EditRole />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewRole />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="hotels">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={hotelColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":hotelId"
                element={
                  <ProtectedRoute>
                    <EditHotel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewHotel />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="rooms">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={roomColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":roomId"
                element={
                  <ProtectedRoute>
                    <EditRoom />
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
                    <RoomNumbers
                      columns={roomNumbersColumns}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewRoom />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="bookings">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <ListBooking columns={bookingColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":bookingId"
                element={
                  <ProtectedRoute>
                    <EditBooking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewBooking />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="services">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={serviceColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":productId"
                element={
                  <ProtectedRoute>
                    <EditService />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewService />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="orders">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={orderColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":productId"
                element={
                  <ProtectedRoute>
                    <EditOrder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewOrder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new/:productId"
                element={
                  <ProtectedRoute>
                    <NewOrder />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="finalizations">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={finalizationColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":productId"
                element={
                  <ProtectedRoute>
                    <EditFinalization />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewFinalization />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new/:productId"
                element={
                  <ProtectedRoute>
                    <NewFinalization />
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

export default App;