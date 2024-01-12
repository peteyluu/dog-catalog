import { Button, Content, Heading, IllustratedMessage } from "@adobe/react-spectrum";
import NotFound from "@spectrum-icons/illustrations/NotFound";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <IllustratedMessage>
    <NotFound />
    <Heading>Error 404: Page not found</Heading>
    <Content>This page isn't available. Try checking the URL or visit a different page.</Content>
    <Button variant="primary" marginTop="size-100">
      <Link to="/">Go Home</Link>
    </Button>
  </IllustratedMessage>
);

export default NotFoundPage;
