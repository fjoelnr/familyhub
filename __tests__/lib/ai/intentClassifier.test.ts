import { classifyIntent } from "@/lib/ai/intentClassifier";
import * as chatOrchestrator from "@/lib/ai/chatOrchestrator";
import { ContextSnapshot } from "@/lib/contracts/context";

// Mock orchestrator
jest.mock("@/lib/ai/chatOrchestrator");

describe("Intent Classifier", () => {
    const mockCreateChatResponse = chatOrchestrator.createChatResponse as jest.Mock;

    const mockContext: ContextSnapshot = {
        date: "2024-01-01",
        time: "12:00",
        dayPhase: "afternoon",
        dayType: "schoolDay",
        regionalHoliday: null,
        schoolHolidayRange: null,
        uiMode: "calm",
        presence: { home: true }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.USE_MOCK_DATA = "false";
    });

    afterEach(() => {
        delete process.env.USE_MOCK_DATA;
    });

    it("should use deterministic rules for greetings", async () => {
        const result = await classifyIntent("Hello", mockContext);

        expect(result.intent).toBe("smalltalk");
        expect(result.confidence).toBe(1.0);
        expect(mockCreateChatResponse).not.toHaveBeenCalled();
    });

    it("should use Mock Mode when enabled", async () => {
        process.env.USE_MOCK_DATA = "true";

        const result1 = await classifyIntent("Plan a party", mockContext);
        expect(result1.intent).toBe("planning");

        const result2 = await classifyIntent("Check calendar", mockContext);
        expect(result2.intent).toBe("calendar_action");
    });

    it("should call Orchestrator with systemPromptOverride for complex inputs", async () => {
        mockCreateChatResponse.mockResolvedValue({
            text: JSON.stringify({
                intent: "information",
                confidence: 0.95,
                entities: { topic: "history" }
            }),
            provider: "mock",
            model: "mock"
        });

        const result = await classifyIntent("Who was Napoleon?", mockContext);

        expect(mockCreateChatResponse).toHaveBeenCalledWith(
            "Who was Napoleon?",
            expect.objectContaining({
                systemPromptOverride: expect.stringContaining("Return ONLY a valid JSON object"),
                timeoutMs: 3000
            })
        );

        expect(result.intent).toBe("information");
        expect(result.entities?.topic).toBe("history");
    });

    it("should handle JSON parsing errors by falling back to unknown", async () => {
        mockCreateChatResponse.mockResolvedValue({
            text: "This is not JSON",
            provider: "mock",
            model: "mock"
        });

        const result = await classifyIntent("Weird input", mockContext);

        expect(result.intent).toBe("unknown");
        expect(result.confidence).toBe(0);
    });

    it("should handle orchestrator failures", async () => {
        mockCreateChatResponse.mockRejectedValue(new Error("Timeout"));

        const result = await classifyIntent("Input", mockContext);

        expect(result.intent).toBe("unknown");
    });
});
