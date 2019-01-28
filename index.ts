import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure";
import * as azureFunction from './azure-function';

// Create an Azure Resource Group
const resourceGroup = new azure.core.ResourceGroup("resourceGroup", {
  location: "WestUS",
});

// Create an Azure resource (Storage Account)
const account = new azure.storage.Account("storage", {
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
  accountTier: "Standard",
  accountReplicationType: "LRS",
});

const fn = new azureFunction.HttpFunction('hi', (ctx: azureFunction.Context, rq: azureFunction.HttpRequest) => {
  const res: azureFunction.HttpResponse = {
    status: azureFunction.HttpStatusCode.OK,
    headers: {
      'content-type': 'text/plain'
    },
    body: 'wat up dawg'
  };

  ctx.done(undefined, res);
});

// Export the connection string for the storage account
export const connectionString = account.primaryConnectionString;

export const fnURL = fn.endpoint;