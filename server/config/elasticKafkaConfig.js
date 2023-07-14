export const kafkaConf = {
  "group.id": process.env.GROUP_ID_ELASTIC,
  "metadata.broker.list": process.env.CLOUDKARAFKA_BROKERS.split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": process.env.CLOUDKARAFKA_USERNAME,
  "sasl.password": process.env.CLOUDKARAFKA_PASSWORD,
  debug: "generic,broker,security",
};
export default kafkaConf;
