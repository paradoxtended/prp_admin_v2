---@class PlayerData
---@field charName string;
---@field id number;
---@field steam string | number;
---@field accName string;
---@field admin boolean;
---@field online boolean;
---@field stateId number;

---@class JobsData
---@field label string;
---@field amount number;
---@field color string;

---@class FetchedPlayer
---@field banned boolean;
---@field identifiers? { steam: string?, license: string?, discord: string? };
---@field coords { x: number, y: number, z: number };
---@field account { bank: number, cash: number };
---@field jobs { name: string, label: string, grade: number | string };
---@field ped number | string;

---@class DatabasePlayerData
---@field characterName string;
---@field steam string;
---@field admin boolean;
---@field stateId number;