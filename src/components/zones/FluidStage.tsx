import React from 'react';
import { useFamilyHub } from '../../lib/contexts/FamilyHubContext';
import { ActionConfirmationCard } from '../widgets/ActionConfirmationCard';
// Mock imports if real widgets aren't ready to be properly styled for this context yet
// For now, we'll keep the placeholders but structured better.

export const FluidStage: React.FC = () => {
    const { context, isInteracting, conversationHistory, latestAgentResponse, addAgentResponse, setInteracting } = useFamilyHub();

    const handleConfirm = () => {
        addAgentResponse({
            type: 'chat',
            text: 'Action confirmed! (Mock)'
        });
        // In reality, this would trigger the actual agent action
    };

    const handleCancel = () => {
        addAgentResponse({
            type: 'chat',
            text: 'Action cancelled.'
        });
    };

    return (
        <main className="flex z-10 flex-col flex-1 justify-center items-center p-8 w-full max-w-5xl mx-auto overflow-hidden relative">
            {isInteracting ? (
                <div className="w-full max-w-2xl space-y-4 max-h-full overflow-y-auto pb-20 no-scrollbar">
                    {/* Conversation History */}
                    {conversationHistory.length === 0 && (
                        <div className="text-center opacity-50 py-10">Start typing to chat...</div>
                    )}

                    {conversationHistory.map((response, idx) => {
                        // Skip rendering the last one if it is an action request, because we render that permanently below?
                        // Actually, chat history should just be history.
                        // But pending action requests should be prominent.

                        // If it's a past action request, show it as processed.
                        if (response.type === 'action_request' && response !== latestAgentResponse) {
                            return (
                                <div key={idx} className="bg-stone-100 p-4 rounded-xl text-stone-500 text-sm italic ml-auto max-w-[80%]">
                                    Pending request from history: {response.text}
                                </div>
                            )
                        }

                        if (response.type === 'action_request' && response === latestAgentResponse) {
                            return (
                                <ActionConfirmationCard
                                    key={idx}
                                    text={response.text || 'Confirm action?'}
                                    onConfirm={handleConfirm}
                                    onCancel={handleCancel}
                                />
                            );
                        }

                        return (
                            <div key={idx} className={`
                                p-4 rounded-xl shadow-sm max-w-[80%] animate-slide-up
                                ${response.type === 'chat' /* We need to distinguish user vs agent. Right now we only have agent responses in history? */
                                    // The context 'addAgentResponse' seems to mock user input as agent response type 'chat' in inputDeck.
                                    // We should probably differentiate. But for now, let's assume all right-aligned are user?
                                    // Wait, InputDeck says "I heard: ..." as an agent response.
                                    // So everything is Left Aligned (Agent) currently.
                                    ? 'bg-white/80 mr-auto text-stone-800' : ''}
                            `}>
                                {response.text}
                            </div>
                        );
                    })}

                    {/* Spacer for bottom input */}
                    <div className="h-4"></div>
                </div>
            ) : (
                <DashboardView context={context} />
            )}
        </main>
    );
};

const DashboardView: React.FC<{ context: any }> = ({ context }) => {
    return (
        <div className="text-center space-y-8 animate-fade-in w-full max-w-4xl">
            <header className="space-y-2">
                <h1 className={`text-7xl ${context.uiMode === 'nerdy' ? 'font-mono' : 'font-serif tracking-tight'} opacity-90 text-stone-800`}>
                    {context.dayPhase === 'morning' ? 'Good Morning' :
                        context.dayPhase === 'evening' ? 'Good Evening' : 'Welcome Home'}
                </h1>
                <div className="text-2xl text-stone-500 font-light">
                    {context.regionalHoliday ? `Today is ${context.regionalHoliday}` : "It's a quiet day."}
                </div>
            </header>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <DashboardCard title="Up Next">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">📅</div>
                        <div className="text-left">
                            <div className="font-bold text-stone-700">Family Dinner</div>
                            <div className="text-sm text-stone-500">19:00 - Kitchen</div>
                        </div>
                    </div>
                </DashboardCard>

                <DashboardCard title="Reminders">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">📝</div>
                        <div className="text-left">
                            <div className="font-bold text-stone-700">Buy Milk</div>
                            <div className="text-sm text-stone-500">Supermarket</div>
                        </div>
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
};

const DashboardCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xs uppercase tracking-widest text-stone-400 mb-4 text-left">{title}</h3>
        {children}
    </div>
);
