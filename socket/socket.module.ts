import { NgModule } from '@angular/core';
import { SocketClient } from './socket-client';

@NgModule({
    providers:[SocketClient],
})
export class SocketModule {}
