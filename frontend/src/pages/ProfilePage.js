/**
 * Profile Page
 */
import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Alert } from '../components/common/Alert';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../hooks/useCustomHooks';
import { useForm } from '../hooks/useCustomHooks';

export const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const validateProfileForm = (values) => {
    const errors = {};
    if (!values.firstName) errors.firstName = 'First name is required';
    if (!values.lastName) errors.lastName = 'Last name is required';
    if (!values.email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Email is invalid';
    if (!values.phone) errors.phone = 'Phone is required';
    return errors;
  };

  const validatePasswordForm = (values) => {
    const errors = {};
    if (!values.oldPassword) errors.oldPassword = 'Old password is required';
    if (!values.newPassword) errors.newPassword = 'New password is required';
    else if (values.newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters';
    if (!values.confirmPassword) errors.confirmPassword = 'Please confirm password';
    else if (values.newPassword !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const profileForm = useForm(
    {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || ''
    },
    async (values) => {
      try {
        await updateProfile(values);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setSuccessMessage('Error updating profile: ' + err.message);
      }
    },
    validateProfileForm
  );

  const passwordForm = useForm(
    { oldPassword: '', newPassword: '', confirmPassword: '' },
    async (values) => {
      try {
        await changePassword(values.oldPassword, values.newPassword);
        setSuccessMessage('Password changed successfully!');
        passwordForm.resetForm();
        setShowPasswordModal(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setSuccessMessage('Error changing password: ' + err.message);
      }
    },
    validatePasswordForm
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

        {successMessage && (
          <Alert
            type={successMessage.includes('successfully') ? 'success' : 'error'}
            message={successMessage}
            dismissible
            onClose={() => setSuccessMessage('')}
            autoClose
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div>
            <Card>
              <CardBody className="text-center">
                <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-bold">
                  {user?.firstName?.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                <p className="text-gray-600 mt-1">{user?.email}</p>
                <div className="bg-blue-50 px-3 py-1 rounded-full inline-block mt-3 text-sm font-medium text-blue-700">
                  {user?.role === 'admin' ? 'Admin' : user?.role === 'therapist' ? 'Therapist' : user?.role === 'mentor' ? 'Mentor' : 'User'}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Edit Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
              </CardHeader>
              <CardBody>
                <form onSubmit={profileForm.handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={profileForm.values.firstName}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                      error={profileForm.touched.firstName ? profileForm.errors.firstName : ''}
                      required
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={profileForm.values.lastName}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                      error={profileForm.touched.lastName ? profileForm.errors.lastName : ''}
                      required
                    />
                  </div>

                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={profileForm.values.email}
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    error={profileForm.touched.email ? profileForm.errors.email : ''}
                    required
                  />

                  <Input
                    label="Phone"
                    name="phone"
                    value={profileForm.values.phone}
                    onChange={profileForm.handleChange}
                    onBlur={profileForm.handleBlur}
                    error={profileForm.touched.phone ? profileForm.errors.phone : ''}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profileForm.values.bio}
                      onChange={profileForm.handleChange}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={profileForm.isSubmitting}
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => profileForm.resetForm()}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>

            {/* Security Section */}
            <Card className="mt-8">
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900">Security</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-700 font-medium">Password</p>
                    <p className="text-gray-600 text-sm mt-1">Last changed 3 months ago</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowPasswordModal(true)}
                      className="mt-3"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Change Password Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Password"
          size="md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={passwordForm.handleSubmit}
                loading={passwordForm.isSubmitting}
              >
                Change Password
              </Button>
            </>
          }
        >
          <form className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              name="oldPassword"
              value={passwordForm.values.oldPassword}
              onChange={passwordForm.handleChange}
              onBlur={passwordForm.handleBlur}
              error={passwordForm.touched.oldPassword ? passwordForm.errors.oldPassword : ''}
              required
            />

            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordForm.values.newPassword}
              onChange={passwordForm.handleChange}
              onBlur={passwordForm.handleBlur}
              error={passwordForm.touched.newPassword ? passwordForm.errors.newPassword : ''}
              helperText="At least 8 characters"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordForm.values.confirmPassword}
              onChange={passwordForm.handleChange}
              onBlur={passwordForm.handleBlur}
              error={passwordForm.touched.confirmPassword ? passwordForm.errors.confirmPassword : ''}
              required
            />
          </form>
        </Modal>
      </div>
    </div>
  );
};
