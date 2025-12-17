import { createChatResponse } from "@/lib/ai/chatOrchestrator";
import * as ollamaProvider from "@/lib/ai/providers/ollama";
import * as openaiProvider from "@/lib/ai/providers/openai";
import { ChatResponse } from "@/lib/contracts/ai";

// Mock the providers
jest.mock("@/lib/ai/providers/ollama");
jest.mock("@/lib/ai/providers/openai");

describe("chatOrchestrator", () => {
    const mockCallOllama = ollamaProvider.callOllama as jest.Mock;
    const mockCallOpenAI = openaiProvider.callOpenAI as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.USE_MOCK_DATA = "false";
        process.env.OPENAI_API_KEY = "test-key";
    });

    afterEach(() => {
        delete process.env.USE_MOCK_DATA;
    });

    it("should route to Ollama by default", async () => {
        const mockResponse: ChatResponse = {
            text: "Ollama response",
            provider: "ollama",
            model: "llama3",
        };
        mockCallOllama.mockResolvedValue(mockResponse);

        const result = await createChatResponse("Hello");

        expect(mockCallOllama).toHaveBeenCalled();
        expect(mockCallOpenAI).not.toHaveBeenCalled();
        expect(result).toEqual(mockResponse);
    });

    it("should fallback to OpenAI if Ollama fails", async () => {
        mockCallOllama.mockRejectedValue(new Error("Ollama timeout"));
        const mockResponse: ChatResponse = {
            text: "OpenAI response",
            provider: "openai",
            model: "gpt-4o",
        };
        mockCallOpenAI.mockResolvedValue(mockResponse);

        const result = await createChatResponse("Hello");

        expect(mockCallOllama).toHaveBeenCalled();
        expect(mockCallOpenAI).toHaveBeenCalled();
        expect(result).toEqual(mockResponse);
    });

    it("should throw if both providers fail", async () => {
        mockCallOllama.mockRejectedValue(new Error("Ollama fail"));
        mockCallOpenAI.mockRejectedValue(new Error("OpenAI fail"));

        await expect(createChatResponse("Hello")).rejects.toThrow("All AI providers failed.");
    });

    it("should use Mock data if USE_MOCK_DATA is true", async () => {
        process.env.USE_MOCK_DATA = "true";

        const result = await createChatResponse("Hello");

        expect(result.provider).toBe("mock");
        expect(mockCallOllama).not.toHaveBeenCalled();
        expect(mockCallOpenAI).not.toHaveBeenCalled();
    });

    it("should inject context into system prompt", async () => {
        const mockResponse: ChatResponse = { text: "ok", provider: "ollama", model: "test" };
        mockCallOllama.mockResolvedValue(mockResponse);

        await createChatResponse("Hello", {
            contextOverride: { uiMode: "nerdy", time: "12:00" }
        });

        const calls = mockCallOllama.mock.calls;
        const messages = calls[0][0]; // First arg is messages array
        const systemMessage = messages.find((m: any) => m.role === "system");

        expect(systemMessage.content).toContain("You are a highly technical, nerdy assistant");
        expect(systemMessage.content).toContain("12:00");
    });
});
