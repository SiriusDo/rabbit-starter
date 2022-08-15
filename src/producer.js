const amqplib = require("amqplib");

var amqp_url = "amqp://localhost:5672/test";
const opt = {
  credentials: amqplib.credentials.plain("admin", "admin"),
};
async function produce() {
  console.log("Init Producer");
  const conn = await amqplib.connect(amqp_url, opt);
  const channel = await conn.createChannel();
  var exchange = "test_topic_exchange";
  var keys = ["test.method.a", "test.method.b", "test.method.c"];
  var msgs = ["Hello World! A", "Hello World! B", "Hello World! C"];

  channel.assertExchange(exchange, "topic", {
    durable: true,
  });

  for (let i = 0; i < keys.length; i++) {
    channel.publish(exchange, keys[i], Buffer.from(msgs[i]));
    console.log(" [x] Sent %s:'%s'", keys[i], msgs[i]);
  }
}

produce();
