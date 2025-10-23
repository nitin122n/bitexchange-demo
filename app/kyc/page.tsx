'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Card from '@/components/Card';

interface KYCStatus {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_STARTED';
  documents: {
    idProof: boolean;
    selfie: boolean;
    addressProof: boolean;
  };
  submittedAt?: string;
  reviewedAt?: string;
  reviewer?: string;
  notes?: string;
}

export default function KYCPage() {
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      // Mock KYC status
      const mockKYC: KYCStatus = {
        id: 'KYC-001',
        userId: '101',
        userName: 'John Smith',
        userEmail: 'john.smith@email.com',
        status: 'PENDING',
        documents: {
          idProof: true,
          selfie: true,
          addressProof: false
        },
        submittedAt: '2024-10-23T10:30:00Z',
        notes: 'Waiting for address proof document'
      };

      setKycStatus(mockKYC);
    } catch (error) {
      console.error('Failed to fetch KYC status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File, documentType: string) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
      // Update KYC status
      if (kycStatus) {
        setKycStatus({
          ...kycStatus,
          documents: {
            ...kycStatus.documents,
            [documentType]: true
          }
        });
      }
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      NOT_STARTED: 'bg-gray-100 text-gray-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getDocumentStatus = (isUploaded: boolean) => {
    return isUploaded ? (
      <span className="text-green-600 font-medium">✓ Uploaded</span>
    ) : (
      <span className="text-gray-500">Not uploaded</span>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-muted-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-muted-gray-900">KYC Verification</h1>
          </div>
          {kycStatus && (
            <div className="flex items-center space-x-4">
              {getStatusBadge(kycStatus.status)}
            </div>
          )}
        </div>

        {/* KYC Status Overview */}
        {kycStatus && (
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">User Information</div>
                  <div className="font-medium text-gray-900">{kycStatus.userName}</div>
                  <div className="text-sm text-gray-500">{kycStatus.userEmail}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <div className="font-medium text-gray-900">{getStatusBadge(kycStatus.status)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Submitted</div>
                  <div className="font-medium text-gray-900">
                    {kycStatus.submittedAt ? new Date(kycStatus.submittedAt).toLocaleDateString() : 'Not submitted'}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Verification Progress</span>
                <span className="text-sm text-gray-500">
                  {Object.values(kycStatus.documents).filter(Boolean).length}/3 documents
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-pale-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(Object.values(kycStatus.documents).filter(Boolean).length / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Notes */}
            {kycStatus.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Review Notes</h4>
                    <p className="text-sm text-yellow-700 mt-1">{kycStatus.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Document Upload Section */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Required Documents</h3>
          
          <div className="space-y-6">
            {/* ID Proof */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Government ID</h4>
                  <p className="text-sm text-gray-600">Upload a clear photo of your government-issued ID</p>
                </div>
                <div className="text-right">
                  {getDocumentStatus(kycStatus?.documents.idProof || false)}
                </div>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-600 mb-2">Drag and drop your ID photo here, or click to browse</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'idProof')}
                  className="hidden"
                  id="id-proof"
                />
                <label
                  htmlFor="id-proof"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  Choose File
                </label>
              </div>
              
              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Uploading...</span>
                    <span className="text-sm text-gray-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-pale-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Selfie */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Selfie Photo</h4>
                  <p className="text-sm text-gray-600">Take a clear selfie holding your ID next to your face</p>
                </div>
                <div className="text-right">
                  {getDocumentStatus(kycStatus?.documents.selfie || false)}
                </div>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-600 mb-2">Upload a selfie photo with your ID</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'selfie')}
                  className="hidden"
                  id="selfie"
                />
                <label
                  htmlFor="selfie"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            </div>

            {/* Address Proof */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Address Proof</h4>
                  <p className="text-sm text-gray-600">Upload a utility bill or bank statement (not older than 3 months)</p>
                </div>
                <div className="text-right">
                  {getDocumentStatus(kycStatus?.documents.addressProof || false)}
                </div>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-600 mb-2">Upload address proof document</p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'addressProof')}
                  className="hidden"
                  id="address-proof"
                />
                <label
                  htmlFor="address-proof"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              disabled={!kycStatus?.documents.idProof || !kycStatus?.documents.selfie || !kycStatus?.documents.addressProof}
              className="bg-pale-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-pale-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit for Verification
            </button>
          </div>
        </Card>

        {/* Guidelines */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Guidelines</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-green-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">Clear and Legible</h4>
                <p className="text-sm text-gray-600">Ensure all documents are clear, well-lit, and all text is readable</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-green-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">Valid Documents</h4>
                <p className="text-sm text-gray-600">Use government-issued IDs and recent utility bills (within 3 months)</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-green-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">Privacy & Security</h4>
                <p className="text-sm text-gray-600">Your documents are encrypted and stored securely. We never share your personal information</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
