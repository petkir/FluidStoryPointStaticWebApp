import styles from './Player.module.scss';
import React from "react";
import { IPlayer } from "../interfaces/IPlayer";
import { Facepile, Icon, PersonaSize } from '@fluentui/react';


export interface PlayerProps extends IPlayer {
isMe?:boolean;
}

export function Player(props: PlayerProps) {
    return (
        <div className={styles.player} >
            <div>
            <Facepile
                personaSize={PersonaSize.size32}
                personas={[{
                    name: props.name,
                }]}

            />
            <div>{props.isMe && <Icon iconName='FavoriteStar'/>} {props.name} {props.isOwner && <Icon iconName='Crown'/>}</div>
            </div>
            {typeof(props.selectedValue) !== "undefined" ?
                <Icon iconName='CheckboxCompositeReversed' color='green' />
                : <Icon iconName='Checkbox' />
            }
        </div>)
}