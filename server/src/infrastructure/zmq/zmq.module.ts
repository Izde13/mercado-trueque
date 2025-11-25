import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ZmqProducerService } from './zmq-producer.service';

@Module({
  imports: [ConfigModule],
  providers: [ZmqProducerService],
  exports: [ZmqProducerService],
})
export class ZmqModule {}
