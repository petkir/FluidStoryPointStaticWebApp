import styles from './Play.module.scss';
import React from "react";
import { Card } from '../components/Card';
import { IPlayer } from '../interfaces/IPlayer';
import { Player } from '../components/Player';

import { Routes, Route, useParams } from "react-router-dom";
import { useLocalStorage } from '../hocks/useLocalStorage';
export interface PlayProps {

}

export function Play(props: PlayProps) {
    let params = useParams();
    const [user, setUser] = useLocalStorage("user", undefined);
    const [myselection, setMySelection] = React.useState(-1);
    const player:IPlayer[] =[{id:"1",name:"peter", selectedValue:1 , isOwner:true},
    {id:"2",name:"birgit", selectedValue:10}]
    const cards = [0, 1, 2, 3, 5, 7, 10, 13, 17, 25, 30];

    return (
        <div className={styles.Play}>
            <div className={styles.Player}>
            {
                player.map((p,i)=>{
                    return (<Player {...p} isMe={p.id === user?.id } key={'player'+i} />);
                })
            }
            <div>
                Invite other use this Link:
                
            </div>
            </div>
            <div className={styles.PlayZone}>
                <div className={styles.Cards}>
                    {
                        cards.map((c, i) => {
                            return (
                                <Card value={c} key={'card'+i} selected={c === myselection}
                                    onSelect={(value) => { setMySelection(value); }} />
                            );
                        })
                    }
                </div>
            </div>
        </div>
    )
}