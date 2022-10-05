import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Booking from "./pages/booking/Booking";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import Order from "./pages/order/Order";
import PaypalCancel from "./pages/payment/PaypalCancel";
import PaypalSuccess from "./pages/payment/PaypalSuccess";
import Register from "./pages/register/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<List />} />
        <Route path="/hotels/:id" element={<Hotel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/order/:id" element={<Order />} />
        <Route
          path="/booking/success"
          element={<PaypalSuccess />}
        />
        <Route
          path="/booking/cancel"
          element={<PaypalCancel />}
        />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
