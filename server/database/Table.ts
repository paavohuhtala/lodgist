
namespace lodgist.database {
    export abstract class Table<T, K> {
        
        private primaryKeyName: string;
        
        abstract getAll(params?: IQueryParams): IQueryResults<T>
        
        abstract getByColumn<V>(column: string, value: V, params?: IQueryParams): IQueryResults<T>
        
        getById(key: K, params?: IQueryParams) {
            return this.getByColumn<K>(this.primaryKeyName, key, params);
        }
    }
}