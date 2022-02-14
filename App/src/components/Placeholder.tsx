import styles from './Placeholder.module.scss';
import { Icon, PrimaryButton, TextField } from '@fluentui/react'
import React, { useEffect } from 'react';

export interface PlaceholderProps {
    icontext: string;
    description: string;
    buttonLabel: string;
    onButtonPressed?: (user: string) => void;
    children?: any;
    username?:string;
}

export function Placeholder(props: PlaceholderProps) {
    const [username, setUsername] = React.useState('');
    useEffect(()=>{
        if(props.username){
            setUsername(props.username);
        }
    },[props.username])
    return (
        <div className={`${styles.placeholder}`} >
            <div className={styles.placeholderContainer}>
                <div className={styles.placeholderHead}>
                    <div className={styles.placeholderHeadContainer}>
                        {
                            <Icon iconName={"configure"} className={styles.placeholderIcon} />
                        }
                        {props.icontext}
                    </div>
                </div>
                <div className={styles.placeholderDescription}>
                    {props.description}
                </div>
                {props.children}
                <div className={styles.placeholderDescription}>
                    <TextField
                        value={username}
                        onChange={(ev, value) => { setUsername(value ? value : '') }}
                    />
                    <PrimaryButton
                        disabled={!username || username.length < 3}
                        text={props.buttonLabel}
                        ariaLabel={props.buttonLabel}
                        onClick={() => {
                            if (props.onButtonPressed) {
                                props.onButtonPressed(username);
                            }
                        }} />
                </div>
            </div>
        </div>
    )
}