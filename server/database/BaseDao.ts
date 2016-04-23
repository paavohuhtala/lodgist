
import {getClient} from "./Connection";
import * as pgp from "pg-promise"
import {QuerySettings, IQuerySettings} from "./QueryParams"
import * as _ from "lodash"
import * as Promise from "bluebird"

export abstract class BaseDao<TRow extends {}, TKey> {
    private _table: string
    private keyColumn: string
    
    private connection: pgp.IDatabase<any>

    constructor(table: string, keyColumn: string, connection?: pgp.IDatabase<any>) {
        this._table = table;
        this.keyColumn = keyColumn;
        
        if (connection) {
            this.connection = connection;
        }
    }
    
    private getClient() {
        if (this.connection) {
            return this.connection;
        }
        
        return getClient();
    }
    
    public get table() {
        return this._table;
    }

    private applyQuerySettings(settings: IQuerySettings, params: Object) {
        settings = QuerySettings.validate(params);
        
        _.assign(params, settings)
    }
    
    private get limitOffset() {
        return "LIMIT ${limit} OFFSET ${offset}";        
    }
    
    public getAllByColumn<TColumn>(column: string, value: TColumn, settings?: IQuerySettings) {
        let params = {
            table: this.table,
            column: column,
            value: value
        }

        this.applyQuerySettings(settings, params);

        let query = "SELECT * FROM ${table~} WHERE ${column~} = $<value> " + this.limitOffset

        return this.getClient().query(query, params).then(r => <TRow[]> r.rows);
    }

    public getOneByColumn<TColumn>(column: string, value: TColumn) {
        let params = {
            table: this.table,
            column: column,
            value: value,
        }

        let query = "SELECT * FROM ${table~} WHERE ${column~} = ${value}"

        return this.getClient().oneOrNone(query, params).then(r => <TRow> r);
    }
    
    public getAll(settings?: IQuerySettings) {
        let params = {
            table: this.table
        }
        
        this.applyQuerySettings(settings, params)
        
        let query = "SELECT * FROM ${table~} " + this.limitOffset 
        
        return this.getClient().manyOrNone(query, params).then(r => <TRow[]> r);
    }
    
    protected abstract getColumns() : string[]
    
    protected onValidate(row: TRow) {
        return true;
    }
    
    /*public validateRow(row: TRow) {
        const hasAllColumns = this.getColumns().map(r => r in row).reduce((l, r) => l && r, true);
        
        if (hasAllColumns) {
            return this.onValidate(row);
        } else {
            return false;
        }
    }*/
        
    public insert(row: TRow) {
        
        if (!this.onValidate(row)) {
            return null;
        }
        
        const filtered = _.pick<TRow, TRow>(row, this.getColumns())
        const keys = _.keys(filtered)
        const keysTemplate = keys.join(", ")
        const valuesTemplate = keys.map(k => "${" + k + "}").join(", ")
        
        let params = {
            table: this.table,
            keyColumn: this.keyColumn
        }
        
        _.assign(params, filtered);
        
        let query = "INSERT INTO ${table~} (" + keysTemplate + ") VALUES (" + valuesTemplate + ") RETURNING ${keyColumn~}"
        
        return this.getClient().one(query, params).then(r => <TKey> r[this.keyColumn]);
    }
    
    public update<TFilter>(update: Object, column: string, filterValue: TFilter) {
        
        const filteredUpdate = _.pick<TRow, TRow>(<TRow> update, this.getColumns());
        const keys = _.keys(filteredUpdate);
        const valuesTemplate = keys.map(k => k + " = ${" + k + "}").join(", ");
        
        let params = {
            table: this.table,
            column: column,
            filterValue: filterValue
        }

        _.assign(params, filteredUpdate);
        
        let query = "UPDATE ${table~} SET " + valuesTemplate + " WHERE ${column~} = ${filterValue}"

        return this.getClient().query(query, params);
    }
    
    public exists<TValue>(column: string, value: TValue) {
        if (this.getColumns().indexOf(column) < 0) {
            return Promise.reject<boolean>(`Invalid column "${column}"`)
        }
        
        let params = {
            table: this.table,
            column: column,
            value: value
        }
        
        let query = "SELECT EXISTS(SELECT 1 FROM ${table~} WHERE ${column~} = ${value})";
         
        // FIXME: dirty cast hack
        return <Promise<boolean>> <any> this.getClient().one(query, params);
    }
    
    public delete(id: TKey) {
        let params = {
            table: this.table,
            column: this.keyColumn,
            value: id
        }
        
        let query = "DELETE FROM ${table~} WHERE ${column~} = ${value}"
        
        return this.getClient().query(query, params);
    }
    
    public getById(id: TKey) {
        return this.getOneByColumn(this.keyColumn, id);
    }
}
