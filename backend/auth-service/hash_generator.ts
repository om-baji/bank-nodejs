import { createHash } from "crypto";

export function hashMaker(inputs: string){
    return createHash('sha256').update(inputs).digest('hex'); 
}