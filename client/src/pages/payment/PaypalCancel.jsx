import React from "react";

const PaypalCancel = () => {
  function countdown() {
    let i = 5;
    let interval = setInterval(function () {
      document.getElementById("countdown").innerHTML = i;
      i--;
      if (i < 0) {
        clearInterval(interval);
        document.getElementById("countdown").innerHTML =
          "Done";
        // or...
        alert("You're good to go!");
      }
    }, 1000);
  }
  setTimeout(function () {
    window.location.href = "/booking";
  }, 5000);
  return (
    <div className="paypalSuccess">
      <div className="paypalSuccess__container">
        <div className="paypalSuccess__container__content">
          <h1>Payment Failed!</h1>
          <h3>
            You will be redirected to your booking page in{" "}
            <span id="countdown">{countdown()}</span>{" "}
            seconds
          </h3>
        </div>
      </div>
    </div>
  );
};

export default PaypalCancel;
