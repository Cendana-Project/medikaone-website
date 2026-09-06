import { accountStats } from "@/data/dashboard/accountStats";

export default function DashboardCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {accountStats.map((stat) => (
                <div
                    key={stat.role}
                    className="flex flex-col rounded-lg border border-black/10 bg-white shadow-sm transition hover:shadow-md w-full"
                >
                    <div className="bg-gray-50 border-b border-black/10 p-4 px-8 rounded-t-xl">
                        <p className="text-sm font-semibold text-gray-700">{stat.label}</p>
                    </div>

                    <div className="flex-1 flex items-center p-6 px-8">
                        <p className="text-3xl font-bold text-gray-900">
                            {stat.total}{" "}
                            <span className="text-base font-medium text-gray-500">{stat.unit}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
