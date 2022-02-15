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

    if (!tenantId) {
        context.res = {
            status: 400,
            body: "No tenantId provided in query params",
        };
        return;
    }

   

/*
    const credential = new DefaultAzureCredential();
    const keyVaultName = process.env["KEY_VAULT_NAME"]
    const url = "https://" + keyVaultName + ".vault.azure.net";

    const client = new SecretClient(url, credential);
    const secret = await client.getSecret(key);
    */
    const secret = process.env[key]

    let user: IUserData = { id: userId, name: userName, };

    const token = generateToken(
        tenantId,
        secret,
        [ScopeType.DocRead, ScopeType.DocWrite, ScopeType.SummaryWrite],
        user as any
    );

    context.res = {
        status: 200,
        body: token
    };
};

export default httpTrigger;