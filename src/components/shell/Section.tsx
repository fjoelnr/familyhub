export default function Section({
    title,
    children,
}: {
    title?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            {title && <h2 className="text-2xl font-bold mb-3">{title}</h2>}
            {children}
        </section>
    );
}
