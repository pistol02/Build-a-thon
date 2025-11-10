'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Calendar, Home, MessageSquare, FileText, User, ChevronRight, Mic, Upload, Diamond, X, Video } from 'lucide-react';
import { FaCamera } from 'react-icons/fa6';

// Define VideoIcon component since it's used but not imported
const VideoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

// Define types for our data
type QueryType = {
  id: string;
  type: 'video' | 'audio' | 'text';
  priority: boolean;
  status: 'pending' | 'resolved' | 'in-progress';
  customerDetails: {
    name: string;
    accountId: string;
    email?: string;
    phone?: string;
  };
  timestamp: Date;
  description?: string;
};

const AdminQueriesPage = () => {
  // State management
  const [queries, setQueries] = useState<QueryType[]>([]);
  const [activeTab, setActiveTab] = useState<'loan' | 'kyc' | 'account' | 'investment'>('loan');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState<QueryType | null>(null);
  const [videoStreamActive, setVideoStreamActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch queries data (simulated)
  useEffect(() => {
    const fetchQueries = async () => {
      // In a real application, this would be an API call
      setTimeout(() => {
        const mockData: QueryType[] = [
          {
            id: 'Q10023',
            type: 'video',
            priority: true,
            status: 'pending',
            customerDetails: {
              name: 'Robert Taylor',
              accountId: 'ACC12345',
              email: 'robert.taylor@example.com',
              phone: '+1 (555) 123-4567',
            },
            description: 'Loan application status inquiry and documentation requirements',
            timestamp: new Date('2025-03-14T09:15:00'),
          },
          {
            id: 'Q10024',
            type: 'audio',
            priority: false,
            status: 'in-progress',
            customerDetails: {
              name: 'Sarah Johnson',
              accountId: 'ACC67890',
              email: 'sarah.j@example.com',
              phone: '+1 (555) 987-6543',
            },
            description: 'KYC verification follow-up questions',
            timestamp: new Date('2025-03-14T10:30:00'),
          },
          {
            id: 'Q10025',
            type: 'text',
            priority: true,
            status: 'resolved',
            customerDetails: {
              name: 'Michael Brown',
              accountId: 'ACC54321',
              email: 'mbrown@example.com',
              phone: '+1 (555) 456-7890',
            },
            description: 'Account access issue after password reset',
            timestamp: new Date('2025-03-14T08:45:00'),
          },
        ];
        setQueries(mockData);
        setLoading(false);
      }, 800);
    };

    fetchQueries();
  }, [activeTab]);

  // Filter queries based on search input
  const filteredQueries = queries.filter(query => 
    query.customerDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    query.customerDetails.accountId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    query.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle starting video stream
  const startVideoStream = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current.srcObject = stream;
        setVideoStreamActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  // Function to stop video stream
  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setVideoStreamActive(false);
    }
  };

  // Function to handle creating a new service ticket
  const handleCreateServiceTicket = () => {
    console.log('Creating new service ticket');
    // Implement your logic here
  };

  // Function to handle selecting a query
  const handleSelectQuery = (query: QueryType) => {
    setSelectedQuery(query);
    if (query.type === 'video') {
      startVideoStream();
    }
  };

  // Function to format date
  const formatDate = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-6 border-b flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Queries</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <User size={20} />
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto bg-white rounded-lg mb-8 shadow">
          <button
            className={`flex-1 py-4 px-6 text-center ${activeTab === 'loan' ? 'border-b-2 border-pink-500 text-pink-500 font-medium' : 'text-gray-600'}`}
            onClick={() => setActiveTab('loan')}
          >
            Loan
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${activeTab === 'kyc' ? 'border-b-2 border-pink-500 text-pink-500 font-medium' : 'text-gray-600'}`}
            onClick={() => setActiveTab('kyc')}
          >
            KYC
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${activeTab === 'account' ? 'border-b-2 border-pink-500 text-pink-500 font-medium' : 'text-gray-600'}`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center ${activeTab === 'investment' ? 'border-b-2 border-pink-500 text-pink-500 font-medium' : 'text-gray-600'}`}
            onClick={() => setActiveTab('investment')}
          >
            Investment
          </button>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Query List */}
          <div className="lg:col-span-1">
            {/* Date Info */}
            <div className="mb-6">
              <p className="text-lg font-medium">Today: March {new Date().getDate()}</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search queries..."
                className="w-full py-3 px-4 pl-10 bg-white rounded-lg border shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-4 mb-6">
              <button 
                className="flex items-center justify-center bg-pink-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-pink-600 transition duration-150"
                onClick={handleCreateServiceTicket}
              >
                <MessageSquare size={16} className="mr-2" />
                Service Ticket
              </button>
              <button 
                className="flex items-center justify-center bg-white border border-pink-500 text-pink-500 px-4 py-2 rounded-md shadow-sm hover:bg-pink-50 transition duration-150"
                onClick={startVideoStream}
              >
                <FaCamera size={16} className="mr-2" />
                Video Query
              </button>
            </div>

            {/* Queries List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b p-4 bg-gray-50 font-medium text-sm text-gray-600 flex justify-between">
                <span>QUERY ID</span>
                <span>PRIORITY</span>
                <span>CUSTOMER</span>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Loading queries...</p>
                </div>
              ) : filteredQueries.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No queries found. Try adjusting your search criteria.
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {filteredQueries.map((query) => (
                    <button
                      key={query.id}
                      className={`w-full text-left border-b last:border-0 p-4 hover:bg-gray-50 transition duration-150 ${
                        selectedQuery?.id === query.id ? 'bg-pink-50' : ''
                      }`}
                      onClick={() => handleSelectQuery(query)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {query.type === 'video' && <Video className="text-pink-500 mr-2" size={18} />}
                          {query.type === 'audio' && <Mic className="text-pink-500 mr-2" size={18} />}
                          {query.type === 'text' && <MessageSquare className="text-pink-500 mr-2" size={18} />}
                          <span className="font-medium">{query.id}</span>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            query.priority ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {query.priority ? 'High' : 'Normal'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right">
                            <p className="font-medium text-sm">{query.customerDetails.name}</p>
                            <p className="text-xs text-gray-500">{query.customerDetails.accountId}</p>
                          </div>
                          <ChevronRight size={16} className="text-gray-400 ml-2" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Video Stream / Selected Query */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full min-h-[500px]">
              {videoStreamActive ? (
                <div className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg">Video Stream</h2>
                    <button 
                      className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                      onClick={stopVideoStream}
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex-1 bg-black rounded-lg overflow-hidden relative">
                    <video 
                      ref={videoRef} 
                      className="w-full h-full object-cover"
                      autoPlay 
                      playsInline
                    />
                    <div className="absolute bottom-4 right-4 flex space-x-2">
                      <button className="bg-red-500 p-2 rounded-full text-white shadow-md hover:bg-red-600">
                        <VideoIcon size={20} />
                      </button>
                      <button className="bg-gray-700 p-2 rounded-full text-white shadow-md hover:bg-gray-800">
                        <Mic size={20} />
                      </button>
                    </div>
                  </div>
                  {selectedQuery && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{selectedQuery.customerDetails.name}</p>
                          <p className="text-sm text-gray-500">{selectedQuery.customerDetails.accountId}</p>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedQuery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            selectedQuery.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {selectedQuery.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : selectedQuery ? (
                <div className="p-6 h-full">
                  <div className="bg-gray-50 p-6 rounded-lg border mb-6">
                    <div className="flex justify-between mb-6">
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedQuery.type === 'video' ? 'bg-blue-100 text-blue-800' :
                          selectedQuery.type === 'audio' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {selectedQuery.type} Query
                        </span>
                        <h2 className="font-bold text-lg mt-2">{selectedQuery.id}</h2>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedQuery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          selectedQuery.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {selectedQuery.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Customer Details</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{selectedQuery.customerDetails.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Account ID</p>
                          <p className="font-medium">{selectedQuery.customerDetails.accountId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedQuery.customerDetails.email || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{selectedQuery.customerDetails.phone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Query Details</label>
                      <div className="p-4 bg-white border rounded-lg">
                        <p className="text-gray-700">{selectedQuery.description || 'No description provided.'}</p>
                        <p className="text-sm text-gray-500 mt-2">Submitted on: {selectedQuery.timestamp.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Response</label>
                      <textarea 
                        rows={4} 
                        className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Enter your response here..."
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center justify-center border border-gray-300 rounded-lg p-2 hover:bg-gray-50">
                          <Upload size={16} className="text-gray-500" />
                        </button>
                        <button className="flex items-center justify-center border border-gray-300 rounded-lg p-2 hover:bg-gray-50">
                          <FileText size={16} className="text-gray-500" />
                        </button>
                        <button className="flex items-center justify-center border border-gray-300 rounded-lg p-2 hover:bg-gray-50">
                          <Calendar size={16} className="text-gray-500" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="px-4 py-2 bg-white border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50">
                          Save Draft
                        </button>
                        <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
                          Send Response
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Activity Log */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-medium text-lg mb-4">Activity Log</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="text-sm"><span className="font-medium">System</span> created this query</p>
                          <p className="text-xs text-gray-500">{selectedQuery.timestamp.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</p>
                        </div>
                      </div>
                      
                      {selectedQuery.status === 'in-progress' && (
                        <div className="flex items-start space-x-3">
                          <div className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="text-sm"><span className="font-medium">Admin</span> changed status to In Progress</p>
                            <p className="text-xs text-gray-500">{new Date(selectedQuery.timestamp.getTime() + 3600000).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedQuery.status === 'resolved' && (
                        <div className="flex items-start space-x-3">
                          <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="text-sm"><span className="font-medium">Admin</span> resolved this query</p>
                            <p className="text-xs text-gray-500">{new Date(selectedQuery.timestamp.getTime() + 7200000).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <div className="bg-gray-100 p-6 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                      <MessageSquare size={24} className="text-gray-400" />
                    </div>
                    <h3 className="font-medium text-lg mb-2">No Query Selected</h3>
                    <p className="text-gray-500 max-w-md">Select a query from the list on the left to view its details, or start a new video query.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQueriesPage;