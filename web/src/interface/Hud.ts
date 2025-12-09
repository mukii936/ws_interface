export type PlayerData = {
    show: boolean;
    playerid: number | null;
    health: number;
    hunger: number;
    thirst: number;
    stress: number;
    armor: number;
    oxygen: number;
    voicelv: number;
    playerDead: boolean;
    talking: boolean;
}

export type CopData = {
    amountPD: number;
}

export type EmsData = {
    amountEms: number;
}

export type UpdateMoney = {
    cash: number;
    bank: number;
    amount: number;
    minus: boolean;
    type: string;
}

export type UpdateLevel = {
    ExpPlayer: number;
    LevelPlayer: number;    
}


export type ShowAccounts = {
    type: string;
    amount: number;
}

export type MenuData = {
    show: boolean;
}

export type CheckboxProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
}


export type CarData = {
    show: boolean;
    seatbelt: boolean;
    speed: number;
    fuel: number;
    gear: number;
    rpm: number;
    rpmPercent: number;
    light: number;
    engine: number;
    vehicleType: string;
    turnLeft: boolean;
    turnRight: boolean;
    TyreBurst1: string | null;
    TyreBurst2: string | null;
    TyreBurst3: string | null;
    TyreBurst4: string | null;
    TyreHealth1: number;
    TyreHealth2: number;
    TyreHealth3: number;
    TyreHealth4: number;
    brake: boolean;
    engineRunning: boolean;
}


export type UpdateAvatar = {
    avatar: string;
}