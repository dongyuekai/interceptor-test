import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppService } from './app.service';

@Injectable()
export class AaaInterceptor implements NestInterceptor {
  constructor(private appService: AppService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('通过appService调用---', this.appService.getHello());
    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`接口耗时...${Date.now() - now}ms`))); // tap operator不会改变数据 只是额外执行一段逻辑
  }
}
