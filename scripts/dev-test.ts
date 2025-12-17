// scripts/dev-test.ts
import { getContextSnapshot } from "@/lib/context/getContextSnapshot";
import { classifyIntent } from "@/lib/ai/intentClassifier";
import { routeIntent } from "@/lib/agents/agentRouter";

async function run(input: string) {
    const context = getContextSnapshot();
    const intent = await classifyIntent(input, context);
    const response = await routeIntent(intent, context, input);

    console.log("INPUT:", input);
    console.log("INTENT:", intent);
    console.log("RESPONSE:", response);
}

run("Add dentist tomorrow at 10am");
