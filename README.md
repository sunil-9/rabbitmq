This is a [Next.js](https://nextjs.org/) project to demonestrate the use of **Rabbit MQ** .

## Install thunderclient extension for testing api

/api/chat (get request) - get all chat
/api/chat (post request) - create new chat(data:{name: string, message: string,uniqueId: string})

## run the rabbit mq server

```bash
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.11-management
```

## get rabbit mq server dashboard

Open [http://localhost:15672](http://localhost:15672) with your browser to see the result.

## Run the project

1. Change the environment variable in next.config.js file
2. Run the project using the command

```bash
npm install && npm run dev
```
