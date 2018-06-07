using System;
using System.Data;

namespace BestOfTheWorst.Server.Database
{
    public interface IDbSession : IDisposable
    {
        IDbConnection Connection { get; }
    }
}