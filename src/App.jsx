import React, { useState } from "react";
import FeedbackForm from "./components/feedback";
import CriteriaForm from "./components/CriteriaForm";

const App = () => {
  const [showCriteria, setShowCriteria] = useState(true);

  return (
    <div className="min-h-screen w-full bg-gray-900">
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-700 flex items-center gap-3">
          <button
            onClick={() => setShowCriteria(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showCriteria
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            Critérios
          </button>
          <button
            onClick={() => setShowCriteria(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !showCriteria
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            Feedback
          </button>
        </div>
      </div>
      
      {showCriteria ? <CriteriaForm /> : <FeedbackForm />}
    </div>
  );
};

export default App;
