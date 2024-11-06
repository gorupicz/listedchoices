import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const TooltipSpan = ({ id, title, children }) => (
  <OverlayTrigger
    placement="bottom"
    delay={{ show: 250, hide: 400 }}
    overlay={<Tooltip id={id}>{title}</Tooltip>}
  >
    {children}
  </OverlayTrigger>
);

export default TooltipSpan; 