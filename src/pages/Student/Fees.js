import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  Download, 
  AlertCircle,
  CheckCircle,
  Receipt,
  Clock,
  Eye
} from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const StudentFees = () => {
  const [selectedSemester, setSelectedSemester] = useState('Spring 2024');
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const handlePayment = (feeId) => {
    setIsLoading(true);
    showNotification(`Processing payment for fee ${feeId}...`, 'info');
    setTimeout(() => {
      showNotification('Payment processed successfully', 'success');
      setIsLoading(false);
    }, 2000);
  };

  const handleDownloadReceipt = (paymentId) => {
    setIsLoading(true);
    showNotification(`Downloading receipt for payment ${paymentId}...`, 'info');
    setTimeout(() => {
      showNotification('Receipt downloaded successfully', 'success');
      setIsLoading(false);
    }, 1500);
  };

  const handleExportFees = () => {
    setIsLoading(true);
    showNotification('Exporting fee data...', 'info');
    setTimeout(() => {
      showNotification('Fee data exported successfully', 'success');
      setIsLoading(false);
    }, 1500);
  };

  const feeStructure = [
    {
      item: 'Tuition Fee',
      amount: 5000,
      dueDate: '2024-01-15',
      status: 'paid',
      paidDate: '2024-01-10',
      method: 'Credit Card'
    },
    {
      item: 'Registration Fee',
      amount: 200,
      dueDate: '2024-01-15',
      status: 'paid',
      paidDate: '2024-01-08',
      method: 'Bank Transfer'
    },
    {
      item: 'Library Fee',
      amount: 150,
      dueDate: '2024-01-15',
      status: 'paid',
      paidDate: '2024-01-12',
      method: 'Credit Card'
    },
    {
      item: 'Lab Fee',
      amount: 300,
      dueDate: '2024-02-15',
      status: 'pending',
      method: null
    },
    {
      item: 'Exam Fee',
      amount: 100,
      dueDate: '2024-03-01',
      status: 'pending',
      method: null
    }
  ];

  const paymentHistory = [
    {
      id: 'PAY-001',
      amount: 5000,
      date: '2024-01-10',
      method: 'Credit Card',
      status: 'completed',
      description: 'Tuition Fee - Spring 2024'
    },
    {
      id: 'PAY-002',
      amount: 200,
      date: '2024-01-08',
      method: 'Bank Transfer',
      status: 'completed',
      description: 'Registration Fee - Spring 2024'
    },
    {
      id: 'PAY-003',
      amount: 150,
      date: '2024-01-12',
      method: 'Credit Card',
      status: 'completed',
      description: 'Library Fee - Spring 2024'
    }
  ];

  const totalPaid = feeStructure
    .filter(fee => fee.status === 'paid')
    .reduce((sum, fee) => sum + fee.amount, 0);

  const totalPending = feeStructure
    .filter(fee => fee.status === 'pending')
    .reduce((sum, fee) => sum + fee.amount, 0);

  const totalAmount = feeStructure.reduce((sum, fee) => sum + fee.amount, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-600 mt-2">Manage your tuition and other fees</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          <button 
            onClick={handleExportFees}
            disabled={isLoading}
            className="btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
          <button 
            onClick={() => handlePayment('all')}
            disabled={isLoading}
            className="btn-primary"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Make Payment
          </button>
        </div>
      </div>

      {/* Fee Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">${totalAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Fees</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">${totalPaid.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Paid</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">${totalPending.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {Math.round((totalPaid / totalAmount) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Payment Progress</div>
        </div>
      </div>

      {/* Payment Progress */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-primary-600 h-3 rounded-full transition-all duration-300" 
            style={{ width: `${(totalPaid / totalAmount) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Paid: ${totalPaid.toLocaleString()}</span>
          <span>Remaining: ${totalPending.toLocaleString()}</span>
        </div>
      </div>

      {/* Fee Structure */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Fee Structure - {selectedSemester}</h3>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="input-field"
            >
              <option value="Spring 2024">Spring 2024</option>
              <option value="Fall 2023">Fall 2023</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feeStructure.map((fee, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{fee.item}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${fee.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{fee.dueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fee.status)}`}>
                      {getStatusIcon(fee.status)}
                      <span className="ml-1">{fee.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{fee.method || 'Not paid'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {fee.status === 'pending' ? (
                        <button 
                          onClick={() => handlePayment(fee.item)}
                          disabled={isLoading}
                          className="text-primary-600 hover:text-primary-900 font-medium"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleDownloadReceipt(fee.item)}
                          disabled={isLoading}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => showNotification(`Viewing details for ${fee.item}`, 'info')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${payment.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.method}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 flex items-center">
                      <Receipt className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-primary-300 transition-colors cursor-pointer">
            <CreditCard className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Credit/Debit Card</h4>
            <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-primary-300 transition-colors cursor-pointer">
            <DollarSign className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Bank Transfer</h4>
            <p className="text-sm text-gray-600">Direct bank transfer</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-primary-300 transition-colors cursor-pointer">
            <Receipt className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Cash Payment</h4>
            <p className="text-sm text-gray-600">Pay at the finance office</p>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="card p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">Important Payment Information</h3>
            <ul className="text-yellow-700 text-sm mt-2 space-y-1">
              <li>• Late payment fees of $50 will be applied after the due date</li>
              <li>• Payment receipts will be available for download after successful payment</li>
              <li>• For payment issues, contact the finance office at finance@unityuniversity.edu</li>
              <li>• Refunds are processed within 5-7 business days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFees;
