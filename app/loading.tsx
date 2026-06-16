export default function Loading() {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-6">
                {/* Logo Animation */}
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 bg-accent rounded-2xl animate-pulse flex items-center justify-center font-display font-black text-3xl text-black italic">
                        E
                    </div>
                    <div className="absolute inset-0 border-4 border-accent rounded-2xl animate-ping opacity-20"></div>
                </div>
                
                {/* Text Animation */}
                <div className="flex flex-col items-center">
                    <span className="font-display text-xl font-black text-white uppercase tracking-tighter italic">
                        Evolution <span className="text-accent">Ajans</span>
                    </span>
                    <div className="flex gap-1 mt-2">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
            
            {/* Background Blur Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 blur-[120px] animate-pulse [animation-delay:1s]"></div>
        </div>
    );
}
