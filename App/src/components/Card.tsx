import styles from './Card.module.scss';
import React from 'react';


export interface CardProps {
    value: number;
    selected: boolean;
    onSelect: (value: number) => void;
}

export function Card(props: CardProps) {

    const cardclass = [styles.card];
    if (props.selected) {
        cardclass.push(styles.selected)
    }
    return (
        <div
            className={cardclass.join(' ')}
            onClick={() => { props.onSelect(props.value) }}>
            <div className={styles.innerCard}>
                <span>{props.value}</span>
            </div>
        </div>
    )
}