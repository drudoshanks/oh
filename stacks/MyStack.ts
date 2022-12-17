import { Api, RDS, StackContext } from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {
  const DATABASE = "OhDB";

  // Create the Aurora DB cluster
  const cluster = new RDS(stack, "Cluster", {
    engine: "postgresql10.14",
    defaultDatabaseName: DATABASE,
    migrations: "services/migrations",
  });

  // Create a HTTP API
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        environment: {
          DATABASE,
          CLUSTER_ARN: cluster.clusterArn,
          SECRET_ARN: cluster.secretArn,
        },
        permissions: [cluster],
      },
    },
    routes: {
      "GET /invoice/{id}": "functions/invoice.handler",
      "POST /invoice": "functions/invoice.create",
      "GET /patient/{id}": "functions/patient.handler",
      "POST /patient": "functions/patient.create",
      "GET /payment/{id}": "functions/payment.handler",
      "POST /payment": "functions/payment.create",
      "GET /transactions/{id}": "functions/transactions.handler",
      "POST /transactions": "functions/transactions.create",
      "GET /notification": "functions/notification.handler",
    },
  });

  console.log(api.url);
  

  // Show the resource info in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    SecretArn: cluster.secretArn,
    ClusterIdentifier: cluster.clusterIdentifier,
  });
}
