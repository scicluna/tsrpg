import { Monster, Player } from "@/types/types";

export function processStatusEffects(entity: Player | Monster, updateScrollingText: (color: string, text: string) => void) {
    if (!entity.stats.status) return;

    entity.stats.status.forEach(effect => {
        let effectText = "";
        switch (effect.type) {
            case 'poison':
                entity.stats.hp -= effect.intensity || 5;
                effectText = `${entity.name} takes ${effect.intensity || 5} poison damage!`;
                break;
            case 'burn':
                entity.stats.hp -= effect.intensity || 3;
                effectText = `${entity.name} takes ${effect.intensity || 3} burning damage!`;
                break;
            case 'cursed':
                effect.originalValue = entity.stats.damage;
                entity.stats.damage -= effect.intensity || 2;
                effectText = `${entity.name} is cursed, reducing damage!`;
                break;
            case 'regen':
                const regenAmount = Math.min(effect.intensity || 4, entity.stats.maxhp - entity.stats.hp);
                entity.stats.hp += regenAmount;
                effectText = `${entity.name} regenerates ${regenAmount} HP!`;
                break;
            // Add cases for other statuses as needed
        }
        // Display the effect using scrolling text
        if (effectText) {
            updateScrollingText("purple", effectText);
        }
    });

    // Reduce duration and filter out expired effects
    entity.stats.status = entity.stats.status.map(effect => ({
        ...effect,
        duration: effect.duration - 1
    })).filter(effect => {
        if (effect.duration <= 0) {
            // Restore the original stat value if the effect has expired
            if (effect.type === 'cursed') {
                entity.stats.damage = effect.originalValue!;
            }
            return false; // Filter out the expired effect
        }
        return true; // Keep the effect if it's still active
    });
}
