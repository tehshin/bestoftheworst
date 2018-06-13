export class PageInfo {
    text: string;
    pageIndex: number;
    clickable: boolean = true;

    public constructor(init?: Partial<PageInfo>) {
        Object.assign(this, init);
    }
}
