import { Injectable } from "@nestjs/common";
import { RabbitProducerService } from "~/modules/rabbit/rabbit-producer.service";
import { LoggerService } from "@ssmovzh/chatterly-common-utils";

@Injectable()
export class PublicService {
  private readonly limitPerQueue: number = 100;

  constructor(
    private readonly logger: LoggerService,
    private readonly rabbitService: RabbitProducerService
  ) {
    this.logger.setContext(PublicService.name);
  }

  async publishMessage(queueName: string, data: any): Promise<void> {
    try {
      if (!queueName) {
        this.logger.error("Invalid queue name");
        return;
      }

      if (!data) {
        this.logger.error("Invalid data");
        return;
      }

      const queueInfo = await this.rabbitService.getQueueInfo(queueName);

      const processLimit = this.limitPerQueue - queueInfo.messageCount;

      if (processLimit <= 0) {
        this.logger.warn(`Queue name: ${queueName}): Queue is full: ${queueInfo.messageCount}/${this.limitPerQueue}`);
        return;
      }
      this.logger.debug(`Queue name: ${queueName}); Pushing ${JSON.stringify(data)} to queue`);

      return this.rabbitService.sendMessage(queueName, data);
    } catch (error) {
      this.logger.error(error, error.trace);
    }
  }
}
