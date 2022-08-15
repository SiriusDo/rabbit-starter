const amqplib = require("amqplib");

var amqp_url = "amqp://localhost:5672/test";

const opt = {
  credentials: amqplib.credentials.plain("admin", "admin"),
};

var args = process.argv.slice(2);

async function do_consume() {
  console.log("Init consumer");
  const conn = await amqplib.connect(amqp_url, opt);
  const channel = await conn.createChannel();

  var exchange = "test_topic_exchange";
  channel.assertExchange(exchange, "topic", {
    durable: true,
  });
  const q = await channel.assertQueue("", {
    exclusive: true,
  });
  const rkey = args.length > 0 ? args[0] : "#";
  channel.bindQueue(q.queue, exchange, rkey);
  channel.consume(
    q.queue,
    async (msg) => {
      try {
        console.log(
          " [x] %s:'%s'",
          msg.fields.routingKey,
          msg.content.toString()
        );
      } catch (err) {
        console.log("err: ", err);
      }
    },
    { noAck: true }
  );
}

do_consume();
