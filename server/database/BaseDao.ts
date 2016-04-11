
import {getClient} from "./Connection";
import * as pgp from "pg-promise"
import {QueryParams, IQueryParams} from "./QueryParams"
import * as _ from "lodash"

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
    
    private get baseQuery() {
        return `SELECT * FROM ${this._table}`;
    }
    
    private getLimitOffset(params?: IQueryParams) {
        params = QueryParams.validate(params);
        
        return `LIMIT ${params.limit} OFFSET ${params.offset}`;
    }
    
    public getAllByColumn<TColumn>(column: string, value: TColumn, params?: IQueryParams) {
        return getClient().query(`${this.baseQuery} WHERE ${column} = $1 ${this.getLimitOffset(params)}`, value)
               .then(r => <TRow[]> r.rows);
    }

    public getOneByColumn<TColumn>(column: string, value: TColumn) {
        return getClient().oneOrNone(`${this.baseQuery} WHERE ${column} = $1`, value).then(r => <TRow> r)
    }
    
    public getAll(params?: IQueryParams) {
        params = QueryParams.validate(params);
        
        let query = `${this.baseQuery} ${this.getLimitOffset(params)}`
        
        console.log(query);
        
        return getClient().manyOrNone(query).then(r => <TRow[]> r);
    }
    
    protected abstract getColumns() : string[]
    
    private toKeyValuePairs(keyValues: Object, indexOffset = 0) : [string, any[]] {
        const pairs = <[string, any][]> _.toPairs(_.pick(keyValues, this.getColumns()));
        const template = pairs.map(([l,], i) => `${l}=$${i + 1 + indexOffset}`).join(", ");
        const values = pairs.map(([,r]) => r);
        
        return [template, values];
    }
    
    public insert(row: TRow) {
        const pairs = <[string, any][]> _.toPairs(_.pick(row, this.getColumns()));
        const keys = pairs.map(([l,]) => l).join(", ");
        const values = pairs.map(([,r]) => r);
        const valuesTemplate = _.range(1, values.length).map(i => "$" + i).join(", ");
        
        return getClient().one(`INSERT INTO ${this.table} (${keys}) VALUES (${valuesTemplate}) RETURNING ${this.keyColumn}`, values).then(r => <TKey> r);
    }
    
    public update(keyValues: Object, filter: Object) {
        const [updateTemplate, updateValues] = this.toKeyValuePairs(keyValues);
        const [filterTemplate, filterValues] = this.toKeyValuePairs(filter, updateValues.length);
        
        let query = `UPDATE ${this.table} SET ${updateTemplate} WHERE ${filterTemplate}`;
        let params = [].concat(updateValues).concat(filterValues);
        
        console.log(query);
        console.log(JSON.stringify(params));
        
        return getClient().query(query, params);
    }
    
    public getById(id: TKey) {
        return this.getOneByColumn(this.keyColumn, id);
    }
}