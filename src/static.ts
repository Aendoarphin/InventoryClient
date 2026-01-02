import { ItemContext } from "./routes/manage.Item";
import { VendorContext } from "./routes/manage.Vendor";

export const modelContextMap: Record<string, React.Context<any>> = {
  item: ItemContext,
  vendor: VendorContext,
};

export const showError = (setter: React.Dispatch<React.SetStateAction<string | undefined>>) => {
    setter("Could not perform action");
      setTimeout(() => {
        setter(undefined);
      }, 5000);
  }

export const baseApiUrl = `https://${import.meta.env.VITE_WEBAPI_HOST}`;
export const versionNumber = "1.2.0"