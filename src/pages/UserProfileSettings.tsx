import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/layout/AuthLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/ui/UserAvatar';
import { Loader2, Lock, CheckCircle, AlertCircle, Edit, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User as AppUser } from '@/types'; // Rename imported User to avoid conflict
import { updateUser } from '@/services/userService'; // Import the updateUser service

// Define a simple type for the necessary profile fields used in this component
interface ProfileData {
    id: string;
    email: string;
    first_name?: string | null;
    last_name?: string | null;
    phone?: string | null; // Keep phone here, but might be null if not directly available
    role: 'admin' | 'builder' | 'homeowner';
    created_at?: string | null; // Match AuthContext property
}

const UserProfileSettings: React.FC = () => {
  const { user: authUser, loading: authLoading, logout, refreshAuthUser } = useAuth(); // Destructure refreshAuthUser
  const [userData, setUserData] = useState<ProfileData | null>(null);
  // State for editing profile
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState<Partial<ProfileData>>({}); 
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    if (authUser) {
      const mappedData = {
        id: authUser.id,
        email: authUser.email,
        first_name: authUser.first_name || null, 
        last_name: authUser.last_name || null, 
        phone: null, // Assume phone isn't directly on authUser, fetch/update via userService
        role: authUser.role,
        created_at: authUser.created_at || null,
      };
      setUserData(mappedData);
      // Initialize editData with potentially missing phone
      setEditData({
        first_name: mappedData.first_name,
        last_name: mappedData.last_name,
        phone: mappedData.phone, // Will be null initially
      });
      // TODO: Fetch full profile including phone from userService if needed on load
    }
  }, [authUser]);

  // --- Profile Edit Handlers --- 
  const handleEditToggle = () => {
    if (!isEditingProfile && userData) {
      // Entering edit mode, copy current data to edit state
      setEditData({
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
      });
      setProfileStatus('idle'); // Reset status messages
      setProfileMessage('');
    }
    setIsEditingProfile(!isEditingProfile);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userData) return;

    setIsSubmittingProfile(true);
    setProfileStatus('idle');
    setProfileMessage('');

    try {
      const updates: Partial<AppUser> = {
        first_name: editData.first_name || '', 
        last_name: editData.last_name || '',
        phone: editData.phone || '', 
      };

      const updatedUser = await updateUser(userData.id, updates);

      if (updatedUser) {
        // Update local userData state first for immediate UI feedback
        setUserData(prev => prev ? { 
          ...prev, 
          first_name: updatedUser.first_name || null,
          last_name: updatedUser.last_name || null,
          phone: updatedUser.phone || null 
        } : null);
        setProfileStatus('success');
        setProfileMessage('Profile updated successfully!');
        setIsEditingProfile(false);
        
        // Call refreshAuthUser to update context and Header
        await refreshAuthUser(); 

      } else {
        throw new Error('Failed to update profile.');
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setProfileStatus('error');
      setProfileMessage(error.message || 'Failed to update profile.');
    } finally {
      setIsSubmittingProfile(false);
    }
  };
  // --- End Profile Edit Handlers ---

  // --- Password Change Handlers --- (Keep existing logic)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingPassword(true);
    setPasswordStatus('idle');
    setPasswordMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus('error');
      setPasswordMessage('New passwords do not match.');
      setIsSubmittingPassword(false);
      return;
    }

    if (!passwordData.newPassword) {
       setPasswordStatus('error');
       setPasswordMessage('New password cannot be empty.');
       setIsSubmittingPassword(false);
       return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) {
        throw error;
      }

      setPasswordStatus('success');
      setPasswordMessage('Password updated successfully! You might need to log in again elsewhere.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });

    } catch (error: any) {
      console.error("Error updating password:", error);
      setPasswordStatus('error');
      setPasswordMessage(error.message || 'Failed to update password.');
    } finally {
      setIsSubmittingPassword(false);
    }
  };
  // --- End Password Change Handlers ---

  // Prepare user data for avatar, mapping from ProfileData
  const avatarUser: AppUser | null = userData ? {
      id: userData.id,
      email: userData.email,
      name: userData.first_name && userData.last_name 
        ? `${userData.first_name} ${userData.last_name}` 
        : userData.email,
      role: userData.role,
      createdAt: userData.created_at || new Date().toISOString(), 
      phone: userData.phone || undefined,
      first_name: userData.first_name || undefined,
      last_name: userData.last_name || undefined,
  } : null;

  if (authLoading || !userData) {
    return (
      <AuthLayout>
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Profile & Settings</h1>

        {/* Profile Information Section */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>View and edit your personal information.</CardDescription>
            </div>
             {!isEditingProfile && (
               <Button variant="outline" size="sm" onClick={handleEditToggle}>
                 <Edit className="mr-2 h-4 w-4" /> Edit Profile
               </Button>
             )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {/* Avatar remains display only for now */}
              <div className="flex items-center space-x-4 mb-4">
                <UserAvatar user={avatarUser} size="lg" />
                <div>{/* Placeholder for future upload button */}</div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="first_name">First Name</Label>
                  {isEditingProfile ? (
                    <Input 
                      id="first_name" 
                      name="first_name" 
                      value={editData.first_name || ''} 
                      onChange={handleEditChange} 
                      className="bg-white"
                    />
                  ) : (
                    <p className="text-sm text-slate-700 font-medium p-2 bg-slate-50 rounded-md min-h-[40px]">{userData?.first_name || 'N/A'}</p>
                  )}
                </div>
                {/* Last Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="last_name">Last Name</Label>
                  {isEditingProfile ? (
                     <Input 
                       id="last_name" 
                       name="last_name" 
                       value={editData.last_name || ''} 
                       onChange={handleEditChange} 
                       className="bg-white"
                     />
                   ) : (
                    <p className="text-sm text-slate-700 font-medium p-2 bg-slate-50 rounded-md min-h-[40px]">{userData?.last_name || 'N/A'}</p>
                   )}
                </div>
                {/* Email (Display Only) */}
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <p className="text-sm text-slate-700 font-medium p-2 bg-slate-50 rounded-md min-h-[40px]">{userData?.email}</p>
                </div>
                {/* Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditingProfile ? (
                     <Input 
                       id="phone" 
                       name="phone" 
                       type="tel" 
                       value={editData.phone || ''} 
                       onChange={handleEditChange} 
                       placeholder='(123) 456-7890'
                       className="bg-white"
                     />
                   ) : (
                     <p className="text-sm text-slate-700 font-medium p-2 bg-slate-50 rounded-md min-h-[40px]">{userData?.phone || 'N/A'}</p>
                   )}
                </div>
                {/* Role (Display Only) */}
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <p className="text-sm text-slate-700 font-medium p-2 bg-slate-50 rounded-md capitalize min-h-[40px]">{userData?.role}</p>
                </div>
              </div>

              {/* Profile Status Feedback */}
              {profileStatus === 'success' && !isEditingProfile && (
                <div className="flex items-center gap-2 text-green-700 p-3 bg-green-100 rounded-md border border-green-200 text-sm mt-4">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{profileMessage}</p>
                </div>
              )}
              {profileStatus === 'error' && isEditingProfile && (
                <div className="flex items-center gap-2 text-red-700 p-3 bg-red-100 rounded-md border border-red-200 text-sm mt-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{profileMessage}</p>
                </div>
              )}

              {/* Edit/Save/Cancel Buttons */}
              {isEditingProfile && (
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="ghost" onClick={handleEditToggle} disabled={isSubmittingProfile}>
                    <X className="mr-2 h-4 w-4"/> Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmittingProfile}>
                    {isSubmittingProfile ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Change Password Section */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="new-password"
                />
              </div>

              {/* Password Status Feedback */}
              {passwordStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-700 p-3 bg-green-100 rounded-md border border-green-200 text-sm">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{passwordMessage}</p>
                </div>
              )}
              {passwordStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-700 p-3 bg-red-100 rounded-md border border-red-200 text-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{passwordMessage}</p>
                </div>
              )}

              <Button type="submit" disabled={isSubmittingPassword}>
                {isSubmittingPassword ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

         {/* Placeholder for other Settings Sections */}
         {/* 
         <Card>
           <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
           <CardContent><p>Notification settings...</p></CardContent>
         </Card>
          <Card>
           <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
           <CardContent><p>Theme settings...</p></CardContent>
         </Card>
          <Card>
           <CardHeader><CardTitle>Account</CardTitle></CardHeader>
           <CardContent><p>Delete account...</p></CardContent>
         </Card>
         */}

      </div>
    </AuthLayout>
  );
};

export default UserProfileSettings; 