// import amqp from "amqplib/callback_api";
// import ConnectDb from "../../middleware/mongoose";
// import Chat from "../../models/Chat";
// import type { NextApiRequest, NextApiResponse } from "next";
// import type { ResponseData } from "./../../models/ApiResponse";

// // RabbitMQ connection configuration
// const rabbitMqConfig = {
//   url: "amqp://localhost", // RabbitMQ URL
//   queue: "chatQueue", // Queue name
// };

// // Function to publish messages to RabbitMQ
// const publishToRabbitMq = (message: any, callback: Function) => {
//   amqp.connect(rabbitMqConfig.url, function (error0, connection) {
//     if (error0) {
//       return callback(error0);
//     }
//     connection.createChannel(function (error1, channel) {
//       if (error1) {
//         return callback(error1);
//       }
//       channel.assertQueue(rabbitMqConfig.queue, {
//         durable: true,
//       });
//       channel.sendToQueue(
//         rabbitMqConfig.queue,
//         Buffer.from(JSON.stringify(message))
//       );
//       console.log("Message published to RabbitMQ");
//       return callback(null);
//     });

//     setTimeout(function () {
//       connection.close();
//     }, 5000);
//   });
// };

// // Function to consume messages from RabbitMQ and save data in the database
// const consumeFromRabbitMq = (callback: Function) => {
//   console.log("consumeFromRabbitMq");
//   amqp.connect(rabbitMqConfig.url, function (error0, connection) {
//     if (error0) {
//       return callback(error0);
//     }
//     connection.createChannel(function (error1, channel) {
//       if (error1) {
//         return callback(error1);
//       }
//       channel.assertQueue(rabbitMqConfig.queue, {
//         durable: true,
//       });
//       channel.consume(
//         rabbitMqConfig.queue,
//         async (msg) => {
//           if (msg !== null) {
//             const data = JSON.parse(msg.content.toString());

//             // Save data in the database
//             try {
//               const model = new Chat(data);
//               await model.save();
//               console.log("Data saved in the database");
//               channel.ack(msg);
//             } catch (error) {
//               console.error("Error saving data in the database:", error);
//               channel.nack(msg);
//             }
//           }
//         },
//         { noAck: false }
//       );
//       return callback(null);
//     });
//   });
// };

// // Usage in API POST request
// const post = (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
//   const message = req.body;

//   // Publish the message to RabbitMQ
//   publishToRabbitMq(message, (publishError: any) => {
//     if (publishError) {
//       console.error("Error publishing message:", publishError);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to publish message",
//       });
//     }

//     return res.status(200).json({ success: true, message: "Message published to RabbitMQ" });
//   });
// };

// // Connect to MongoDB middleware
// const handler = ConnectDb(
//   async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
//     try {
//       if (req.method === "POST") {
//         // Consume messages from RabbitMQ
//         consumeFromRabbitMq((consumeError: any) => {
//           if (consumeError) {
//             console.error("Error consuming messages:", consumeError);
//             return res.status(500).json({
//               success: false,
//               message: "Failed to consume messages",
//             });
//           }
//           // Process the POST request
//           post(req, res);
//         });
//       } else {
//         return res.status(404).json({ success: true, message: "404 not Found" });
//       }
//     } catch (error) {
//       console.log(error);
//       return res
//         .status(500)
//         .json({ success: false, message: "Internal Server Error" });
//     }
//   }
// );

// export default handler;

import Chat from "@/models/Chat";
import type { NextApiRequest, NextApiResponse } from "next";
import ConnectDb from "../../middleware/mongoose";
import type { ResponseData } from "./../../models/ApiResponse";
import {
  consumeFromRabbitMq,
  createChatQueue,
  publishToRabbitMq,
} from "./helper/rabbitmqHelper";

// Call the function to create the "chatQueue" queue
createChatQueue("theChatQueue");

// Call the function to consume messages from RabbitMQ
// consumeFromRabbitMq();
//provide the callback function to consumeFromRabbitMq
consumeFromRabbitMq(async (data: any) => {
  console.log(data, "data")
  const model = new Chat(data);
  await model.save();
  console.log("Data saved in the database");
});

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
    // Publish the message to RabbitMQ
    await publishToRabbitMq(req.body);

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
