import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
// import apihit from "../models/apihit";
const ConnectDb = (handler:any) => async (req:NextApiRequest, res:NextApiResponse) => {
  if (mongoose.connections[0].readyState) return handler(req, res);

  mongoose.connect(process.env?.DB_URL as string);

  return handler(req, res);
};
export default ConnectDb;
