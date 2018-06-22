export class Link {
    id: number;
    linkType: number;
    href: string;

    public constructor(init?: Partial<Link>) {
        Object.assign(this, init);
    }
}
