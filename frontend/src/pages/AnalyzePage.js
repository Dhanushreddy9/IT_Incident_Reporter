import React, { useState } from 'react';
import { Plus, Upload, FileText } from 'lucide-react';

const AnalyzePage = () => {
  const [newTicketText, setNewTicketText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [ticketTitle, setTicketTitle] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);
  const [trueLabel, setTrueLabel] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      if (!ticketTitle) {
        setTicketTitle(`File Upload: ${file.name}`);
      }
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (ticketTitle.startsWith('File Upload:')) {
      setTicketTitle('');
    }
  };

  const handleSubmitTicket = async () => {
    try {
      let description = newTicketText;

      // If no manual description, try reading from uploaded file
      if (!description && uploadedFile) {
        const fileText = await uploadedFile.text();
        const response = await fetch('http://localhost:5001/preprocess_logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logs: fileText })
        });

        const result = await response.json();
        description = result.processed_logs;
      }

      const predictResponse = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });

      const predictResult = await predictResponse.json();

      console.log("Prediction Result:", predictResult);
      setPredictionResult(predictResult);

    } catch (error) {
      console.error("Error submitting ticket:", error);
      alert("Failed to analyze the ticket. Please try again.");
    }

    // Reset form
    setNewTicketText('');
    setUploadedFile(null);
    setTicketTitle('');
  };
  const handleFeedbackSubmit = async () => {
    if (!predictionResult || !trueLabel.trim()) return;
  
    const feedbackData = {
      description: newTicketText || (await uploadedFile?.text()), // fallback to file
      predicted: predictionResult.root_cause,
      true_label: trueLabel
    };
  
    try {
      const response = await fetch('http://localhost:5001/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Thank you! Your feedback has been submitted.");
        setFeedbackSubmitted(true);
      } else {
        alert(result.error || "Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Feedback error:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Create New Ticket for Analysis
          </h2>
          <p className="text-gray-600 mt-2">
            Enter ticket details manually or upload a file for analysis
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Title Input */}
          <input
            type="text"
            value={ticketTitle}
            onChange={(e) => setTicketTitle(e.target.value)}
            placeholder="Brief title describing the issue..."
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          {/* Description Textarea */}
          <textarea
            value={newTicketText}
            onChange={(e) => setNewTicketText(e.target.value)}
            placeholder="Describe the issue in detail..."
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          {/* OR Divider */}
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 bg-white">OR ATTACH FILE</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed p-6 text-center">
            <Upload className="mx-auto text-gray-400 mb-2" />
            <label className="cursor-pointer text-blue-600 font-medium">
              Click to upload
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
            {uploadedFile && (
              <div className="mt-4 flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="text-blue-500" />
                  <span>{uploadedFile.name}</span>
                </div>
                <button onClick={removeFile} className="text-red-600 text-lg font-bold">×</button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitTicket}
            disabled={(!newTicketText && !uploadedFile) || !ticketTitle}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-lg hover:opacity-90"
          >
            Submit Ticket for Analysis
          </button>
          {predictionResult && (
  <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Analysis Result</h3>
    <p><strong>Root Cause:</strong> {predictionResult.root_cause}</p>
    <div className="mt-2">
      <strong>Summary:</strong>
      <pre className="whitespace-pre-wrap mt-1 p-3 bg-white border border-gray-300 rounded-md text-gray-700">
        {predictionResult.summary}
      </pre>
    </div>

    {!feedbackSubmitted && (
      <div className="mt-6">
        <h4 className="text-lg font-medium text-gray-700 mb-2">Was the root cause incorrect? Provide the correct one:</h4>
        <input
          type="text"
          value={trueLabel}
          onChange={(e) => setTrueLabel(e.target.value)}
          placeholder="Enter correct root cause..."
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleFeedbackSubmit}
          className="mt-3 bg-green-600 text-white py-2 px-6 rounded-lg hover:opacity-90"
        >
          Save Feedback
        </button>
      </div>
    )}

    {feedbackSubmitted && (
      <p className="mt-4 text-green-700 font-medium">
        ✅ Feedback received. Thank you for improving the model!
      </p>
    )}
  </div>
)}


        </div>
      </div>
    </div>
  );
};

export default AnalyzePage;
