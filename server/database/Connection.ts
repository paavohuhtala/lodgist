
import * as pgp from "pg-promise"
import * as Promise from "bluebird"
import * as range from "pg-range"

const options = {
    promiseLib: Promise
};

const pgpInstance = pgp(options);
range.install(pgpInstance.pg);

var client : pgp.IDatabase<any> = null;

export function initialize(connectionString: string) {
    client = pgpInstance(connectionString);
}

export function getClient() {
    return client;
}