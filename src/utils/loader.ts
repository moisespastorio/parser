import * as fs from "node:fs";
import * as path from "node:path";

export function readSource(dirname: string, fileName: string) {
    return fs.readFileSync(path.join(dirname, fileName), "utf-8");
}