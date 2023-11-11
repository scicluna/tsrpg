import { Item, ItemType } from "@/types/types";
import fs from "fs/promises";

export async function parseItems(tier: number) {
    const itemDict: { [key: string]: Item } = {};

    const itemFiles = await fs.readdir(`./vault/t${tier}/items`);
    const filteredFiles = itemFiles.filter(file => file.endsWith(".md"));

    for (const file of filteredFiles) {
        const itemContent = await fs.readFile(`./vault/t${tier}/items/${file}`, "utf-8");

        const itemName = file.split(".")[0].replace(/-/g, " ");
        const itemDescription = itemContent.split("## Description:")[1].split("##")[0].trim();
        const itemType = itemContent.split("## Type:")[1].split("##")[0].trim();

        // Parsing stats
        const statsSection = itemContent.split("## Stats:")[1]?.split("##")[0].trim();
        const stats = statsSection?.split("\n").reduce((acc, line) => {
            const [key, value] = line.split("=");
            acc[key.trim()] = parseInt(value.trim());
            return acc;
        }, {} as any) || {};

        // Constructing the item
        const item: Item = {
            name: itemName,
            description: itemDescription,
            type: itemType as ItemType,
            stats: {
                args: [stats]
            }
        };

        itemDict[itemName] = item;
    }

    return itemDict;
}