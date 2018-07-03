using System;
using System.Security.Cryptography;
using System.Text;

namespace BestOfTheWorst.Server.Infrastructure.Helpers
{
    public class GravatarHelper
    {
        public static string CreateHash(string source)
        {
            if (string.IsNullOrEmpty(source))
            {
                return null;
            }

            using (var md5Hasher = MD5.Create())
            {
                byte[] data = md5Hasher.ComputeHash(Encoding.Default.GetBytes(source));
                return BitConverter.ToString(data).Replace("-", "").ToLower();
            }
        }
    }
}