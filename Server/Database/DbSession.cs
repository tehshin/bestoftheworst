using System.Data;
using System.Data.SqlClient;

namespace BestOfTheWorst.Server.Database
{
    public class DbSession : IDbSession
    {
        private static readonly object _lock = new object();
        private readonly string _connectionString;
        private IDbConnection _connection;

        public IDbConnection Connection => GetConnection();

        public DbSession(string connectionString)
        {
            _connectionString = connectionString;
        }

        private IDbConnection GetConnection()
        {
            if (_connection == null)
            {
                lock (_lock)
                {
                    if (_connection == null)
                    {
                        _connection = new SqlConnection(_connectionString);
                        _connection.Open();
                    }
                }
            }

            return _connection;
        }

        public void Dispose()
        {
            if (_connection != null)
                _connection.Dispose();
        }
    }
}