import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";
import TransactionPieChart from "./_components/transaction-pie-chart";
import { getDashboard } from "../_data/getDashboard";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const mothIsInvalid = !month || !isMatch(month, "MM");

  if (mothIsInvalid) {
    redirect("/?month=1");
  }

  const dashboard = await getDashboard(month);
  return (
    <div>
      <Navbar />
      <div className="flex h-full flex-col space-y-6 p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <TimeSelect />
        </div>

        <div className="grid grid-cols-[2fr,1fr] gap-6">
          <div className="flex flex-col gap-6">
            <SummaryCards month={month} {...dashboard} />
            <div className="grid grid-cols-3 grid-rows-1 gap-6">
              <TransactionPieChart {...dashboard} />
            </div>
          </div>

          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
