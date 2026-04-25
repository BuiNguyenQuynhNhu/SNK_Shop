function Notification({ message }: any) {
  if (!message) return null;

  return (
    <div className="alert alert-success position-fixed top-0 end-0 m-3">
      {message}
    </div>
  );
}

export default Notification;
