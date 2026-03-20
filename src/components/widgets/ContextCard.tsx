import { ContextCardItem } from "@/lib/data/mockContext";

export default function ContextCard({
    item,
    onPromptClick
}: {
    item: ContextCardItem;
    onPromptClick?: (question: string) => void;
}) {
    // Visual treatments per type
    const isPattern = item.type === 'pattern';

    return (
        <div className={`
            group flex flex-row items-start gap-3
            p-3 rounded-xl border border-transparent
            hover:bg-[var(--surface-highlight)] 
            transition-colors duration-500
            animate-in fade-in slide-in-from-bottom-2
            cursor-default
        `}>
            {/* Minimal Icon/Indicator */}
            <div className={`
                w-1 h-8 rounded-full opacity-60 mt-1
                ${isPattern ? 'bg-indigo-400' : 'bg-emerald-400'}
            `} />

            {/* Content */}
            <div className="flex-1 flex flex-col gap-1.5">
                <p className="text-sm text-slate-300 font-medium opacity-90 leading-snug">
                    {item.text}
                </p>

                {/* Gentle Prompt (Iter 3) */}
                {item.prompt && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPromptClick?.(item.prompt!.question);
                        }}
                        className="
                            text-xs text-indigo-300/80 hover:text-indigo-300
                            text-left w-fit transition-colors duration-300
                            hover:underline decoration-indigo-300/30 underline-offset-4
                        "
                    >
                        {item.prompt.text}
                    </button>
                )}
            </div>
        </div>
    );
}
