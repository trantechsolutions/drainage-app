import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const DrainLineChart = ({ logs, drains, isDark }) => {
    const chartData = useMemo(() => {
        const dataByDate = logs.reduce((acc, log) => {
            const dateKey = new Date(log.date).toISOString().split('T')[0];
            if (!acc[dateKey]) {
                acc[dateKey] = { date: dateKey };
            }
            const drain = drains.find(d => d.id === log.drainId);
            if (drain) {
                 acc[dateKey][drain.name] = (acc[dateKey][drain.name] || 0) + parseFloat(log.amount);
            }
            return acc;
        }, {});

        return Object.values(dataByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [logs, drains]);

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F', '#FFBB28'];

    if (logs.length < 2) {
        return <p className="text-center py-4 text-gray-500 dark:text-gray-400">Log more data to see the chart.</p>;
    }

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#4A5568" : "#E2E8F0"}/>
                    <XAxis dataKey="date" stroke={isDark ? "#A0AEC0" : "#4A5568"}/>
                    <YAxis label={{ value: 'cc', angle: -90, position: 'insideLeft' }} stroke={isDark ? "#A0AEC0" : "#4A5568"}/>
                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#2D3748' : '#FFFFFF', border: '1px solid #4A5568' }}/>
                    <Legend wrapperStyle={{ color: isDark ? "#A0AEC0" : "#4A5568" }}/>
                    {drains.map((drain, index) => (
                        <Line key={drain.id} type="monotone" dataKey={drain.name} stroke={colors[index % colors.length]} activeDot={{ r: 8 }} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export const DrainBarChart = ({ logs, drains, isDark }) => {
    const chartData = useMemo(() => {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

        return drains.map(drain => {
            const relevantLogs = logs.filter(log => log.drainId === drain.id && new Date(log.date) >= sevenDaysAgo);
            const total = relevantLogs.reduce((sum, log) => sum + parseFloat(log.amount), 0);
            return { name: drain.name, total: total };
        });
    }, [logs, drains]);

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F', '#FFBB28'];

    if (logs.length === 0) {
        return <p className="text-center py-4 text-gray-500 dark:text-gray-400">Log data to see the chart.</p>;
    }

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#4A5568" : "#E2E8F0"}/>
                    <XAxis dataKey="name" stroke={isDark ? "#A0AEC0" : "#4A5568"}/>
                    <YAxis label={{ value: 'cc', angle: -90, position: 'insideLeft' }} stroke={isDark ? "#A0AEC0" : "#4A5568"}/>
                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#2D3748' : '#FFFFFF', border: '1px solid #4A5568' }}/>
                    <Bar dataKey="total">
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
