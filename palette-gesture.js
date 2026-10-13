// Horizontal movement browses tools. Only a deliberate upward drag places a building.
export function paletteIntent(dx,dy,building){if(Math.hypot(dx,dy)<=8)return null;if(Math.abs(dx)>=Math.abs(dy))return 'scroll';if(building&&dy<0&&Math.abs(dy)>Math.abs(dx)*1.4)return 'drag';return 'ignore';}
