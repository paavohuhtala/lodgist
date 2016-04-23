declare module "pg-range" {
    import * as pg from "pg-subset"

    export function install(client: typeof pg): void;
    export const Range: PgRange.RangeConstructor;
}
