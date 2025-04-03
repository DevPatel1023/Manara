const ClientRFQsTable = ({ RFQs = [] }) => {
  return (
    <div>
      {RFQs.length === 0 ? (
        <p>No RFQs available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Quantity</th>
              <th>Description</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {RFQs.map((rfq, index) => (
              <tr key={index}>
                <td>{rfq.title}</td>
                <td>{rfq.quantity}</td>
                <td>{rfq.description}</td>
                <td>{rfq.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientRFQsTable;
