import { getPayload } from "payload";
import config from "@payload-config";

/** Returns a cached, initialised Payload local API instance. */
export const getPayloadClient = async () => getPayload({ config });
