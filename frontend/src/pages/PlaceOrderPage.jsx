import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import { Link, useNavigate } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import { toast } from "react-toastify";
import { getError } from "../components/utils";
import axios from "axios";
import LoadingBox from "../components/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function PlaceOrderPage() {
  console.log("Something in place order page");
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const {
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;
  const { firstName, lastName, address, city, country, postCode } =
    shippingAddress;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsTotalPrice = round2(
    cartItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
  );
  cart.shippingTotalPrice = cart.itemsTotalPrice > 100 ? round2(0) : round2(10);
  cart.taxTotal = round2(
    (cart.itemsTotalPrice + cart.shippingTotalPrice) * 0.15
  );
  cart.totalPrice = round2(
    cart.itemsTotalPrice + cart.shippingTotalPrice + cart.taxTotal
  );
  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      console.log("Before axios fetch");
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice: cart.itemsTotalPrice,
          shippingPrice: cart.shippingTotalPrice,
          taxPrice: cart.taxTotal,
          totalPrice: cart.totalPrice,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log("After axios fetch, if successful");
      ctxDispatch({ type: "EMPTY_CART" });
      dispatch({ type: "FETCH_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      console.log("After axios fetch, if error");
      dispatch({ type: "FETCH_FAIL" });
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    if (!paymentMethod) {
      navigate("/payment");
    }
  });
  return (
    <div>
      <Helmet>
        <title>Place order</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 step4 />
      <h1 className="my-3">Preview order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name: </strong>
                {`${firstName} ${lastName}`}
                <br />
                <strong>Address: </strong>
                {`${address} ${city} ${postCode} ${country}`}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment Method</Card.Title>
              <Card.Text>
                <strong>Method: </strong>
                {`${paymentMethod}`}
                <br />
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {state.cart.cartItems.map((item) => (
                  <ListGroup.Item key={item.id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.slug}
                          className="img-fluid rounded img-thumbnail"
                        ></img>
                        {"  "}
                        <Link to={`product/${item.slug}`} className="ml-4">
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={3}>{item.quantity}</Col>
                      <Col md={3}>£{item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>£ {cart.itemsTotalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>£ {cart.shippingTotalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>£ {cart.taxTotal.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>£ {cart.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <div className="d-grid">
                  <Button
                    type="button"
                    variant="primary"
                    disabled={cart.totalPrice === 0}
                    onClick={placeOrderHandler}
                  >
                    Place order
                  </Button>
                  {loading && <LoadingBox></LoadingBox>}
                </div>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
