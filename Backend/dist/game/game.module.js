"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = void 0;
const common_1 = require("@nestjs/common");
const game_controller_1 = require("./game.controller");
const game_service_1 = require("./game.service");
const game_gateway_1 = require("./game.gateway");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("@nestjs/axios");
const user_module_1 = require("../user/user.module");
const auth_module_1 = require("../auth/auth.module");
const mail_service_1 = require("../mail/mail.service");
let GameModule = class GameModule {
};
exports.GameModule = GameModule;
exports.GameModule = GameModule = __decorate([
    (0, common_1.Module)({
        controllers: [game_controller_1.GameController],
        providers: [game_service_1.GameService, game_gateway_1.GameGateway, prisma_service_1.PrismaService, auth_service_1.AuthService, mail_service_1.MailService],
        imports: [jwt_1.JwtModule, axios_1.HttpModule, user_module_1.UserModule, auth_module_1.AuthModule]
    })
], GameModule);
//# sourceMappingURL=game.module.js.map