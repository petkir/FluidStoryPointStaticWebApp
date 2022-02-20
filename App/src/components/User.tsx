//import styles from './User.module.scss';
import React from "react";

import { Facepile, PersonaSize } from '@fluentui/react';
import { useLocalStorage } from '../hocks/useLocalStorage';



export function User(){
const [user] = useLocalStorage("user", undefined);
return (<div className="UserContainer">
    {user ?
        <div className="MyUser">
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