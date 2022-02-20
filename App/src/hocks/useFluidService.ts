import { useState, useEffect, useRef } from "react";

import { IValueChanged, SharedMap } from "fluid-framework";
import { IGameInfo } from "../interfaces/IGameInfo";
import { AzureClient, AzureMember, IAzureAudience } from "@fluidframework/azure-client";
import { getConnectionConfig } from "../config";
import { ICurrentUser } from "../interfaces/ICurrentUser";
import { IPlayer } from "../interfaces/IPlayer";




let client: AzureClient | undefined = undefined;

const containerSchema = {
    initialObjects: { storypointPokerMap: SharedMap }
};

export function getClient(user: ICurrentUser): AzureClient {
    if (!client) {
        client = new AzureClient(getConnectionConfig(user.id, user.name));
    }
    return client;
}

export async function createStorageContainer(user: ICurrentUser): Promise<string> {
    let container;

    ({ container } = await getClient(user).createContainer(containerSchema));
    (container.initialObjects.storypointPokerMap as SharedMap).set("ownerId", user.id);

    const id = await container.attach();
    debugger;
    return id;
}

export const getStorypointPokerMap = async (containerId: string, user: ICurrentUser): Promise<SharedMap> => {
    let container;
    ({ container } = await getClient(user).getContainer(containerId, containerSchema));
    return container.initialObjects.storypointPokerMap as SharedMap;
}

export const getAudience = async (containerId: string, user: ICurrentUser): Promise<IAzureAudience> => {
    let services;
    ({ services } = await getClient(user).getContainer(containerId, containerSchema));
    return services.audience;
}

const valueKey: string = "valkey";

export const useFluidService = (containerId: string, user: ICurrentUser) => {
    const [fluidMap, setFluidMap] = useState<SharedMap | undefined>(undefined);
    const [audience, setAudience] = useState<IAzureAudience | undefined>(undefined);
    const [gameData, setGameData] = useState<IGameInfo>({} as IGameInfo);

    const dataRef = useRef(gameData);
    useEffect(() => {
        getAudience(containerId, user).then((audience: IAzureAudience) => {
            setAudience(audience);
            getStorypointPokerMap(containerId, user).then((value: SharedMap) => {
                setFluidMap(value);
            });
        });
    }, [containerId, user]);



    useEffect(() => {
        const addUser = (clientId: string, member: AzureMember<any>) => {
            if (dataRef.current) {
                //   dataRef.current.players
                dataRef.current.players.push({
                    id: member.userId,
                    name: member.userName,

                    isOwner: dataRef.current.ownerId === member.userId
                })
            }
        }
        const removeUser = (clientId: string, member: AzureMember<any>) => {
            //
        }
        const init = () => {
            debugger;
            const members = audience?.getMembers();
            const playerInfo: IPlayer[] = [];

            members?.forEach((m: any) => {
                playerInfo.push({
                    id: m.userId,
                    name: m.userName ? m.userName : "No Username Set",
                });
            });
            if (dataRef.current) {
                dataRef.current.players = playerInfo;
            } else {
                dataRef.current = {
                    showResult: false,
                    players: playerInfo,
                    ownerId:""
                }
            }
            setGameData(dataRef.current);
        }
        if (audience) {
            init();
            audience.on("memberAdded", addUser);
            audience.on("memberRemoved", removeUser);

        }

        return () => {
            if (audience) {
                audience.off("memberAdded", addUser);
                audience.off("memberRemoved", removeUser);
                //audience.off("membersChanged", membersChanged);
            }
        }

    }, [audience]);
    useEffect(() => {

        const syncView = (changed: IValueChanged, local: boolean, target: SharedMap) => {
            const clone = dataRef.current ? { ...dataRef.current } : { showResult: false, players: [], ownerId:"" };
            clone.players = dataRef.current.players.slice();
            if (fluidMap && changed.key === "ownerId") {
                clone.ownerId = fluidMap.get(changed.key) as string;
                if (local && !clone.showResult) {
                    //Reset all
                    const keysToReset = Array.from(fluidMap.keys()).filter(k => k.startsWith(valueKey));
                    keysToReset.forEach(element => {
                        fluidMap.set(element, undefined);
                    });

                }
            }
            if (fluidMap && changed.key === "showResult") {
                clone.showResult = fluidMap.get(changed.key) as boolean;
                if (local && !clone.showResult) {
                    //Reset all
                    const keysToReset = Array.from(fluidMap.keys()).filter(k => k.startsWith(valueKey));
                    keysToReset.forEach(element => {
                        fluidMap.set(element, undefined);
                    });

                }
            }
            if (fluidMap && changed.key.startsWith(valueKey)) {
                var playerid = changed.key.substring(valueKey.length);
                var value = fluidMap.get(changed.key) as number;
                const index = clone.players.findIndex(v => v.id === playerid);
                if (index !== -1) {
                    clone.players[index].selectedValue = value;
                } else {
                    clone.players.push({ id: playerid, name: "dyngen", selectedValue: value });
                }
            }
            dataRef.current = clone;
            setGameData(clone);

        }
        (fluidMap as SharedMap)?.on("valueChanged", syncView);
        return () => { (fluidMap as SharedMap)?.off("valueChanged", syncView) }

    }, [fluidMap, setGameData]);

    function setSelectedValue(userId: string, value: number): void {
        if (fluidMap) {
            fluidMap.set(valueKey + userId, value);
        }
    }
    function toggleState(): void {
        if (gameData) {
            const current = gameData.showResult;
            debugger;
            (fluidMap as SharedMap).set('showResult', !current);
        }
    }



    return { gameData, setGameData, setSelectedValue, toggleState };
};