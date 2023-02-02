import { EnviornmentType } from "../Config";

export const logger = data => {
  if (process.env.NODE_ENV === EnviornmentType.DEV) {
    // console.log("====================================");
    // console.log(data);
    // console.log("====================================");
  }
};