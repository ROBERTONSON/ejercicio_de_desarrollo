export default function ForbiddenPage() {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in-up">
        <div className="text-red-500 mb-4 bg-red-500/10 p-4 rounded-full">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">403 Forbidden</h1>
        <p className="text-[#9898a8] max-w-md">Your current RBAC role does not have the required permissions to view this resource or perform this action.</p>
        <button onClick={() => window.history.back()} className="btn mt-6">Go Back</button>
      </div>
    );
  }
