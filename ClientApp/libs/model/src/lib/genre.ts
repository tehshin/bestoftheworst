export class Genre {
    id: number;
    name: string;

    public constructor(init?: Partial<Genre>) {
        Object.assign(this, init);
    }
}
