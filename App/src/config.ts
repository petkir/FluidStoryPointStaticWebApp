import { AzureClientProps, AzureFunctionTokenProvider } from "@fluidframework/azure-client";
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";

export const useAzure = false;




export function getConnectionConfig(userId: string, userName: string): AzureClientProps {
    if (useAzure) {
        return ({
            connection: {
                tokenProvider: new AzureFunctionTokenProvider("/api/GetToken", { userId: userId, userName: userName }),
                tenantId: "02af75bb-9f70-487b-9d84-5390f4079a1f",
                endpoint: "https://eu.fluidrelay.azure.com",
                type: "remote",
            }
        })
    }
    
    if (!useAzure) {
        //http://localhost:7071
        return ({
            connection: {
                type: "remote",
                tokenProvider: new AzureFunctionTokenProvider(
                  "https://lemon-plant-01c5e7c10.1.azurestaticapps.net/api/GetToken", { userId: userId, userName: userName }
                ),
               tenantId: "02af75bb-9f70-487b-9d84-5390f4079a1f",
                endpoint: "https://eu.fluidrelay.azure.com"
              }
        })
    }

    return ({
        connection: {
            type: "local",
            tokenProvider: new InsecureTokenProvider("fooBar", {
                id:userId,
                
            }),
            endpoint: "http://localhost:7070"
        }
    });
} 