
import * as pgp from "pg-promise"
import * as Promise from "bluebird"

const pg = pgp({promiseLib: Promise});

var client : pgp.PromiseClient = null;

export function initialize(connectionString: string) {
    client = pg(connectionString);
}

export function getClient() {
    return client;
}