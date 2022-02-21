import styles from './Play.module.scss';
import React from "react";
import { Card } from '../components/Card';
import { Player } from '../components/Player';
import { useParams } from "react-router-dom";
import { useLocalStorage } from '../hocks/useLocalStorage';
import { useFluidService } from '../hocks/useFluidService';
import { IGameInfo } from '../interfaces/IGameInfo';
import { DefaultButton } from '@fluentui/react';
export interface PlayProps {

}

export function Play(props: PlayProps) {
    let params = useParams();
    const [user] = useLocalStorage("user", undefined);
    const { gameData, setSelectedValue, toggleState } = useFluidService(params.sessionId || "invalid", user)

    const cards = [0, 1, 2, 3, 5, 7, 10, 13, 17, 25, 30];
    const getMySelection = (): number | undefined => {
        if (gameData && gameData.players) {
            const my = gameData.players.filter(p => p.id === user.id)
            if (my.length > 0) {
                return my[0].selectedValue;
            }
        }
        return undefined;
    }
    return (

        <div className={styles.Play}>
            <div className={styles.Player}>
                {
                    gameData && (gameData as IGameInfo).players?.map((p, i) => {
                        return (<Player {...p} isMe={p.id === user?.id} key={'player' + i} />);
                    })
                }
                <div>
                    Invite other use this Link:
                    <p>
                        {`${window.location.protocol}//${window.location.hostname}${window.location.port?':'+window.location.port:''}/join/${params.sessionId}`}
                    </p>
                </div>
            </div>
            <div className={styles.PlayZone}>
                {(gameData as IGameInfo).showResult ?
                    <div>Result </div>
                    :
                    <div className={styles.Cards}>
                        {
                            cards.map((c, i) => {
                                return (
                                    <Card value={c} key={'card' + i} selected={c === getMySelection()}
                                        onSelect={(value) => { setSelectedValue(user.id, value); }} />
                                );
                            })
                        }
                    </div>
                }
                <div>
                    <DefaultButton
                        text={gameData.showResult ? 'next Round' : 'Show Result'}
                        onClick={() => toggleState()} />
                </div>
            </div>

        </div>
    )
}