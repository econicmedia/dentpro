'use client';

import React, { useEffect } from 'react';
import { usePageState } from '@/store/uiStore';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Users,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { setPageTitle, setBreadcrumbs } = usePageState();

  // Protect this route - require authentication
  const { isAuthorized } = useRouteProtection();

  useEffect(() => {
    setPageTitle('Dashboard');
    setBreadcrumbs([
      { label: 'Dashboard', current: true }
    ]);
  }, [setPageTitle, setBreadcrumbs]);

  // Don't render content until authorization is confirmed
  if (!isAuthorized) {
    return null;
  }

  // Mock data for demonstration
  const stats = [
    {
      title: 'Today&apos;s Appointments',
      value: '8',
      description: '2 pending confirmations',
      icon: Calendar,
      trend: '+12%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Patients',
      value: '1,234',
      description: '23 new this month',
      icon: Users,
      trend: '+5%',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Documents',
      value: '12',
      description: '3 require urgent review',
      icon: FileText,
      trend: '-8%',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Average Wait Time',
      value: '15 min',
      description: 'Down from last week',
      icon: Clock,
      trend: '-3 min',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const recentAppointments = [
    {
      id: '1',
      patient: 'John Doe',
      time: '09:00 AM',
      type: 'Cleaning',
      status: 'confirmed',
    },
    {
      id: '2',
      patient: 'Jane Smith',
      time: '10:30 AM',
      type: 'Consultation',
      status: 'pending',
    },
    {
      id: '3',
      patient: 'Mike Johnson',
      time: '02:00 PM',
      type: 'Root Canal',
      status: 'confirmed',
    },
    {
      id: '4',
      patient: 'Sarah Wilson',
      time: '03:30 PM',
      type: 'Filling',
      status: 'confirmed',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening at your practice today.
          </p>
        </div>
        <Button className="glass-button">
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{stat.description}</span>
                <Badge variant="outline" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Appointments */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Today&apos;s Appointments</span>
            </CardTitle>
            <CardDescription>
              Manage your appointments for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {appointment.patient}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {appointment.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-foreground">
                      {appointment.time}
                    </span>
                    {getStatusBadge(appointment.status)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/40">
              <Button variant="outline" className="w-full">
                View All Appointments
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add New Patient
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              <span>Pending Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-orange-50 border border-orange-200">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                3 appointment confirmations needed
              </span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">
                2 overdue patient follow-ups
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Recent Completions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">
                5 appointments completed today
              </span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 border border-blue-200">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                12 documents processed this week
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
