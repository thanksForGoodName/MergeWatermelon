export default class Single<T> {
    protected static ins;

    public static instance<T>(c: new () => T): T {
        if (!this.ins) {
            this.ins = new c();
        }
        return this.ins;
    }
}