import styles from './User.module.scss';
import React from "react";

import { Facepile, PersonaSize } from '@fluentui/react';
import { useLocalStorage } from '../hocks/useLocalStorage';



export function User(){
const [user, setuser] = useLocalStorage("user", undefined);
return (<div>
    {user ?
        <div>
            <Facepile
                personaSize={PersonaSize.size32}
                personas={[{
                    name: user.name,
                }]}

            />
            <div>{user.name}</div>
        </div>
        : <div />
    }
</div>);
}