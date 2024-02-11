/// <reference types="bun-types" />
import { BuildOutput } from "bun";
export declare const DIST_PATH = "dist";
export declare function getEntryPoints(): string[];
export declare function buildDist(entrypoints: string[]): Promise<BuildOutput>;
export declare function buildCookbook(): Promise<boolean>;
