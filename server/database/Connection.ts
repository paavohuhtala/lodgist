
import * as pgp from "pg-promise"
import * as Promise from "bluebird"

const options = {
    promiseLib: Promise
};

const pg = pgp();

var client : pgp.IDatabase<any> = null;

export function initialize(connectionString: string) {
    client = pg(connectionString);
}

export function getClient() {
    return client;
}