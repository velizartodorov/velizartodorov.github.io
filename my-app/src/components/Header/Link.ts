
export class Link {
    name: string;
    icon: string;
    iconSize: number;
    url: string;

    constructor(name: string, icon: string, iconSize: number, url: string) {
        this.name = name;
        this.icon = "/profile/" + icon;
        this.iconSize = iconSize;
        this.url = url;
    }
}