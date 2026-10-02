import { ALLOWED_TOOLS } from "./toolSchema";

export function validateAction(actionName) {
  if (!ALLOWED_TOOLS.includes(actionName)) {
    throw new Error(`Unauthorized action: ${actionName}`);
  }
  return true;
}
