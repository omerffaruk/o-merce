import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";

export default function ShippingAddressPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [firstName, setFirstName] = useState(shippingAddress.firstName || "");
  const [lastName, setLastName] = useState(shippingAddress.lastName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [postCode, setPostCode] = useState(shippingAddress.postCode || "");
  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  });
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { firstName, lastName, address, city, country, postCode },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({ firstName, lastName, address, city, country, postCode })
    );
    navigate("/payment");
  };
  return (
    <div>
      <Helmet>
        <title>Shipping</title>
      </Helmet>
      <CheckoutSteps step1 step2 />
      <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your first name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your last name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="City"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postCode">
            <Form.Label>Post Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Post Code"
              required
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </Form.Group>
          <div className="d-grid mt-4 mb-3">
            <Button className="mb-3" variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
