import { Profile } from "passport";
declare const FortytwoStrategy_base: new (...args: any[]) => any;
export declare class FortytwoStrategy extends FortytwoStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<void>;
}
export {};
