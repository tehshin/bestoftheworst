export class Link {
    id: number;
    name: string;
    linkType: number;
    href: string;

    public constructor(init?: Partial<Link>) {
        Object.assign(this, init);
    }
}
