import axios from "axios";
import User from "./models/User";
import config from "./config";
import { Cookies } from "react-cookie";

export const checkSessionCookie = async (cookies: Cookies) => {
  if (cookies) {
    try {
      const sessionToken = cookies.get("sessionToken");
      if (sessionToken) {
        const userReq = await axios.get<{ user: User }>(
          config.API_URL + "/auth",
          {
            headers: {
              Authorization: "Bearer " + sessionToken,
            },
          }
        );
        if (userReq.data && userReq.data.user && userReq.data.user.id) {
          return userReq.data.user;
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return undefined;
};
