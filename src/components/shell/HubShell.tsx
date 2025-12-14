export default function HubShell({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen bg-gray-900 text-gray-100 p-8 space-y-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {children}
            </div>
        </main>
    );
}

