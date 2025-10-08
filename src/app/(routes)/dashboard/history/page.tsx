import HistoryList from "../_components/HistoryList";

const HistoryPage = () => {
  return (
    <HistoryList
      title="All Consultations"
      subtitle="A complete record of your virtual medical consultations."
      showAddNewButton={false}
      emptyMessage="No consultations recorded yet. Start a new session to see it listed here."
    />
  );
};

export default HistoryPage;
