function LoadingSpinner() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#6ADBAF]/30 border-t-[#6ADBAF]"></div>
        </div>
    );
}

export default LoadingSpinner;