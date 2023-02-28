import axios from "axios";
import { BASEURL } from "../utils/constants";

export const api = axios.create({
  baseURL: BASEURL + "/api/",
});
