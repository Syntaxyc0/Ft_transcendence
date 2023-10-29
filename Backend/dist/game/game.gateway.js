"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let GameGateway = class GameGateway {
    constructor() {
        this.connectedSockets = new Map();
        this.lookingForPlayerSockets = new Map();
    }
    onModuleInit() {
        this.server.on('connection', (socket) => {
            this.connectedSockets.set(socket.id, socket);
            console.log(socket.id + ' has connected');
            socket.on('disconnect', () => {
                this.connectedSockets.delete(socket.id);
                this.lookingForPlayerSockets.delete(socket.id);
                console.log(socket.id + " has disconnected");
            });
        });
    }
    getTarget(client, id) {
        const targetSocket = this.connectedSockets.get(id);
        if (!targetSocket)
            client.emit('otherDisconnected', { order: 'otherDisconnected' });
        return (targetSocket);
    }
    warnOther(body, client) {
        const targetSocket = this.connectedSockets.get(body.secondPlayer);
        if (targetSocket) {
            targetSocket.emit('otherDisconnected', { order: 'otherDisconnected' });
            this.lookingForPlayerSockets.set(targetSocket.id, targetSocket);
        }
        this.lookingForPlayerSockets.delete(client.id);
    }
    GameRequest(body, client) {
        const targetSocket = this.getTarget(client, body.secondPlayer);
        if (!targetSocket)
            return;
        targetSocket.emit('onGameRequest', {
            order: body.order
        });
    }
    newBallPos(body, client) {
        const targetSocket = this.getTarget(client, body.secondPlayer);
        if (!targetSocket)
            return;
        targetSocket.emit('onBall', {
            order: "ballUp",
            angle: body.angle,
            x: body.x,
            y: body.y
        });
    }
    searchMultiplayer(client) {
        console.log("Client looking for player: " + client.id);
        for (const [socketId, socket] of this.lookingForPlayerSockets) {
            if (socket.id != client.id) {
                client.emit('playerFound', {
                    order: "newPlayer",
                    player: socket.id,
                    first: true
                });
                socket.emit('playerFound', {
                    order: "newPlayer",
                    player: client.id,
                    first: false
                });
                this.lookingForPlayerSockets.delete(socket.id);
                return;
            }
        }
        this.lookingForPlayerSockets.set(client.id, client);
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('disconnectingClient'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "warnOther", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('GameRequest'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "GameRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('newBallPos'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "newBallPos", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('multiplayerRequest'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "searchMultiplayer", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:4200'],
        }
    })
], GameGateway);
//# sourceMappingURL=game.gateway.js.map