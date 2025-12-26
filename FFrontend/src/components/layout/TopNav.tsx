import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, User, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { authApi, notificationsApi } from '../../services/api';
import { resolveMediaUrl } from '../../utils/media';

interface TopNavProps {
	userType: 'freelancer' | 'employer';
}

interface NotificationItem {
	id: number | string;
	message?: string;
	title?: string;
	created_at?: string;
	read_at?: string | null;
	read?: boolean;
	data?: any;
}

export default function TopNav({ userType }: TopNavProps) {
	const navigate = useNavigate();
	const [searchType, setSearchType] = useState<'freelancers' | 'employers'>(() => {
		if (typeof window === 'undefined') return 'freelancers';
		const stored = localStorage.getItem('dashboardSearchType');
		return stored === 'employers' ? 'employers' : 'freelancers';
	});
	const [searchTerm, setSearchTerm] = useState('');
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);
	const [loadingNotifications, setLoadingNotifications] = useState(false);
	const [user, setUser] = useState<{ name: string; email: string; avatar: string | null } | null>(null);
	const [loadingUser, setLoadingUser] = useState(true);

	// Mock user data - in production, get from GET /api/auth/user

	useEffect(() => {
		if (typeof window === 'undefined') return;
		localStorage.setItem('dashboardSearchType', searchType);
	}, [searchType]);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await authApi.getCurrentUser();
				const apiUser =
					(response as any).user ||
					(response as any).data?.user ||
					(response as any).user_info;
				if (apiUser) {
					setUser({
						name: apiUser.name || apiUser.full_name || apiUser.email || 'User',
						email: apiUser.email || '',
						avatar: apiUser.avatar || apiUser.profile_picture || null,
					});
				}
			} catch (error) {
				// Handle failed user loading gracefully
			} finally {
				setLoadingUser(false);
			}
		};

		fetchUser();
	}, []);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				setLoadingNotifications(true);
				const response = await notificationsApi.getAll();
				const items = Array.isArray((response as any).data)
					? (response as any).data
					: ((response as any).data?.notifications || []);
				setNotifications(items || []);
			} catch (error) {
				// Handle failed notifications loading gracefully
			} finally {
				setLoadingNotifications(false);
			}
		};

		fetchNotifications();
	}, []);

	const unreadCount = notifications.filter((n) => !n.read && !n.read_at).length;

	const handleLogout = async () => {
		// In production: POST /api/auth/logout
		try {
			await authApi.logout();
		} catch (error) {
			// Handle logout failure gracefully
		}
		localStorage.removeItem('authToken');
		localStorage.removeItem('userType');
		localStorage.removeItem('userId');
		toast.success('Logged out successfully');
		navigate('/login');
	};

	const handleSearchSubmit = (e: any) => {
		e.preventDefault();
		const query = searchTerm.trim();
		const targetPath = searchType === 'freelancers' ? '/freelancers' : '/employers';
		if (query) {
			navigate(`${targetPath}?q=${encodeURIComponent(query)}`);
		} else {
			navigate(targetPath);
		}
	};

	const handleNotificationClick = async (notification: NotificationItem) => {
		if (!notification?.id) return;
		try {
			await notificationsApi.markAsRead(notification.id);
			setNotifications((prev) =>
				prev.map((n) =>
					n.id === notification.id
						? { ...n, read: true, read_at: n.read_at || new Date().toISOString() }
						: n
				),
			);
			const targetUrl = (notification as any)?.data?.url || (notification as any)?.data?.link;
			if (targetUrl) {
				navigate(targetUrl);
			}
		} catch (error) {
			// Handle notification marking failure
		}
	};

	const handleMarkAllAsRead = async () => {
		try {
			await notificationsApi.markAllAsRead();
			setNotifications((prev) =>
				prev.map((n) => ({ ...n, read: true, read_at: n.read_at || new Date().toISOString() })),
			);
		} catch (error) {
			// Handle marking all notifications failure
		}
	};

	const profileEditPath =
		userType === 'freelancer' ? '/freelancer/profile/edit' : '/employer/profile/edit';
	const settingsPath =
		userType === 'freelancer' ? '/freelancer/settings' : '/employer/settings';
	const roleLabel = userType === 'freelancer' ? 'Freelancer' : 'Employer';

	return (
		<header className="bg-background border-b border-border px-6 py-4">
			<div className="flex items-center justify-between gap-6">
				{/* Search */}
				<form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl">
					<div className="flex items-stretch gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search freelancers, skills, companies..."
								className="pl-10 h-11 rounded-xl"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="flex rounded-xl bg-gray-100 p-1">
							<Button
								type="button"
								variant={searchType === 'freelancers' ? 'default' : 'ghost'}
								className="px-3 py-1 h-8 text-xs"
								onClick={() => setSearchType('freelancers')}
							>
								Freelancers
							</Button>
							<Button
								type="button"
								variant={searchType === 'employers' ? 'default' : 'ghost'}
								className="px-3 py-1 h-8 text-xs"
								onClick={() => setSearchType('employers')}
							>
								Jobs & Companies
							</Button>
						</div>
					</div>
				</form>
				
				{/* Right side */}
				<div className="flex items-center gap-4">
					{/* Notifications */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="relative">
								<Bell className="w-5 h-5" />
								{unreadCount > 0 && (
									<Badge
										variant="destructive"
										className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
									>
										{unreadCount}
									</Badge>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-80">
							<DropdownMenuLabel>Notifications</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{loadingNotifications ? (
								<div className="px-2 py-2 text-sm text-gray-500">Loading...</div>
							) : notifications.length === 0 ? (
								<div className="px-2 py-2 text-sm text-gray-500">
									No notifications yet
								</div>
							) : (
								<div className="max-h-80 overflow-y-auto">
									{notifications.map((notification) => {
										const isUnread = !notification.read && !notification.read_at;
										const label =
											notification.title ||
											notification.message ||
											(notification as any)?.data?.message ||
											'New activity on your profile';
										const createdAt = notification.created_at
											? new Date(notification.created_at).toLocaleString()
											: '';
										return (
											<DropdownMenuItem
												key={notification.id}
												onClick={() => handleNotificationClick(notification)}
												className={isUnread ? 'bg-blue-50/60' : ''}
											>
												<div className="flex flex-col gap-0.5 text-sm">
													<span className="font-medium text-gray-900 line-clamp-2">
														{label}
													</span>
													{createdAt && (
														<span className="text-xs text-gray-500">{createdAt}</span>
													)}
												</div>
											</DropdownMenuItem>
										);
									})}
								</div>
							)}

							{unreadCount > 0 && (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleMarkAllAsRead}>
										Mark all as read
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
					
					{/* User Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="gap-2">
								<Avatar className="w-8 h-8">
									<AvatarImage src={resolveMediaUrl(user?.avatar || undefined)} />
									<AvatarFallback>
										{(user?.name || 'User')
											.split(' ')
											.filter(Boolean)
											.map((n) => n[0])
											.join('')}
									</AvatarFallback>
								</Avatar>
								<div className="hidden lg:flex lg:flex-col lg:items-start">
									<div className="flex items-center gap-2">
										<div className="text-sm">{user?.name || 'User'}</div>
										<Badge variant="outline" className="text-[11px] px-2 py-0.5">
											{roleLabel}
										</Badge>
									</div>
									<div className="text-xs text-gray-500">
										{user?.email || (loadingUser ? 'Loading...' : '')}
									</div>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuItem asChild>
								<Link to={profileEditPath} className="cursor-pointer">
									<User className="w-4 h-4 mr-2" />
									My Account
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link to={settingsPath} className="cursor-pointer">
									<Settings className="w-4 h-4 mr-2" />
									Settings
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleLogout}
								className="cursor-pointer text-red-600"
							>
								<LogOut className="w-4 h-4 mr-2" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
