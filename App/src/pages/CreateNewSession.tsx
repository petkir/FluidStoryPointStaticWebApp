import { useNavigate } from "react-router-dom";
import { Placeholder } from "../components/Placeholder";
import { stringToHash } from "../functions/stringToHash";
import { createStorageContainer } from "../hocks/useFluidService";
import { useLocalStorage } from "../hocks/useLocalStorage";
import { ICurrentUser } from "../interfaces/ICurrentUser";

export interface CreateNewSessionProps { }

export function CreateNewSession(props: CreateNewSessionProps) {
    const [user, setUser] = useLocalStorage("user", undefined);
    let navigate = useNavigate();
    return (
        <div>
            <Placeholder
                icontext="Welcome to"
                description="Please fill your user"
                buttonLabel="Create Session"
                onButtonPressed={((username) => { 
                    const userId=stringToHash(username+(new Date().toISOString()));
                    const cuser:ICurrentUser={
                        name:username,
                        id: userId.toString()
                    }
                    setUser(cuser);
                    createStorageContainer(cuser).then((containerId:string) =>{
                        navigate(`/play/${containerId}`);
                    })
                })}
                />

      </div>
    );
}