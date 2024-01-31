import unitmath from "unitmath";
export type UnitFactory = ReturnType<typeof unitmath.config<number>>;
export type Unit = ReturnType<UnitFactory>;
export declare const unit: UnitFactory;
