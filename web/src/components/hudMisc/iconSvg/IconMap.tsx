import Heart from "./Heart";
import Shield from "./Shield";
import Hunger from "./Hunger";
import Thirst from "./Thirst";
import Stamina from "./Stamina";
import Stress from "./Stress";

export const IconMap = {
  Heart: Heart,
  Shield: Shield,
  Hunger: Hunger,
  Thirst: Thirst,
  Stamina: Stamina,
  Stress: Stress,
};

export type IconName = keyof typeof IconMap;
