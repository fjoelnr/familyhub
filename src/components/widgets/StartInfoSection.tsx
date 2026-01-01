export default function StartInfoSection() {
    return (
        <div className="w-full max-w-4xl mx-auto mt-12 p-8 text-slate-400 opacity-80 transition-opacity hover:opacity-100">
            <h2 className="text-xl font-light text-slate-300 text-center mb-8 tracking-wide">
                Wofür dieser Ort da ist
            </h2>

            <div className="flex justify-center">
                <ul className="space-y-4 text-lg font-light leading-relaxed text-center">
                    <li>nachschauen, was heute ansteht</li>
                    <li>Absprachen und wichtige Infos finden</li>
                    <li>eigene Hinweise für die Familie festhalten</li>
                    <li>den täglichen Überblick behalten</li>
                </ul>
            </div>
        </div>
    );
}
