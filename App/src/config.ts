import { AzureClientProps, AzureFunctionTokenProvider, LOCAL_MODE_TENANT_ID } from "@fluidframework/azure-client";
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";

export const useAzure = true;




export function getConnectionConfig(userId: string, userName: string): AzureClientProps {
    if (useAzure) {
        return ({
            connection: {
                tenantId: "02af75bb-9f70-487b-9d84-5390f4079a1f",
                tokenProvider: new AzureFunctionTokenProvider("https://lemon-plant-01c5e7c10.1.azurestaticapps.net/api/GetToken", { userId: userId, userName: userName }),
                orderer: "https://alfred.westeurope.fluidrelay.azure.com",
                storage: "https://historian.westeurope.fluidrelay.azure.com",
            }
        })
    }

    return ({
        connection: {
            tenantId: LOCAL_MODE_TENANT_ID,
            tokenProvider: new InsecureTokenProvider("fooBar", {
                id:userId,
                
            }),
            orderer: "http://localhost:7070",
            storage: "http://localhost:7070",
        }
    });
} 