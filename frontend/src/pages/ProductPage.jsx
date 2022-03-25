import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate, useParams } from "react-router-dom";
import Rating from "../components/Rating";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import ErrorBox from "../components/ErrorBox";
import { getError } from "../components/utils";
import { Store } from "../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

function ProductPage() {
  const navigate = useNavigate(); // useNavigate() is a hook to navigate to a new page
  const params = useParams();
  const { slug } = params;
  const initialState = {
    product: [],
    loading: true,
    error: "",
  };
  const [{ product, loading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  // access state and dispatch props created with createContext React hook, change the name of the dispatch to ctxDispatch, pass Store object to useContext
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    // check item already in the cart, if so increase the quantity by one if not set the quantity 1
    const existItem = cart.cartItems.find((item) => item._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    // get how many items in the inventory to show out of stock if there is no enough
    const result = await axios.get(`/api/products/${product._id}`);
    // result is an object with the whole response properties, data is an object with only returned data from response
    const { data } = result;
    if (data.countInStock < quantity) {
      window.alert("Sorry, product is out of stock.");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    // console.log({ state });
    navigate("/cart"); // navigate to the cart page when clicked on add to cart
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <ErrorBox variant="danger" error={error} />
  ) : (
    <Row>
      <Col md={5}>
        <img className="img-large" src={product.image} alt={product.slug}></img>
      </Col>
      <Col md={4}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Helmet>
              <title>{product.name}</title>
            </Helmet>
            <h1>{product.name}</h1>
          </ListGroup.Item>
          <ListGroup.Item>
            <Rating rating={product.rating} numReviews={product.numReviews} />
          </ListGroup.Item>
          <ListGroup.Item>Price: £{product.price}</ListGroup.Item>
          <ListGroup.Item>Description: {product.description}</ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={3}>
        <Card>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>${product.price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock >= 1 ? (
                      <Badge bg="success">In Stock</Badge>
                    ) : (
                      <Badge bg="danger">Unavailable</Badge>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button className="primary" onClick={addToCartHandler}>
                      Add to cart
                    </Button>
                  </div>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default ProductPage;
