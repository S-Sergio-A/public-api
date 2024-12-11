import { Module } from "@nestjs/common";
import { PublicController } from "~/public/public.controller";
import { PublicService } from "~/public/public.service";
import { RabbitModule } from "~/modules/rabbit";

@Module({
  imports: [RabbitModule],
  controllers: [PublicController],
  providers: [PublicService]
})
export class PublicModule {}
