
namespace lodgist.functional {
    export function curry2<T, TArgA, TArgB, TRet>(f: (a: TArgA, b: TArgB) => TRet) {
        return (a: TArgA) => (b: TArgB) => f(a, b);
    }
    
    export function curry3<T, TArgA, TArgB, TArgC, TRet>(f: (a: TArgA, b: TArgB, c: TArgC) => TRet) {
        return (a: TArgA) => (b: TArgB) => (c: TArgC) => f(a, b, c);
    }
}
