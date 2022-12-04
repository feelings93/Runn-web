import { sneakerRarityEnum, sneakerTypeEnum } from '../constants/sneaker';

export const mapSneakerRarityToStar = (rarity) => {
  switch (rarity) {
    case sneakerRarityEnum.COMMON:
      return 1;
    case sneakerRarityEnum.UNCOMMON:
      return 2;
    case sneakerRarityEnum.RARE:
      return 3;
    case sneakerRarityEnum.EPIC:
      return 4;
    case sneakerRarityEnum.LEGENDARY:
      return 5;
  }
  throw new Error('not a sneaker rarity');
};

export const mapSneakerTypeToSpeed = (type) => {
  switch (type) {
    case sneakerTypeEnum.RANGER:
      return '1-6';
    case sneakerTypeEnum.HIKER:
      return '4-10';
    case sneakerTypeEnum.SPRINTER:
      return '8-20';
    case sneakerTypeEnum.COACHER:
      return '1-20';
  }
  throw new Error('not a sneaker type');
};

export const mapSneakerTypeToAbout = (type) => {
  switch (type) {
    case sneakerTypeEnum.RANGER:
      return 'Basic sneakers with average scores. Suitable for warming up or walking at 1-6 KM/HR.';
    case sneakerTypeEnum.HIKER:
      return 'Sneakers with a high level of durability. Suitable for regular walks or jogging at 4-10 KM/HR.';
    case sneakerTypeEnum.SPRINTER:
      return 'Sneakers with a high score of durability and fortune. Suitable for active running workouts at 8-20 KM/HR.';
    case sneakerTypeEnum.COACHER:
      return 'The most versatile sneakers with the highest possible scores. Suitable for quiet walks and active training at 1-20 KM/HR.';
  }
  throw new Error('not a sneaker type');
};
