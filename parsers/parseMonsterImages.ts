interface MonsterImageMap {
    [key: string]: string;
}

export function parseMonsterImages(): MonsterImageMap {
    const context = require.context('../vault/monsterimages', false, /\.webp$/);
    const images: MonsterImageMap = {};

    context.keys().forEach((filename) => {
        // Remove './' and '.webp' to get the monster name
        const monsterName = filename.replace('./', '').replace('.webp', '');
        images[monsterName] = context(filename).default.src;
    });

    return images;
}

  