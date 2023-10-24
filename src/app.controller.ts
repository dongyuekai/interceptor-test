import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AaaInterceptor } from './aaa.interceptor';
import { MapTestInterceptor } from './map-test.interceptor';
import { TapTestInterceptor } from './tap-test.interceptor';
import { AppService } from './app.service';
import { CatchErrorTestInterceptor } from './catch-error-test.interceptor';
import { TimeoutInterceptor } from './timeout.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(AaaInterceptor) // 在指定的handler上启用interceptor
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  @UseInterceptors(MapTestInterceptor)
  aaa() {
    return 'aaa3333'; //这里返回的值 直接给到MapTestInterceptor来使用
  }

  @Get('bbb')
  @UseInterceptors(TapTestInterceptor)
  bbb() {
    return 'bbb';
  }

  @Get('ccc')
  @UseInterceptors(CatchErrorTestInterceptor)
  ccc9999() {
    throw new Error('xxxx');
    return 'ccc';
  }

  @Get('ddd')
  @UseInterceptors(TimeoutInterceptor)
  async ddd() {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    return 'ddd';
  }

  // 这里引用到全局的interceptor (在app.moudle配置)
  @Get('eee')
  eee() {
    return 'eee';
  }
}

// 总结
// rxjs是一个处理异步逻辑的库，它的特点就是oprator多，你可以通过组合oprator来完成逻辑，不需要自己写
// nest的interceptor就用了rxjs来处理响应，但常用的operator就这么几个
// tap: 不修改响应数据，执行一些额外的逻辑，比如记录日志、更新缓存等
// map: 对响应数据做修改，一般都是改成 { code, data, message } 的格式
// catchError: 在exception filter之前处理抛出的异常，可以记录或者抛出别的异常
// timeout: 处理响应超时的情况，抛出一个TimeoutError，配合catchError可以返回超时的响应

// interceptor也是可以注入依赖的 你可以通过注入模块内的各种provider 比如全局interceptor可以通过APP_INTERCEPTOR的token声明，
// 这种能注入依赖，比app.useGlobalInterceptors更好
