//import styles from './Join.module.scss';
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocalStorage } from '../hocks/useLocalStorage';
import { Placeholder } from '../components/Placeholder';
import { ICurrentUser } from '../interfaces/ICurrentUser';
import { stringToHash } from '../functions/stringToHash';

export interface JoinProps {

}

export function Join(props: JoinProps) {
    let params = useParams();
    let navigate = useNavigate();
    const [user, setUser] = useLocalStorage("user", undefined);

    if (!params.sessionId) {
        navigate(`/`);
    }

    return (<div>
        <Placeholder
            icontext="Welcome to"
            description="Please fill your user"
            buttonLabel="Join Session"
            username={user?.name}
            onButtonPressed={((username) => {
                if (username === user?.name) {
                    //same user no update
                    setUser(user);
                } else {
                    const userId = stringToHash(username + (new Date().toISOString()));
                    const cuser: ICurrentUser = {
                        name: username,
                        id: userId.toString()
                    }
                    setUser(cuser);
                }
                setTimeout(() => {
                    navigate(`/play/${params.sessionId}`);
                },100)
                

            })}
        />
    </div>);
}