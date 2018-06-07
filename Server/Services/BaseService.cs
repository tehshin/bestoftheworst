using BestOfTheWorst.Server.Database;

namespace BestOfTheWorst.Server.Services
{
    public class BaseService
    {
        public IDbSession Session { get; set; }

        public BaseService(IDbSession session)
        {
            Session = session;
        }
    }
}