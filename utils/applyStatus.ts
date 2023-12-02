import { Monster, Player, StatusEffect } from "@/types/types";

export function applyStatus(target: Player | Monster, newEffect: StatusEffect) {
    const existingEffect = target.stats.status.find(effect => effect.type === newEffect.type);
    if (existingEffect) {
        existingEffect.duration += newEffect.duration; // Stack the duration
        if (existingEffect.intensity){
            existingEffect.intensity = Math.max(existingEffect.intensity, newEffect.intensity!); // Keep the higher intensity
        }
    } else {
        target.stats.status.push(newEffect); // Apply new effect if not present
    }
}