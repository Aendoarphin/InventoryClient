import { ItemContext } from "./routes/manage.Item";
import { VendorContext } from "./routes/manage.Vendor";

export const modelContextMap: Record<string, React.Context<any>> = {
  item: ItemContext,
  vendor: VendorContext,
};

export const baseApiUrl = `https://${import.meta.env.VITE_WEBAPI_HOST}`;