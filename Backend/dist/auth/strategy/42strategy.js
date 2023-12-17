"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FortytwoStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
class FortytwoStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy) {
    constructor() {
        super({
            clientID: process.env.FOURTYTWO_CLIENT_ID,
            clientSecret: process.env.FOURTYTWO_CLIENT_SECRET,
            callbackURL: process.env.FOURTYTWO_CALLBACK_URL
        });
    }
    async validate(accessToken, refreshToken, profile) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
    }
}
exports.FortytwoStrategy = FortytwoStrategy;
//# sourceMappingURL=42strategy.js.map