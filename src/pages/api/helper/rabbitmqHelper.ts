import amqp from "amqplib/callback_api";

// RabbitMQ connection configuration
const rabbitMqConfig = {
  // url: "amqp://guest:admin@45.79.117.164", // RabbitMQ URL
  url:`amqp://${process.env.RABBIT_MQ_USER}:${process.env.RABBIT_MQ_PASSWORD}@${process.env.RABBIT_MQ_HOST}:5672`,
  queue: "theChatQueue", // Queue name
};

// Create a lock
const lock = {
  isLocked: false,
  acquire() {
    return new Promise<void>((resolve) => {
      const tryAcquireLock = () => {
        if (!this.isLocked) {
          this.isLocked = true;
          resolve();
        } else {
          setTimeout(tryAcquireLock, 100); // Retry after a delay
        }
      };

      tryAcquireLock();
    });
  },
  release() {
    this.isLocked = false;
  },
};

// Function to publish messages to RabbitMQ
export const publishToRabbitMq = async (message: object) => {
  await lock.acquire(); // Acquire lock
  try{
  amqp.connect(rabbitMqConfig.url, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      channel.assertQueue(rabbitMqConfig.queue, {
        durable: true,
      });
      channel.sendToQueue(
        rabbitMqConfig.queue,
        Buffer.from(JSON.stringify(message))
      );
      console.log("Message published to RabbitMQ");
    });

    setTimeout(function () {
      connection.close();
    }, 5000);
  });
} finally {
  lock.release(); // Release the lock
}
};

// Function to create the "chatQueue" queue
export const createChatQueue = (queueName: string) => {
  amqp.connect(rabbitMqConfig.url, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      channel.assertQueue(queueName, {
        durable: true,
      });
      console.log("chatQueue created");
    });

    setTimeout(function () {
      connection.close();
    }, 5000);
  });
};

// Function to consume messages from RabbitMQ and save data in the database
export const consumeFromRabbitMq = (callback: Function) => {
  console.log("consumeFromRabbitMq");
  amqp.connect(rabbitMqConfig.url, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      channel.assertQueue(rabbitMqConfig.queue, {
        durable: true,
      });
      channel.consume(
        rabbitMqConfig.queue,
        async (msg) => {
          if (msg !== null) {
            const data = JSON.parse(msg.content.toString());
            //execute callback function
            callback(data);
            channel.ack(msg);
          }
        },
        { noAck: false }
      );
    });
  });
};
