import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import API from '@/api/auth';

const Settings = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    try {
      // Assume /auth/employees/:id for all roles (superadmin, admin, etc.)
      await API.put(`/auth/employees/${user._id || user.id}`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        ...(form.password ? { password: form.password } : {}),
      });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-black">Settings</h1>
      <p className="text-muted-foreground mb-6">View and update your credentials</p>
      <Card className="hrms-card">
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && <div className="text-green-600 bg-green-50 border border-green-200 rounded p-2 text-center">{success}</div>}
          {error && <div className="text-red-600 bg-red-50 border border-red-200 rounded p-2 text-center">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" value={form.email} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={form.phone} onChange={handleChange} disabled={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} disabled={!isEditing} placeholder="Leave blank to keep unchanged" />
          </div>
          <div className="flex gap-4 mt-4">
            {isEditing ? (
              <>
                <Button className="bg-green-600 text-white" onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </>
            ) : (
              <Button className="bg-green-600 text-white" onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;