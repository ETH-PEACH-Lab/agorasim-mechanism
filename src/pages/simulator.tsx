import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function SocialMediaSimulator() {
    const [personalization, setPersonalization] = useState(1.0);
    const [moderation, setModeration] = useState(1.0);
    const [adTargeting, setAdTargeting] = useState(1.0);
    const [users, setUsers] = useState(10);
    const [engagement, setEngagement] = useState(1.0);
    const [publicCampaignCount, setPublicCampaignCount] = useState(0);
    const [reputation, setReputation] = useState(1.0);
    const [revenue, setRevenue] = useState(10000);
    const [day, setDay] = useState(1);
    const [logs, setLogs] = useState([]);
    const [history, setHistory] = useState([
        { day: 0, users: 10, engagement: 1.0, reputation: 1.0, revenue: 10000 }
    ]);

    function simulateRound() {
        let newEngagement = engagement + personalization * 0.05 - moderation * 0.03;
        let newReputation = reputation + moderation * 0.04 - personalization * 0.02 - adTargeting * 0.01;
        if (moderation > 1.5) {
            newReputation += 0.05;
        }
        let newRevenue = revenue + newEngagement * adTargeting * Math.max(newReputation, 0.1) * 100;
        let userChange = (newEngagement * 0.01 + newReputation * 0.05 - Math.random() * 0.02) * users;
        let newUsers = Math.max(5, Math.min(15, users + Math.floor(userChange)));

        if (newReputation < 0.5) {
            newUsers = Math.max(5, Math.floor(newUsers - users * 0.01));
            newRevenue = newRevenue * 0.95;
        }

        if (newReputation < 0.3 && Math.random() < 0.2) {
            setLogs((prevLogs) => [
                ...prevLogs,
                `Critical Event on Day ${day}: Regulatory warning issued due to low reputation! Revenue hit.`
            ]);
            newRevenue = newRevenue * 0.9;
        }

        if (Math.random() < personalization * 0.1) {
            setLogs((prevLogs) => [
                ...prevLogs,
                `Critical Event on Day ${day}: A filter bubble scandal caused a reputation loss!`
            ]);
            newReputation = Math.max(0, newReputation - 0.1);
        }
        if (newUsers < users) {
            setLogs((prevLogs) => [
                ...prevLogs,
                `Critical Event on Day ${day}: Users are leaving the platform due to declining engagement or reputation!`
            ]);
        }
        setEngagement(Math.max(0, newEngagement));
        setReputation(Math.max(0, newReputation));
        setRevenue(Math.max(0, newRevenue));
        setUsers(newUsers);
        setDay(day + 1);
        setLogs((prevLogs) => [
            ...prevLogs,
            `Day ${day}: Users=${newUsers}, Engagement=${newEngagement.toFixed(2)}, Reputation=${newReputation.toFixed(2)}, Revenue=$${Math.round(newRevenue).toLocaleString()}`
        ]);
        setHistory([
            ...history,
            {
                day: day,
                users: newUsers,
                engagement: newEngagement,
                reputation: newReputation,
                revenue: newRevenue
            }
        ]);
    }

    function runPublicCampaign() {
        setPublicCampaignCount((prev) => prev + 1);
        const campaignEffect = Math.max(0.05, 0.2 - publicCampaignCount * 0.05);
        setReputation((prev) => Math.min(2.0, prev + campaignEffect));
        setRevenue((prev) => prev * 0.9);
        setLogs((prev) => [
            ...prev,
            `Critical Event on Day ${day}: Public Campaign launched. Reputation improved by ${campaignEffect.toFixed(2)}, Revenue decreased by 10%.`
        ]);
    }

    function resetSimulation() {
        setPersonalization(1.0);
        setModeration(1.0);
        setAdTargeting(1.0);
        setUsers(10);
        setEngagement(1.0);
        setReputation(1.0);
        setRevenue(10000);
        setDay(1);
        setLogs([]);
        setHistory([{ day: 0, users: 10, engagement: 1.0, reputation: 1.0, revenue: 10000 }]);
    }

    const chartData = {
        labels: history.map((h) => `Day ${h.day}`),
        datasets: [
            {
                label: "Users",
                data: history.map((h) => h.users),
                borderColor: "#3b82f6",
                backgroundColor: "#3b82f680",
                yAxisID: "y1"
            },
            {
                label: "Engagement",
                data: history.map((h) => h.engagement),
                borderColor: "#10b981",
                backgroundColor: "#10b98180",
                yAxisID: "y2"
            },
            {
                label: "Reputation",
                data: history.map((h) => h.reputation),
                borderColor: "#f59e0b",
                backgroundColor: "#f59e0b80",
                yAxisID: "y2"
            },
            {
                label: "Revenue",
                data: history.map((h) => h.revenue),
                borderColor: "#ef4444",
                backgroundColor: "#ef444480",
                yAxisID: "y3"
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        interaction: {
            mode: "index",
            intersect: false
        },
        stacked: false,
        scales: {
            y1: {
                type: "linear",
                display: true,
                position: "left",
                title: {
                    display: true,
                    text: "Users"
                }
            },
            y2: {
                type: "linear",
                display: true,
                position: "right",
                title: {
                    display: true,
                    text: "Engagement / Reputation"
                },
                grid: {
                    drawOnChartArea: false
                }
            },
            y3: {
                type: "linear",
                display: true,
                position: "right",
                title: {
                    display: true,
                    text: "Revenue"
                },
                grid: {
                    drawOnChartArea: false
                },
                offset: true
            }
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Social Media Simulator</h1>
                <div className="space-x-2">
                    <Button variant="outline" onClick={resetSimulation}>Reset</Button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <Card className="flex-1">
                    <CardContent className="space-y-2 p-4">
                        <div>
                            <label>Personalization Strength: {personalization.toFixed(2)}</label>
                            <Slider min={0} max={5} step={0.1} value={[personalization]} onValueChange={(v) => {
                                const increaseAmount = v[0] - personalization;
                                if (increaseAmount > 0) {
                                    const chargeRate = 0.05 * increaseAmount;  // 5% per unit increase
                                    setRevenue((prev) => prev * (1 - chargeRate));
                                    setLogs((prev) => [
                                        ...prev,
                                        `Critical Event on Day ${day}: Upgraded Personalization Algorithm by ${increaseAmount.toFixed(2)}. Revenue decreased by ${(chargeRate * 100).toFixed(1)}%.`
                                    ]);
                                }
                                setPersonalization(v[0]);
                            }} />
                        </div>
                        <div>
                            <label>Moderation Strictness: {moderation.toFixed(2)}</label>
                            <Slider min={0} max={2} step={0.1} value={[moderation]} onValueChange={(v) => {
                                 const increaseAmount = v[0] - moderation;
                                if (increaseAmount > 0) {
                                    const chargeRate = 0.05 * increaseAmount;  // 5% per unit increase
                                    setRevenue((prev) => prev * (1 - chargeRate));
                                    setLogs((prev) => [
                                        ...prev,
                                        `Critical Event on Day ${day}: Upgraded moderation efforts by ${increaseAmount.toFixed(2)}. Revenue decreased by ${(chargeRate * 100).toFixed(1)}%.`
                                    ]);
                                }
                                setModeration(v[0]);
                            }} />
                        </div>
                        <div>
                            <label>Ad Targeting Aggressiveness: {adTargeting.toFixed(2)}</label>
                            <Slider min={0} max={2} step={0.1} value={[adTargeting]} onValueChange={(v) => {
                                 const increaseAmount = v[0] - adTargeting;
                                if (increaseAmount > 0) {
                                    const chargeRate = 0.05 * increaseAmount;  // 5% per unit increase
                                    setRevenue((prev) => prev * (1 - chargeRate));
                                    setLogs((prev) => [
                                        ...prev,
                                        `Critical Event on Day ${day}: Upgraded ad targeting Algorithm by ${increaseAmount.toFixed(2)}. Revenue decreased by ${(chargeRate * 100).toFixed(1)}%.`
                                    ]);
                                }
                                setAdTargeting(v[0]);
                            }} />
                        </div>
                        <Button onClick={simulateRound}>Simulate Day {day}</Button>
                        <Button variant="outline" onClick={runPublicCampaign}>Public Campaign</Button>
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <CardContent className="p-4 space-y-2">
                        <div><strong>Stats:</strong></div>
                        {reputation < 0.5 && (
                            <div className="text-red-500 font-semibold">
                                Warning: Reputation critically low! Consider increasing moderation or launching a Public Campaign.
                            </div>
                        )}
                        <div>Users: {users}</div>
                        <div>Engagement: {engagement.toFixed(2)}</div>
                        <div>Reputation: {reputation.toFixed(2)}</div>
                        <div>Revenue: ${Math.round(revenue).toLocaleString()}</div>
                        <div><strong>Critical Events:</strong></div>
                        <div className="space-y-1">
                            {logs.filter(log => log.includes('Critical Event')).map((log, idx) => <div key={idx}>{log}</div>)}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col md:flex-row gap-4">

                <Card className="flex-1">
                    <CardContent className="p-4">
                        <Line options={chartOptions} data={chartData} />
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <CardContent className="p-4 space-y-2">
                        <div><strong>Simulation Log:</strong></div>
                        <div className="space-y-1">
                            {logs.map((log, idx) => <div key={idx}>{log}</div>)}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
