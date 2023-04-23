export class Link {
    constructor(
        public name: string,
        public icon: string,
        public iconSize: number,
        public url: string
    ) {
        this.icon = `/header/${icon}`;
    }
}