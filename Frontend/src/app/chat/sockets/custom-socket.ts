import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { tokenGetter } from 'src/app/app.config';


const config: SocketIoConfig = {
	url: 'http://localhost:3333', options: {
	  extraHeaders: {
		Authorization: tokenGetter()
	  }
	}
  };


@Injectable({providedIn: 'root'})
export class CustomSocket extends Socket {
	constructor() {
		super(config)
	}

	configSocket() {
		const config: SocketIoConfig = {
			url: 'http://localhost:3333', options: {
			  extraHeaders: {
				Authorization: tokenGetter()
			  }
			}
		  };
		}
}