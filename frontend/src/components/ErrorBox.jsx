import Alert from "react-bootstrap/Alert";

export default function ErrorBox(props) {
  const { error } = props;
  return <Alert variant={props.variant || "info"}>{error}</Alert>;
}
