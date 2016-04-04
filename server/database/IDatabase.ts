
namespace lodgist.database {
    export interface IDatabase {
        getTable<T extends Table<TRow, TKey>, TKey, TRow>(name: string): T
    }
}