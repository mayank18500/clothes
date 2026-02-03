import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Package, Users } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
    revenue: number;
    orders: number;
    products: number;
    users: number;
    graphData: { name: string; total: number }[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recentOrders: any[];
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/dashboard', {
                    credentials: 'include'
                });
                const data = await res.json();
                if (res.ok) {
                    setStats(data);
                } else {
                    toast.error(data.message || 'Failed to fetch dashboard data');
                }
            } catch (error) {
                toast.error('An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;
    if (!stats) return <div>No data available</div>;

    const cards = [
        { title: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
        { title: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'text-blue-600' },
        { title: 'Products', value: stats.products, icon: Package, color: 'text-purple-600' },
        { title: 'Total Users', value: stats.users, icon: Users, color: 'text-orange-600' },
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <Card key={card.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {card.title}
                            </CardTitle>
                            <card.icon className={`h-4 w-4 ${card.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.graphData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#000000"
                                    fill="url(#colorTotal)"
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;
