import { useTranslation } from "react-i18next";
import { Presentation } from "./presentation";

export function usePresentations(): Presentation[] {
    const { t, ready } = useTranslation("presentations");
    if (!ready) return [];

    const list = t("presentations:list", { returnObjects: true }) as Presentation[];
    if (!Array.isArray(list)) return [];

    return list.map((item) => ({
        name: item.name,
        icon: item.icon,
        link: item.link,
    }));
}