import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, Clock, MapPin, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Notification {
  id: string;
  type: 'nearby' | 'expiring' | 'pickup' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionable?: boolean;
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'nearby',
      title: 'ready to make difference???',
      message: 'your kichen has extra meals.someone nearby is waiting',
      time: '2 minutes ago',
      read: false,
      actionable: true,
    },
    {
      id: '2',
      type: 'expiring',
      title: 'every meal shared matters',
      message: 'your donation can feed families today...post it before it expires.',
      time: '15 minutes ago',
      read: false,
      actionable: true,
    },
    {
      id: '3',
      type: 'Act fast',
      title: 'meal Alrert:Act fast!!!',
      message: 'Fresh food within 1km .pickup avaliable for the next 2 hours.',
      time: '1 hour ago',
      read: true,
    },
    {
      id: '4',
      type: 'system',
      title: 'Community needs you',
      message: 'new food isting near your area.help redirect it to those in need.',
      time: '3 hours ago',
      read: true,
    },
    {
      id: '5',
      type: 'pickup',
      title: 'you made an impact !',
      message: 'Thank you to you,from saving meals from waste!',
      time: '1 day ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'nearby':
        return <MapPin className="w-5 h-5 text-green-600" />;
      case 'expiring':
        return <Clock className="w-5 h-5 text-red-600" />;
      case 'pickup':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card
      className={`p-4 ${!notification.read ? 'bg-green-500/10 border-green-500/20' : ''}`}
      onClick={() => markAsRead(notification.id)}
    >
      <div className="flex gap-3">
        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-medium text-sm">{notification.title}</h3>
              {!notification.read && (
                <Badge variant="default" className="bg-green-600 text-xs ml-2">
                  New
                </Badge>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNotification(notification.id);
              }}
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          <p className="text-xs text-muted-foreground/60 mt-2">{notification.time}</p>

          {notification.actionable && !notification.read && (
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/dashboard');
                }}
              >
                View Details
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(notification.id);
                }}
              >
                Dismiss
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                ← Back
              </Button>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <h1 className="text-xl font-bold">Notifications</h1>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500">{unreadCount}</Badge>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-20">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500 text-xs">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
            <TabsTrigger value="pickups">Pickups</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-4">
            {notifications.length === 0 ? (
              <Card className="p-8 text-center bg-card">
                <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No notifications yet</p>
              </Card>
            ) : (
              notifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            )}
          </TabsContent>

          <TabsContent value="nearby" className="space-y-3 mt-4">
            {notifications.filter(n => n.type === 'nearby').map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </TabsContent>

          <TabsContent value="pickups" className="space-y-3 mt-4">
            {notifications.filter(n => n.type === 'pickup' || n.type === 'expiring').map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </TabsContent>

          <TabsContent value="system" className="space-y-3 mt-4">
            {notifications.filter(n => n.type === 'system').map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div >
  );
}
