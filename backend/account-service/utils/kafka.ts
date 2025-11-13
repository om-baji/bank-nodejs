import { Kafka, type Producer, type Consumer } from 'kafkajs'

export class KafkaService {
  private kafka: Kafka
  private producer: Producer | null = null
  private consumers: Map<string, Consumer> = new Map()

  constructor() {
    this.kafka = new Kafka({
      clientId: 'bank-services',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
    })
  }

  async getProducer(): Promise<Producer> {
    if (!this.producer) {
      this.producer = this.kafka.producer()
      await this.producer.connect()
    }
    return this.producer
  }

  async createConsumer(groupId: string): Promise<Consumer> {
    if (!this.consumers.has(groupId)) {
      const consumer = this.kafka.consumer({ groupId })
      await consumer.connect()
      this.consumers.set(groupId, consumer)
    }
    return this.consumers.get(groupId)!
  }

  async publishMessage(topic: string, message: any) {
    const producer = await this.getProducer()
    await producer.send({
      topic,
      messages: [{
        value: JSON.stringify(message),
        timestamp: Date.now().toString()
      }]
    })
  }

  async subscribeToTopic(
    topic: string,
    groupId: string,
    handler: (message: any) => Promise<void>
  ) {
    const consumer = await this.createConsumer(groupId)
    await consumer.subscribe({ topic })
    
    await consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          const data = JSON.parse(message.value.toString())
          await handler(data)
        }
      }
    })
  }
}

export const kafkaService = new KafkaService()