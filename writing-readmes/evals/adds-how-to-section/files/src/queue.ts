const queue = {
  async publish(topic: string, message: unknown) {
    process.stdout.write(JSON.stringify({ topic, message }) + '\n');
  },
};

export { queue };
