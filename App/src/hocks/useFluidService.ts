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
    return client ;
}

export async function createStorageContainer(user: ICurrentUser): Promise<string> {
    let container;
    
    ({ container } = await getClient(user).createContainer(containerSchema));
    (container.initialObjects.storypointPokerMap as SharedMap).set("ownerId", user.id);

    const id = await container.attach();
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


export const useFluidService = (containerId: string, user: ICurrentUser) => {
    const [fluidMap, setFluidMap] = useState<SharedMap | undefined>(undefined);
    const [audience, setAudience] = useState<IAzureAudience | undefined>(undefined);
    const [gameData, setGameData] = useState<IGameInfo | undefined>(undefined);

    const dataRef = useRef(gameData);
    useEffect(() => {
        getAudience(containerId, user).then((audience: IAzureAudience) => {
            setAudience(audience);
            getStorypointPokerMap(containerId, user).then((value: SharedMap) => {
                setFluidMap(value);
            });
        });
    }, [containerId,user]);



    useEffect(() => {
        const addUser = (clientId: string, member: AzureMember<any>) => {
            if (dataRef.current) {
                //   dataRef.current.players
            }
        }
        const removeUser = (clientId: string, member: AzureMember<any>) => {
            //
        }
        const init = () => {
            const members = audience?.getMembers();
            const playerInfo: IPlayer[] = [];
            members?.forEach((m: AzureMember<ICurrentUser>) => {
                playerInfo.push({
                    id: m.userId,
                    name: m.userName,
                });
            });
            if (dataRef.current) {
                dataRef.current.players = playerInfo;
            } else {
                dataRef.current = {
                    showResult: false,
                    players: playerInfo
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

        }
        (fluidMap as SharedMap)?.on("valueChanged", syncView);
        return () => { (fluidMap as SharedMap)?.off("valueChanged", syncView) }

    }, [fluidMap]);

    const setSelectedValue = (userId: string, value: number): void => {
        //todo
    }
    const toggleState = () => {
        (fluidMap as SharedMap).set('showResult', !gameData?.showResult)
    }



    return [gameData, setSelectedValue, toggleState];
};