import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Database, 
  Bell, 
  Mail, 
  Lock,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Globe,
  Server
} from 'lucide-react';
import BackButton from '../../components/BackButton.jsx';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Unity University Portal',
      siteDescription: 'Comprehensive Student Management System',
      timezone: 'UTC-5',
      language: 'English',
      maintenanceMode: false
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      sessionTimeout: 30,
      twoFactorAuth: true,
      loginAttempts: 5
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      announcementEmails: true,
      gradeEmails: true
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      cloudBackup: true,
      lastBackup: '2024-03-10 02:00:00'
    }
  });

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Simulate API call
    console.log('Settings saved:', settings);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <input
              type="text"
              value={settings.general.siteName}
              onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              value={settings.general.timezone}
              onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
              className="input-field"
            >
              <option value="UTC-5">UTC-5 (EST)</option>
              <option value="UTC-6">UTC-6 (CST)</option>
              <option value="UTC-7">UTC-7 (MST)</option>
              <option value="UTC-8">UTC-8 (PST)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={settings.general.language}
              onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
              className="input-field"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.general.maintenanceMode}
              onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Maintenance Mode</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Minimum Length</label>
            <input
              type="number"
              value={settings.security.passwordMinLength}
              onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
            <input
              type="number"
              value={settings.security.loginAttempts}
              onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
              className="input-field"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.security.requireSpecialChars}
              onChange={(e) => handleSettingChange('security', 'requireSpecialChars', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Require Special Characters</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Two-Factor Authentication</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Send notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">SMS Notifications</h4>
              <p className="text-sm text-gray-600">Send notifications via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.smsNotifications}
              onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-600">Send push notifications to mobile devices</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.pushNotifications}
              onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Announcement Emails</h4>
              <p className="text-sm text-gray-600">Send announcement emails to users</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.announcementEmails}
              onChange={(e) => handleSettingChange('notifications', 'announcementEmails', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Grade Emails</h4>
              <p className="text-sm text-gray-600">Send grade notification emails</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.gradeEmails}
              onChange={(e) => handleSettingChange('notifications', 'gradeEmails', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
            <select
              value={settings.backup.backupFrequency}
              onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
              className="input-field"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Retention Days</label>
            <input
              type="number"
              value={settings.backup.retentionDays}
              onChange={(e) => handleSettingChange('backup', 'retentionDays', parseInt(e.target.value))}
              className="input-field"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.backup.autoBackup}
              onChange={(e) => handleSettingChange('backup', 'autoBackup', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Automatic Backup</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.backup.cloudBackup}
              onChange={(e) => handleSettingChange('backup', 'cloudBackup', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Cloud Backup</label>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Last Backup:</strong> {settings.backup.lastBackup}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton to="/admin/dashboard" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">System Settings</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Configure system preferences and settings</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </button>
          <button onClick={handleSave} className="btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'general', name: 'General', icon: Settings },
              { id: 'security', name: 'Security', icon: Shield },
              { id: 'notifications', name: 'Notifications', icon: Bell },
              { id: 'backup', name: 'Backup', icon: Database }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'general' && renderGeneralSettings()}
      {activeTab === 'security' && renderSecuritySettings()}
      {activeTab === 'notifications' && renderNotificationSettings()}
      {activeTab === 'backup' && renderBackupSettings()}

      {/* System Status */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Server Status</h4>
              <p className="text-sm text-gray-600">Online</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <Database className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Database</h4>
              <p className="text-sm text-gray-600">Connected</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <Mail className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Email Service</h4>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left">
            <Download className="h-6 w-6 text-primary-600 mb-2" />
            <h4 className="font-medium text-gray-900">Export Settings</h4>
            <p className="text-sm text-gray-600">Download configuration</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
            <Upload className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Import Settings</h4>
            <p className="text-sm text-gray-600">Upload configuration</p>
          </button>
          <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left">
            <RefreshCw className="h-6 w-6 text-yellow-600 mb-2" />
            <h4 className="font-medium text-gray-900">Clear Cache</h4>
            <p className="text-sm text-gray-600">Refresh system cache</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <Server className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">System Logs</h4>
            <p className="text-sm text-gray-600">View system logs</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
