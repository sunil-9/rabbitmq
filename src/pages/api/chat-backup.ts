import Chat from "@/models/Chat";
import type { NextApiRequest, NextApiResponse } from "next";
import ConnectDb from "../../middleware/mongoose";
import type { ResponseData } from "../../models/ApiResponse";

const get = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  let data: string[] = [];
  try {
    data = await Chat.find();
    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    console.log(e, "error");
    return res.status(200).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? "error: " + e.message
          : "Something went wrong",
    });
  }
};
const post = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  let data: string[] = [];
  try {
    const model = new Chat(req.body);
    console.log(req.body, "body")
    data = await model.save();
    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    console.log(e, "error");
    return res.status(200).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? "error: " + e.message
          : "Something went wrong",
    });
  }
};

export default ConnectDb(
  async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
    try {
      return req.method === "POST"
        ? await post(req, res)
        : req.method === "GET"
        ? await get(req, res)
        : res.status(404).json({ success: true, message: "404 not Found" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);
