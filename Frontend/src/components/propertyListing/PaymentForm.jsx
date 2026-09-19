import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { DatePicker, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { setPaymentDetails } from "../../store/Payment/payment-slice";

const PaymentForm = ({
  price,
  propertyName,
  address,
  maximumGuest,
  propertyId,
  currentBookings,
}) => {
  const numericPrice = Number(price) || 0;
  const [calculatedPrice, setCalulatedPrice] = useState(0);
  const [nightsCount, setNightsCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const { isAuthenticated } = useSelector((state) => state.user);

  const isDateDisabled = (current) => {
    const today = moment().startOf("day");
    if (current.isBefore(today)) {
      return true;
    }

    if (!currentBookings || !Array.isArray(currentBookings)) return false;

    return currentBookings.some((booking) => {
      const startDate = moment(booking.fromDate || booking.fromdate).startOf("day");
      const endDate = moment(booking.toDate || booking.todate).startOf("day");
      const currentMoment = moment(current.toDate()).startOf("day");

      return (
        currentMoment.isSameOrAfter(startDate) &&
        currentMoment.isSameOrBefore(endDate)
      );
    });
  };
  const form = useForm({
    defaultValues: {
      dateRange: [],
      guests: "",
      name: "",
      phoneNumber: "",
    },
    onSubmit: async ({ value }) => {
      const [checkinDate, checkoutDate] = value.dateRange || [];
      const diffNights = moment(checkoutDate, "YYYY-MM-DD").diff(moment(checkinDate, "YYYY-MM-DD"), "days");
      const nights = diffNights > 0 ? diffNights : 1;
      const finalTotalPrice = calculatedPrice > 0 ? calculatedPrice : numericPrice * nights;
      const { name, guests, phoneNumber } = value;

      if (name && guests && phoneNumber && checkinDate && checkoutDate) {
        await dispatch(
          setPaymentDetails({
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            nights: nights,
            totalPrice: finalTotalPrice,
            propertyName,
            address,
            guests: Number(guests),
            name,
            phoneNumber,
          })
        );
        navigate(`/payment/${propertyId}`);
      } else {
        alert("Please fill all fields correctly before proceeding.");
      }
    },
  });

  return (
    <div className="form-container">
      <form
        className="payment-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="price-pernight">
          Price: <b>&#8377;{price}</b>
          <span> / Per night</span>
        </div>
        <div className="payment-field">
          <form.Field name="dateRange">
            {(field) => (
              <div className="date">
                <Space direction="vertical" size={12}>
                  <RangePicker
                    format="YYYY-MM-DD"
                    picker="date"
                    disabledDate={isDateDisabled}
                    onChange={(value, dateString) => {
                      field.handleChange(dateString);
                      const [checkin, checkout] = dateString;
                      if (checkin && checkout) {
                        const n = moment(checkout, "YYYY-MM-DD").diff(
                          moment(checkin, "YYYY-MM-DD"),
                          "days"
                        );
                        const nights = n > 0 ? n : 1;
                        const total = numericPrice * nights;
                        setCalulatedPrice(total);
                        setNightsCount(nights);
                      } else {
                        setCalulatedPrice(0);
                        setNightsCount(0);
                      }
                    }}
                  />
                </Space>
                {calculatedPrice > 0 && (
                  <div style={{ marginTop: "8px", fontWeight: "600", color: "#222" }}>
                    {nightsCount} night{nightsCount !== 1 ? "s" : ""} × ₹{numericPrice} = <span style={{color:"#e63946"}}>₹{calculatedPrice.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>
            )}
          </form.Field>
          <form.Field
            name="guests"
            validators={{
              onChange: ({ value }) =>
                value > 0 && value <= maximumGuest
                  ? undefined
                  : `Guests must be 1 - ${maximumGuest}`,
            }}
          >
            {(field) => (
              <div className="guest">
                <label className="payment-labels">Number of guests:</label>
                <br></br>
                <input
                  type="number"
                  className="no-of-guest"
                  placeholder="Guest"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                ></input>
                {field.state.meta.errors && (
                  <p style={{ color: "red" }}>{field.state.meta.errors}</p>
                )}
              </div>
            )}
          </form.Field>
          <div className="name-phoneno">
            <form.Field name="name">
              {(field) => (
                <>
                  <label className="payment-labels">Your full name:</label>{" "}
                  <br></br>
                  <input
                    type="text"
                    className="full-name"
                    placeholder="Name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  ></input>
                </>
              )}
            </form.Field>
            <br></br>
            <form.Field name="phoneNumber">
              {(field) => (
                <>
                  <label className="payment-labels">Phone Number:</label>{" "}
                  <br></br>
                  <input
                    type="number"
                    className="phone-number"
                    placeholder="Number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  ></input>
                </>
              )}
            </form.Field>
          </div>
        </div>
        <div className="book-place">
          {!isAuthenticated ? (

            <button type="button" onClick={() => navigate("/login")}>
              Login to Book
            </button>
          ) : (
            <button type="submit">
              Book this place ₹{calculatedPrice > 0 ? calculatedPrice.toLocaleString("en-IN") : numericPrice}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
