
import {getClient} from "./Connection";
import * as pgp from "pg-promise"
import {QuerySettings, IQuerySettings} from "./QueryParams"
import * as _ from "lodash"
import * as Promise from "bluebird"

export abstract class BaseDao<TRow extends {}, TKey> {
    private _table: string
    private keyColumn: string

    constructor(table: string, keyColumn: string) {
        this._table = table;
        this.keyColumn = keyColumn;
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

        return getClient().query(query, params).then(r => <TRow[]> r.rows);
    }

    public getOneByColumn<TColumn>(column: string, value: TColumn) {
        let params = {
            table: this.table,
            column: column,
            value: value,
        }

        let query = "SELECT * FROM ${table~} WHERE ${column~} = ${value}"

        return getClient().oneOrNone(query, params).then(r => <TRow> r);
    }
    
    public getAll(settings?: IQuerySettings) {
        let params = {
            table: this.table
        }
        
        this.applyQuerySettings(settings, params)
        
        let query = "SELECT * FROM ${table~} " + this.limitOffset 
        
        return getClient().manyOrNone(query, params).then(r => <TRow[]> r);
    }
    
    protected abstract getColumns() : string[]
    
    private toKeyValuePairs(keyValues: Object, indexOffset = 0) : [string, any[]] {
        const pairs = <[string, any][]> _.toPairs(_.pick(keyValues, this.getColumns()));
        const template = pairs.map(([l,], i) => `"${l}"=$${i + 1 + indexOffset}`).join(", ");
        const values = pairs.map(([,r]) => r);
        
        return [template, values];
    }
    
    public insert(row: TRow) {
        const filtered = _.pick<TRow, TRow>(row, this.getColumns())
        const keys = _.keys(filtered)
        const keysTemplate = keys.join(", ")
        const valuesTemplate = keys.map(k => `$<\{${k}\}`).join(", ")
        
        let params = {
            table: this.table,
            keyColumn: this.keyColumn
        }
        
        let query = "INSERT INTO ${table~} " + keysTemplate + " VALUES (" + valuesTemplate + ") RETURNING ${keyColumn~}"
        
        return getClient().one(query, filtered).then(r => <TKey> r);
    }
    
    // FIXME: update to be like the others
    public update(keyValues: Object, filter: Object) {
        const [updateTemplate, updateValues] = this.toKeyValuePairs(keyValues);
        const [filterTemplate, filterValues] = this.toKeyValuePairs(filter, updateValues.length);
        
        let query = `UPDATE "${this.table}" SET ${updateTemplate} WHERE ${filterTemplate}`;
        let params = [].concat(updateValues).concat(filterValues);
    
        return getClient().query(query, params);
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
        return <Promise<boolean>> <any> getClient().one(query, params);
    }
    
    public delete(id: TKey) {
        let params = {
            table: this.table,
            column: this.keyColumn,
            value: id
        }
        
        let query = "DELETE FROM ${table~} WHERE ${column~} = ${value}"
        
        return getClient().query(query, params);
    }
    
    public getById(id: TKey) {
        return this.getOneByColumn(this.keyColumn, id);
    }
}
