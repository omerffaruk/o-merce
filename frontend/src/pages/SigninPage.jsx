import React, { useContext } from "react";
import { toast } from "react-toastify";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { useEffect } from "react";
import { getError } from "../components/utils";

export default function SigninPage() {
  const navigate = useNavigate();
  const { search } = useLocation(); // useLocation returns a react-router-dom object with a search and pathname properties, use search to get the query string
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const handleSubmit = async (e) => {
    e.preventDefault();
    // response object includes config, data, headers, request and status properties, data is the response body
    try {
      const response = await axios.post("/api/users/signin", {
        email,
        password,
      });
      const { data } = response;
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      // redirect to the page that the user was trying to access before signing in
      navigate(redirect || "/");
    } catch (err) {
      // err.response is an object that contains response body properties including config, data, headers, request and status properties
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign in</title>
      </Helmet>
      <h1 className="my-3">Sign in</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button className="mb-3" variant="primary" type="submit">
            Sign in
          </Button>
        </div>
        <div className="mb-3">
          New customer?{" "}
          <Link to={`/signup?redirect=${redirect}`}>Create Your Account</Link>
        </div>
      </Form>
    </Container>
  );
}
