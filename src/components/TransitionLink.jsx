import { Link as RouterLink } from "react-router-dom";

/** Route links opt into React Router's native View Transitions API where supported. */
export function Link({ viewTransition, ...props }) {
  const supportsViewTransitions = typeof document !== "undefined" && typeof document.startViewTransition === "function";
  return <RouterLink viewTransition={viewTransition ?? supportsViewTransitions} {...props} />;
}

export default Link;
