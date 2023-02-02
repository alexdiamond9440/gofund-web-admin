let data;
export const EnviornmentType = {
  DEV: "development",
  PROD: "production"
};

export const env = process.env.NODE_ENV || EnviornmentType.DEV;
data = {
  API_ENDPOINT:
    env === "development" ? "http://localhost:3002/" : "/",
  API_VERSION: "api"
};

export const backendUrl =
  env === "development" ? "http://localhost:3002" : "";

data.DEFAULT_DATE_FORMAT = "MMM DD, YYYY";

export const frontUrl =
  env === "development" ? "http://localhost:3000/" : "https://gofundher.com/";

export const mainAppUrl =
  env === "development" ? "https://gofundher.com/" : "https://gofundher.com/";

export const AppConfig = data;
