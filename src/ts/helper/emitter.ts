export default interface Emitter {
    emit: <R>(method:string, args?:any[]) => R;
    get: <R>(property:string) => R;
    set: <T>(property:string, value:T) => void;
}