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

export const eventColorsHash: {
  [key: string]: { background: string; foreground: string };
} = {
  "1": {
    background: "#a4bdfc",
    foreground: "#1d1d1d",
  },
  "2": {
    background: "#7ae7bf",
    foreground: "#1d1d1d",
  },
  "3": {
    background: "#dbadff",
    foreground: "#1d1d1d",
  },
  "4": {
    background: "#ff887c",
    foreground: "#1d1d1d",
  },
  "5": {
    background: "#fbd75b",
    foreground: "#1d1d1d",
  },
  "6": {
    background: "#ffb878",
    foreground: "#1d1d1d",
  },
  "7": {
    background: "#46d6db",
    foreground: "#1d1d1d",
  },
  "8": {
    background: "#e1e1e1",
    foreground: "#1d1d1d",
  },
  "9": {
    background: "#5484ed",
    foreground: "#1d1d1d",
  },
  "10": {
    background: "#51b749",
    foreground: "#1d1d1d",
  },
  "11": {
    background: "#dc2127",
    foreground: "#1d1d1d",
  },
};
