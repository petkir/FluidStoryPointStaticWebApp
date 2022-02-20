import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { IUser, ScopeType } from "@fluidframework/azure-client";
import { generateToken } from "@fluidframework/azure-service-utils";


export interface IUserData extends IUser {
    name: string;
}

const key = "FRSKey"
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const tenantId = (req.query.tenantId || (req.body && req.body.tenantId)) as string;
    const userId = (req.query.userId || (req.body && req.body.userId)) as string;
    const userName = (req.query.userName || (req.body && req.body.userName)) as string;
    const documentId = (req.query.documentId || (req.body && req.body.documentId)) as string;

    if (!tenantId) {
        context.res = {
            status: 400,
            body: "No tenantId provided in query params",
        };
        return;
    }
    if (!documentId) {
        context.res = {
            status: 400,
            body: "No documentId provided in query params"
        };
        return;
    }
    const secret = process.env[key];
    if(!secret){
        context.res = {
            status: 400,
            body: "No secret provided ",
        };
        return;
    }
    

    let user: IUserData = { id: userId, name: userName, };
    console.log('Ready to generate token');
    const token = generateToken(
        tenantId,
        secret,
        [ScopeType.DocRead, ScopeType.DocWrite, ScopeType.SummaryWrite],
        documentId,
        user 
    );

    context.res = {
        status: 200,
        body: token
    };
};

export default httpTrigger;