import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader, 
  Cloud, 
  Key, 
  Info,
  X,
  ArrowLeft
} from 'lucide-react';

const GCPConnectForm: React.FC = () => {
  const [formData, setFormData] = useState({
    projectId: '',
    serviceAccountKey: null as File | null,
    architecture: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateProjectId = (projectId: string): boolean => {
    // GCP project IDs must be 6-30 characters, lowercase letters, digits, and hyphens
    const regex = /^[a-z0-9-]{6,30}$/;
    return regex.test(projectId);
  };

  const validateServiceAccountKey = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!file) {
        resolve(false);
        return;
      }

      if (file.type !== 'application/json') {
        resolve(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          // Check for required fields in service account key
          const requiredFields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email'];
          const hasRequiredFields = requiredFields.every(field => field in json);
          const isServiceAccount = json.type === 'service_account';
          resolve(hasRequiredFields && isServiceAccount);
        } catch {
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileUpload = (file: File) => {
    setFormData(prev => ({
      ...prev,
      serviceAccountKey: file
    }));
    
    if (errors.serviceAccountKey) {
      setErrors(prev => ({
        ...prev,
        serviceAccountKey: ''
      }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    // Validate Project ID
    if (!formData.projectId.trim()) {
      newErrors.projectId = 'Project ID is required';
    } else if (!validateProjectId(formData.projectId)) {
      newErrors.projectId = 'Invalid Project ID format. Must be 6-30 characters, lowercase letters, digits, and hyphens only.';
    }

    // Validate Service Account Key
    if (!formData.serviceAccountKey) {
      newErrors.serviceAccountKey = 'Service account key file is required';
    } else {
      const isValidKey = await validateServiceAccountKey(formData.serviceAccountKey);
      if (!isValidKey) {
        newErrors.serviceAccountKey = 'Invalid service account key file. Please upload a valid JSON key file.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const success = Math.random() > 0.3;
      
      if (success) {
        setIsSuccess(true);
      } else {
        setErrors({
          submit: 'Failed to connect to GCP project. Please check your credentials and try again.'
        });
      }
    } catch (error) {
      setErrors({
        submit: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      projectId: '',
      serviceAccountKey: null,
      architecture: ''
    });
    setErrors({});
    setIsSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Successfully Connected!</h2>
            <p className="text-slate-600 mb-6">
              Your GCP project <span className="font-mono font-medium">{formData.projectId}</span> has been connected to Logwise.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={resetForm}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Connect Another Project
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Connect GCP Project</h1>
              <p className="text-slate-600 mt-1">Add your Google Cloud Platform project to start analyzing logs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            {/* Project ID */}
            <div className="space-y-6">
              <div>
                <label htmlFor="projectId" className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Cloud className="w-4 h-4" />
                    <span>GCP Project ID</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="projectId"
                  value={formData.projectId}
                  onChange={(e) => handleInputChange('projectId', e.target.value)}
                  placeholder="my-project-123456"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
                    errors.projectId 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-slate-300'
                  }`}
                />
                {errors.projectId && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.projectId}</span>
                  </p>
                )}
                <p className="mt-2 text-sm text-slate-500">
                  Find your Project ID in the Google Cloud Console dashboard
                </p>
              </div>

              {/* Service Account Key Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4" />
                    <span>Service Account Key</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-50' 
                      : errors.serviceAccountKey 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-slate-300 hover:border-slate-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {formData.serviceAccountKey ? (
                    <div className="space-y-2">
                      <FileText className="w-8 h-8 text-green-600 mx-auto" />
                      <p className="text-sm font-medium text-slate-700">
                        {formData.serviceAccountKey.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(formData.serviceAccountKey.size / 1024).toFixed(1)} KB
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, serviceAccountKey: null }));
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-sm font-medium text-slate-700">
                        Drop your service account key here, or click to browse
                      </p>
                      <p className="text-xs text-slate-500">
                        JSON files only. Max 10MB.
                      </p>
                    </div>
                  )}
                </div>
                
                {errors.serviceAccountKey && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.serviceAccountKey}</span>
                  </p>
                )}
                
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">How to create a service account key:</p>
                      <ol className="list-decimal list-inside space-y-1 text-xs">
                        <li>Go to Google Cloud Console → IAM & Admin → Service Accounts</li>
                        <li>Create a new service account or select existing one</li>
                        <li>Add roles: Logging Admin, Monitoring Viewer</li>
                        <li>Create and download JSON key file</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {/* Architecture Description */}
              <div>
                <label htmlFor="architecture" className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Application Architecture</span>
                    <span className="text-slate-400 text-xs">(Optional)</span>
                  </div>
                </label>
                <textarea
                  id="architecture"
                  value={formData.architecture}
                  onChange={(e) => handleInputChange('architecture', e.target.value)}
                  placeholder="Describe your application's architecture, services, and components. This helps our AI provide more accurate log analysis and recommendations.

Example: 
- Frontend: React app deployed on Cloud Run
- Backend: Node.js API with Express
- Database: Cloud SQL (PostgreSQL)
- Message Queue: Pub/Sub for async processing
- Authentication: Firebase Auth"
                  rows={8}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
                <p className="mt-2 text-sm text-slate-500">
                  This information helps our AI provide more contextual log analysis and debugging suggestions.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-4">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-800">{errors.submit}</span>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Cloud className="w-5 h-5" />
                  <span>Connect Project</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GCPConnectForm;