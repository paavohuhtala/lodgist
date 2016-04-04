
namespace lodgist.database {
    export interface IQueryResults<T> {
        results: T[]
        totalCount: number
        offset?: number
    }
}
